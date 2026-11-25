// Product categories offered in the admin panel and used for storefront filters.
const PRODUCT_CATEGORIES = [
    'Perfume',
    'Perfume Oil',
    'Body Mist',
    'Body Spray',
    'Roll On',
    'Scented Candle',
    'Diffuser',
    'Room Spray',
    'Home Decor & Accessories',
    'Gift Set',
    'Other',
];

/** Returns a known category name, or '' when the value is empty or unknown. */
const cleanCategory = (value) => {
    const match = PRODUCT_CATEGORIES.find((c) => c.toLowerCase() === String(value || '').trim().toLowerCase());
    return match || '';
};

module.exports = { PRODUCT_CATEGORIES, cleanCategory };
