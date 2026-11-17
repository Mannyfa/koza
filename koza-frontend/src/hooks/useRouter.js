import { useCallback, useEffect, useState } from 'react';
import { slugify } from '../utils/formatters';

const PRODUCT_PREFIX = '/product/';

const pageFromPath = (path) => {
    if (path === '/' || path === '') return 'home';
    if (path.startsWith(PRODUCT_PREFIX)) return 'product';
    return path.substring(1);
};

const findProductBySlug = (products, path) => {
    const slug = path.split(PRODUCT_PREFIX)[1];
    return products.find((p) => slugify(p.name) === slug);
};

/**
 * Lightweight history-API router.
 * Keeps `currentPage` / `selectedProduct` in sync with the address bar,
 * supports product deep links (/product/:slug) and browser back/forward.
 */
const useRouter = (allProducts) => {
    const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Resolve a deep-linked product once the catalogue has loaded
    useEffect(() => {
        const path = window.location.pathname;
        if (!path.startsWith(PRODUCT_PREFIX) || allProducts.length === 0 || selectedProduct) return;

        const product = findProductBySlug(allProducts, path);
        if (product) {
            setSelectedProduct(product);
        } else {
            setCurrentPage('shop');
            window.history.replaceState({}, '', '/shop');
        }
    }, [allProducts, selectedProduct]);

    // Browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            const path = window.location.pathname;
            const page = pageFromPath(path);
            setCurrentPage(page);
            if (page === 'product') {
                if (allProducts.length > 0) setSelectedProduct(findProductBySlug(allProducts, path) || null);
            } else {
                setSelectedProduct(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [allProducts]);

    const navigate = useCallback((page, data = null) => {
        setCurrentPage(page);

        if (page === 'product' && data) {
            setSelectedProduct(data);
            window.history.pushState({}, '', `${PRODUCT_PREFIX}${slugify(data.name)}`);
        } else {
            setSelectedProduct(null);
            window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return { currentPage, selectedProduct, setSelectedProduct, navigate };
};

export default useRouter;
