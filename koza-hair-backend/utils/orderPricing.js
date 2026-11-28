// Server-side order pricing and Paystack verification.
// Never trust prices sent by the browser: everything here is recomputed
// from the database and checked against what Paystack says was paid.

const axios = require('axios');

class OrderError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.status = status;
    }
}

const effectivePrice = (product) => {
    const discount = Number(product.discountPercentage) || 0;
    return discount > 0 ? product.price - product.price * (discount / 100) : product.price;
};

/** Out of stock when the admin switch is on or the stock count has reached 0. */
const isOutOfStock = (product) => product.isOutOfStock === true || product.stockAmount === 0;

const cartItemId = (item) => String(item.id || item._id || item.product || '');

/**
 * Rebuilds the cart from the database.
 * @param {Array} clientCart  items from the browser ({ id, quantity, ... })
 * @param {Function} findProductsByIds  async (ids) => product documents
 * @returns {{ cart: Array, total: number }} total in Naira
 */
const buildOrderCart = async (clientCart, findProductsByIds) => {
    if (!Array.isArray(clientCart) || clientCart.length === 0) {
        throw new OrderError('Your cart is empty.');
    }

    // Merge duplicate lines and validate quantities
    const quantities = new Map();
    for (const item of clientCart) {
        const id = cartItemId(item);
        const quantity = Number(item.quantity);
        if (!id || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
            throw new OrderError('Your cart contains an invalid item.');
        }
        quantities.set(id, (quantities.get(id) || 0) + quantity);
    }

    const products = await findProductsByIds([...quantities.keys()]);
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const cart = [...quantities.entries()].map(([id, quantity]) => {
        const product = byId.get(id);
        if (!product || product.isActive === false) {
            throw new OrderError('An item in your cart is no longer available.');
        }
        if (isOutOfStock(product)) {
            throw new OrderError(`${product.name} is out of stock.`);
        }
        if (typeof product.stockAmount === 'number' && quantity > product.stockAmount) {
            throw new OrderError(`Only ${product.stockAmount} of ${product.name} left. Please reduce the quantity in your bag.`);
        }
        return {
            id,
            product: id,
            name: product.name,
            price: effectivePrice(product),
            originalPrice: product.price,
            discountPercentage: Number(product.discountPercentage) || 0,
            quantity,
            image: product.image || (product.images && product.images[0]) || '',
            images: product.images || [],
            bottleSize: product.bottleSize || '',
        };
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { cart, total };
};

/** Same rounding the storefront uses when it opens the Paystack popup. */
const toKobo = (naira) => Math.round(naira * 100);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const PAYSTACK_API = 'https://api.paystack.co';

/** Removes spaces, quotes and line breaks that often sneak in when a key is pasted. */
const cleanSecretKey = (key) => String(key || '').trim().replace(/^["']|["']$/g, '').trim();

/** 'live' | 'test' | 'public-key' | 'missing' | 'unknown' — safe to show, never reveals the key. */
const paystackKeyMode = (key) => {
    const k = cleanSecretKey(key);
    if (!k) return 'missing';
    if (k.startsWith('sk_live_')) return 'live';
    if (k.startsWith('sk_test_')) return 'test';
    if (k.startsWith('pk_')) return 'public-key';
    return 'unknown';
};

const withDetail = (error, detail) => Object.assign(error, { detail });

/**
 * Asks Paystack whether `reference` is a successful NGN payment.
 * Retries network errors and Paystack outages; key problems fail straight away
 * with a `detail` explaining what to fix (used in logs and admin alerts).
 * @returns the Paystack transaction `data` object
 */
const verifyPaystackTransaction = async (reference, secretKey, httpGet = axios.get, { attempts = 3, pauseMs = 1500 } = {}) => {
    const key = cleanSecretKey(secretKey);
    if (!key) {
        throw withDetail(new OrderError('Payment verification is not configured on the server.', 500),
            'PAYSTACK_SECRET_KEY is not set on Render.');
    }

    let response;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            response = await httpGet(`${PAYSTACK_API}/transaction/verify/${encodeURIComponent(reference)}`, {
                headers: { Authorization: `Bearer ${key}` },
                timeout: 20000,
            });
            break;
        } catch (error) {
            const status = error.response && error.response.status;
            const paystackMessage = error.response && error.response.data && error.response.data.message;
            console.error(`Paystack verify failed for ${reference} (attempt ${attempt}/${attempts}, key mode ${paystackKeyMode(key)}): `
                + `${status ? `HTTP ${status}` : 'no response'} ${paystackMessage || error.message}`);

            if (status === 401 || status === 403) {
                throw withDetail(new OrderError('Payment verification is not set up correctly on the server.', 500),
                    `Paystack rejected the secret key (HTTP ${status}: ${paystackMessage || 'unauthorised'}). `
                    + 'Copy the live secret key from Paystack → Settings → API Keys and paste it into PAYSTACK_SECRET_KEY on Render.');
            }
            if (status === 400 || status === 404) {
                throw withDetail(new OrderError('We could not find this payment on Paystack.', 502),
                    `Paystack says: "${paystackMessage || 'transaction not found'}" (HTTP ${status}). `
                    + (paystackKeyMode(key) === 'test'
                        ? 'The key on Render is a TEST key (sk_test_) but the website takes live payments: use the sk_live_ key.'
                        : 'Make sure the secret key on Render belongs to the same Paystack account as the website public key.'));
            }
            if (attempt === attempts) {
                throw withDetail(new OrderError('We could not reach Paystack to confirm your payment.', 502),
                    `${status ? `Paystack returned HTTP ${status}` : 'No response from Paystack'}: ${paystackMessage || error.message}`);
            }
            await wait(pauseMs * attempt);
        }
    }

    const { status, data } = response.data || {};
    if (status !== true || !data || data.status !== 'success') {
        throw new OrderError('Payment was not successful.');
    }
    if (data.reference !== reference) {
        throw new OrderError('Payment reference mismatch.');
    }
    if (data.currency && data.currency !== 'NGN') {
        throw new OrderError('Payment was made in an unexpected currency.');
    }
    return data;
};

/** Checks the secret key against Paystack without touching any payment. */
const checkPaystackKey = async (secretKey, httpGet = axios.get) => {
    const key = cleanSecretKey(secretKey);
    const mode = paystackKeyMode(key);
    if (mode === 'missing') return { ok: false, mode, message: 'PAYSTACK_SECRET_KEY is not set on Render.' };
    if (mode === 'public-key') return { ok: false, mode, message: 'PAYSTACK_SECRET_KEY holds a public key (pk_...). It needs the secret key (sk_live_...).' };
    try {
        await httpGet(`${PAYSTACK_API}/transaction?perPage=1`, { headers: { Authorization: `Bearer ${key}` }, timeout: 15000 });
        return {
            ok: mode === 'live',
            mode,
            message: mode === 'live'
                ? 'Connected to Paystack with a live secret key.'
                : 'Paystack accepted the key, but it is not a live key (sk_live_...). Live payments cannot be confirmed with it.',
        };
    } catch (error) {
        const status = error.response && error.response.status;
        const paystackMessage = error.response && error.response.data && error.response.data.message;
        if (status === 401 || status === 403) {
            return { ok: false, mode, message: `Paystack rejected the secret key (${paystackMessage || 'invalid key'}). Paste the current live secret key into PAYSTACK_SECRET_KEY on Render.` };
        }
        return { ok: false, mode, message: `Could not reach Paystack to check the key (${status ? `HTTP ${status}` : error.message}). Try again shortly.` };
    }
};

module.exports = {
    OrderError, buildOrderCart, effectivePrice, isOutOfStock, toKobo,
    cleanSecretKey, paystackKeyMode, verifyPaystackTransaction, checkPaystackKey,
};
