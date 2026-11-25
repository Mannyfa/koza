import { useCallback, useEffect, useState } from 'react';
import { productSlug, slugify } from '../utils/formatters';

const PRODUCT_PREFIX = '/product/';

const pageFromPath = (path) => {
    if (path === '/' || path === '') return 'home';
    if (path.startsWith(PRODUCT_PREFIX)) return 'product';
    return path.substring(1);
};

// Matches the current address (name-size-idsuffix), then the id suffix alone,
// then older name-only links shared before addresses became unique.
const findProductBySlug = (products, path) => {
    let slug = path.split(PRODUCT_PREFIX)[1] || '';
    try { slug = decodeURIComponent(slug); } catch { /* keep the raw value */ }
    slug = slug.replace(/\/$/, '').toLowerCase();
    if (!slug) return undefined;
    const idSuffix = slug.split('-').pop();
    return products.find((p) => productSlug(p) === slug)
        || (/^[0-9a-f]{6}$/.test(idSuffix) && products.find((p) => String(p._id || p.id).toLowerCase().endsWith(idSuffix)))
        || products.find((p) => slugify(p.name) === slug);
};

/**
 * Lightweight history-API router.
 * Keeps `currentPage` / `selectedProduct` in sync with the address bar,
 * supports product deep links (/product/:slug) and browser back/forward.
 */
const useRouter = (allProducts, catalogueComplete = true) => {
    const [currentPage, setCurrentPage] = useState(() => pageFromPath(window.location.pathname));
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Resolve a deep-linked product once the catalogue has loaded
    useEffect(() => {
        const path = window.location.pathname;
        if (!path.startsWith(PRODUCT_PREFIX) || allProducts.length === 0 || selectedProduct) return;

        const product = findProductBySlug(allProducts, path);
        if (product) {
            setSelectedProduct(product);
        } else if (catalogueComplete) {
            // Only give up once the live catalogue has loaded (the snapshot may be older)
            setCurrentPage('shop');
            window.history.replaceState({}, '', '/shop');
        }
    }, [allProducts, selectedProduct, catalogueComplete]);

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
            window.history.pushState({}, '', `${PRODUCT_PREFIX}${productSlug(data)}`);
        } else {
            setSelectedProduct(null);
            window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return { currentPage, selectedProduct, setSelectedProduct, navigate };
};

export default useRouter;
