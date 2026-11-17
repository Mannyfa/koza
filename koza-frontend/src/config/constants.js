// --- API Configuration ---
// Values can be overridden at build time with REACT_APP_* environment variables.
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://koza-2fkh.onrender.com';
export const API_URL = `${API_BASE_URL}/api`;
export const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || 'pk_live_0656fb181e5469d49bf27ae2852ec9a830386d8b';
export const PAYSTACK_SCRIPT_URL = 'https://js.paystack.co/v1/inline.js';

export const PLACEHOLDER_IMAGE = 'https://placehold.co/400x500/cccccc/333333?text=No+Image';

export const PRODUCTS_PER_PAGE = 12;
export const NOTIFICATION_DURATION_MS = 3000;
export const HERO_SLIDE_INTERVAL_MS = 6000;

export const WHATSAPP_NUMBER = '2348142600088';
export const CONTACT_EMAIL = 'opevickyscents@gmail.com';

export const STORAGE_KEYS = {
    THEME: 'theme',
    TOKEN: 'token',
    USER: 'user',
    CART: 'cart',
};
