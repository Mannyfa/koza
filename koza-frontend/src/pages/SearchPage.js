import React from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import PageHeader from '../components/common/PageHeader';
import Pagination from '../components/common/Pagination';
import ProductGrid from '../components/product/ProductGrid';
import usePagination from '../hooks/usePagination';
import { card, pageShell } from '../styles/classNames';

const SearchPage = ({ searchResults, onProductClick, loading, query, onToggleWishlist, currentUser }) => {
    const { currentPage, totalPages, pageItems, goToPage } = usePagination(searchResults);
    const hasResults = searchResults.length > 0;

    return (
        <motion.div {...pageMotionProps} className={pageShell}>
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <PageHeader title={`Results for "${query}"`} size="sm" />

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
                        <p className="text-xs tracking-widest uppercase font-medium text-gray-500">No products found matching your search.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SearchPage;
