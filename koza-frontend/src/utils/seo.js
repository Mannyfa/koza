// Keeps <title>, meta description, canonical link and share tags in step with the
// page being shown. The build-time pre-render writes the same tags into each
// page's HTML; this keeps them right as visitors (and Google's renderer) navigate.

import { getEffectivePrice, getImageUrl, isOutOfStock, productSlug } from './formatters';

export const SITE_NAME = 'Opevicky Scents';
const DEFAULT_DESCRIPTION = 'Shop authentic luxury perfumes, perfume oils, scented candles and diffusers in Nigeria. Fast delivery in Lagos and nationwide from Opevicky Scents.';

const PAGE_META = {
    home: { title: `${SITE_NAME} | Luxury Perfumes & Fragrances in Nigeria`, description: DEFAULT_DESCRIPTION, path: '/' },
    shop: { title: `Shop All Fragrances | ${SITE_NAME}`, description: 'Browse our full collection of designer and Arabian perfumes, perfume oils, body mists, scented candles and home diffusers, delivered across Nigeria.', path: '/shop' },
    learn: { title: `Candle, Diffuser & Gypsum Training | ${SITE_NAME}`, description: 'Online and physical training in scented candle making, home and car diffusers, room sprays and gypsum craft. Learn a skill and start a business.', path: '/learn' },
    about: { title: `Our Story | ${SITE_NAME}`, description: 'How Opevicky Scents grew from one dozen bottles of perfume oil in 2020 into a trusted Nigerian fragrance brand.', path: '/about' },
    contact: { title: `Contact Us | ${SITE_NAME}`, description: 'Questions about a fragrance, an order or our training? Message Opevicky Scents on WhatsApp, email or our contact form.', path: '/contact' },
    track: { title: `Track Your Order | ${SITE_NAME}`, description: 'Check the status of your Opevicky Scents order with your email and order number. No account needed.', path: '/track' },
};

const NO_INDEX_PAGES = new Set(['cart', 'checkout', 'orderConfirmation', 'orders', 'wishlist', 'auth', 'search']);

const truncate = (text, max = 160) => {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
};

const setTag = (selector, create, attr, value) => {
    let el = document.head.querySelector(selector);
    if (!el) {
        el = create();
        document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
};

const setMeta = (key, value, by = 'name') =>
    setTag(`meta[${by}="${key}"]`, () => {
        const m = document.createElement('meta');
        m.setAttribute(by, key);
        return m;
    }, 'content', value);

/** Meta for a product page. */
export const productMeta = (product) => {
    const price = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(getEffectivePrice(product));
    const bits = [product.category, product.bottleSize].map((v) => String(v || '').trim()).filter(Boolean).join(', ');
    return {
        title: `${product.name.trim()}${bits ? ` (${bits})` : ''} | ${SITE_NAME}`,
        description: truncate(`${product.name.trim()} for ${price}${isOutOfStock(product) ? ' (currently out of stock)' : ''}. ${product.description || DEFAULT_DESCRIPTION}`),
        path: `/product/${productSlug(product)}`,
        image: getImageUrl(product.images?.[0] || product.image),
    };
};

/** Applies title/description/canonical/share tags for the current page. */
export const applyPageMeta = ({ page, product, searchQuery }) => {
    let meta;
    if (page === 'product' && product) meta = productMeta(product);
    else if (page === 'search') meta = { title: `Search${searchQuery ? `: ${searchQuery}` : ''} | ${SITE_NAME}`, description: DEFAULT_DESCRIPTION, path: '/search' };
    else meta = PAGE_META[page] || { ...PAGE_META.home, path: `/${page}` };

    const origin = window.location.origin;
    const url = `${origin}${meta.path}`;
    const image = meta.image || `${origin}/opvlogo.png`;

    document.title = meta.title;
    setMeta('description', meta.description);
    setMeta('robots', NO_INDEX_PAGES.has(page) ? 'noindex, follow' : 'index, follow');
    setTag('link[rel="canonical"]', () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
    }, 'href', url);
    setMeta('og:title', meta.title, 'property');
    setMeta('og:description', meta.description, 'property');
    setMeta('og:url', url, 'property');
    setMeta('og:image', image, 'property');
    setMeta('og:type', page === 'product' ? 'product' : 'website', 'property');
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    setMeta('twitter:image', image);
};
