export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://koza-2fkh.onrender.com';
export const API_URL = `${API_BASE_URL}/api`;

// Fallback only: the live list comes from the backend (GET /api/products/categories),
// so new categories are added in one place (koza-hair-backend/utils/categories.js).
export const PRODUCT_CATEGORIES = [
    'Perfume', 'Perfume Oil', 'Body Mist', 'Body Spray', 'Roll On', 'Scented Candle', 'Diffuser',
    'Car Diffuser', 'Room Spray', 'Home Decor & Accessories', 'Gift Set', 'Other',
];

export const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const STATUS_STYLES = {
    Processing: 'bg-amber-100 text-amber-700',
    Shipped: 'bg-blue-100 text-blue-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
};

export const canManage = (role) => role === 'superadmin' || role === 'manager';
