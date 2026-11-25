import { API_BASE_URL, PLACEHOLDER_IMAGE } from '../config/constants';

export const formatPrice = (price) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);

export const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });

/** Resolves a product image path to a full URL, falling back to a placeholder. */
export const getImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    return path.startsWith('http') ? path : `${API_BASE_URL}/${path}`;
};

/** Price after any percentage discount has been applied. */
export const getEffectivePrice = (product) =>
    product.discountPercentage > 0
        ? product.price - product.price * (product.discountPercentage / 100)
        : product.price;

/** Total value of every item in the cart, discounts included. */
export const getCartSubtotal = (cart) =>
    cart.reduce((total, item) => total + getEffectivePrice(item) * item.quantity, 0);

/** URL-safe slug used for product deep links (e.g. /product/oud-wood). */
export const slugify = (text = '') =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

/** True when the admin "Out of Stock" switch is on or the stock count has reached 0. */
export const isOutOfStock = (product) => product.isOutOfStock === true || product.stockAmount === 0;

/**
 * Unique, readable URL slug for a product page, e.g. "storm-100ml-a1b2c3".
 * Several products share a name, so the size and the end of the id keep each address unique.
 * Keep in step with scripts/prerender.js.
 */
export const productSlug = (product) => {
    const id = String(product._id || product.id || '');
    const base = slugify(`${product.name || ''} ${product.bottleSize || ''}`);
    return id ? `${base}-${id.slice(-6).toLowerCase()}` : base;
};
