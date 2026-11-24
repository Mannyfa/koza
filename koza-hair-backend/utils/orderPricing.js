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

/**
 * Asks Paystack whether `reference` is a successful NGN payment.
 * @returns the Paystack transaction `data` object
 */
const verifyPaystackTransaction = async (reference, secretKey, httpGet = axios.get) => {
    if (!secretKey) {
        throw new OrderError('Payment verification is not configured on the server.', 500);
    }
    let response;
    try {
        response = await httpGet(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: { Authorization: `Bearer ${secretKey}` },
            timeout: 15000,
        });
    } catch (error) {
        const detail = error.response ? JSON.stringify(error.response.data) : error.message;
        console.error('Paystack verification request failed:', detail);
        throw new OrderError('We could not confirm your payment with Paystack.', 502);
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

module.exports = { OrderError, buildOrderCart, effectivePrice, isOutOfStock, toKobo, verifyPaystackTransaction };
