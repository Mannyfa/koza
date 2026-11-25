import { API_URL, STORAGE_KEYS } from '../config/constants';
import { getItem } from '../utils/storage';

const getToken = () => getItem(STORAGE_KEYS.TOKEN);

const authHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Thin fetch wrapper: sends JSON, parses JSON, and throws an Error carrying
 * the server's `message` when the response is not ok.
 */
const request = async (endpoint, { method = 'GET', body, auth = false } = {}) => {
    const headers = {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(auth && authHeaders()),
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        ...(body !== undefined && { body: JSON.stringify(body) }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
};

// --- Products ---
const normaliseProducts = (products) =>
    products
        .filter((product) => product.isActive !== false)
        .map((product) => ({ ...product, id: product._id || product.id }));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Live catalogue from the API. Retries with growing pauses because the free
 * Render server can take up to a minute to wake up.
 */
export const fetchProducts = async ({ attempts = 4, timeoutMs = 45000 } = {}) => {
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(`${API_URL}/products`, { signal: controller.signal });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return normaliseProducts(data.data.products);
        } catch (error) {
            lastError = error.name === 'AbortError' ? new Error('The product server took too long to respond.') : error;
            if (attempt < attempts) await wait(2000 * attempt);
        } finally {
            clearTimeout(timer);
        }
    }
    throw lastError;
};

/**
 * Catalogue snapshot written at build time (public/products-snapshot.json) and
 * served from Vercel's CDN. Loads instantly even while the API is waking up.
 * Returns [] when there is no snapshot (e.g. local development).
 */
export const fetchProductSnapshot = async () => {
    try {
        const response = await fetch('/products-snapshot.json', { cache: 'no-cache' });
        if (!response.ok || !(response.headers.get('content-type') || '').includes('json')) return [];
        const data = await response.json();
        return Array.isArray(data.products) ? normaliseProducts(data.products) : [];
    } catch {
        return [];
    }
};

export const submitReview = (productId, { rating, text }) =>
    request(`/products/${productId}/reviews`, { method: 'POST', body: { rating, text }, auth: true });

// --- Auth ---
export const login = (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } });

export const register = (email, password) =>
    request('/auth/register', { method: 'POST', body: { email, password } });

export const forgotPassword = (email) =>
    request('/auth/forgot-password', { method: 'POST', body: { email } });

export const resetPassword = (email, code, newPassword) =>
    request('/auth/reset-password', { method: 'POST', body: { email, code, newPassword } });

// --- User ---
export const updateWishlist = (wishlist) =>
    request('/users/wishlist', { method: 'PUT', body: { wishlist }, auth: true });

// --- Orders & Payments ---
export const fetchMyOrders = async () => {
    if (!getToken()) return [];
    const data = await request('/orders/my-orders', { auth: true });
    return Array.isArray(data) ? data : (data.orders || data.data || []);
};

export const verifyPayment = (reference, cart, customer) =>
    request('/payments/verify', { method: 'POST', body: { reference, cart, customer }, auth: true });

/** Asks the server to price the cart and confirm every item is in stock, before paying. */
export const validateCart = (cart) =>
    request('/orders/validate-cart', { method: 'POST', body: { cart } });

// --- Guest order tracking & contact ---
export const trackOrder = (email, orderNumber) =>
    request('/orders/track', { method: 'POST', body: { email, orderNumber } });

export const sendContactMessage = (message) =>
    request('/contact', { method: 'POST', body: message });
