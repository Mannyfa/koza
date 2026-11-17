import { useEffect, useState } from 'react';
import { PRODUCTS_PER_PAGE } from '../config/constants';

/** Client-side pagination; resets to page 1 whenever `items` changes. */
const usePagination = (items, perPage = PRODUCTS_PER_PAGE) => {
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => { setCurrentPage(1); }, [items]);

    const totalPages = Math.ceil(items.length / perPage);
    const start = (currentPage - 1) * perPage;
    const pageItems = items.slice(start, start + perPage);

    const goToPage = (page) => {
        setCurrentPage(Math.min(Math.max(page, 1), Math.max(totalPages, 1)));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return { currentPage, totalPages, pageItems, goToPage };
};

export default usePagination;
