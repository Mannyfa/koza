import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import Pagination from '../components/common/Pagination';
import { SearchIcon } from '../components/icons';
import ProductGrid from '../components/product/ProductGrid';
import usePagination from '../hooks/usePagination';
import { btnPrimary, card, pageShell } from '../styles/classNames';

const SearchPage = ({ searchResults, onProductClick, onSearch, loading, query, onToggleWishlist, currentUser }) => {
    const [draft, setDraft] = useState(query);
    const { currentPage, totalPages, pageItems, goToPage } = usePagination(searchResults);
    const hasResults = searchResults.length > 0;

    useEffect(() => { setDraft(query); }, [query]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (draft.trim()) onSearch(draft.trim());
    };

    return (
        <motion.div {...pageMotionProps} className={pageShell}>
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
                    <form onSubmit={handleSubmit} role="search" className="flex items-center gap-4 border-b border-[#111] dark:border-white pb-3 max-w-2xl">
                        <span className="text-[#111] dark:text-white"><SearchIcon /></span>
                        <input
                            type="search"
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Search fragrances, candles, diffusers..."
                            aria-label="Search products"
                            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-xl md:text-2xl font-medium text-[#111] dark:text-white placeholder-gray-400 p-0"
                        />
                        <button type="submit" className={`px-6 py-3 ${btnPrimary}`}>Search</button>
                    </form>
                    {query && !loading && (
                        <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mt-4" aria-live="polite">
                            {searchResults.length} result{searchResults.length === 1 ? '' : 's'} for "{query}"
                        </p>
                    )}
                </div>

                {loading || hasResults ? (
                    <>
                        <ProductGrid
                            products={pageItems}
                            loading={loading}
                            skeletonCount={8}
                            onProductClick={onProductClick}
                            onToggleWishlist={onToggleWishlist}
                            wishlist={currentUser?.wishlist}
                        />
                        {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />}
                    </>
                ) : (
                    <div className={`${card} p-16 text-center mt-8`}>
                        <p className="text-xs tracking-widest uppercase font-medium text-gray-500">
                            {query ? 'No products found matching your search.' : 'Type something to search the collection.'}
                        </p>
                        {query && <p className="text-xs text-gray-400 mt-4">Try fewer words, or search by type such as "candle" or "diffuser".</p>}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SearchPage;
