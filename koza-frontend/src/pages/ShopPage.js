import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import PageHeader from '../components/common/PageHeader';
import Pagination from '../components/common/Pagination';
import ProductGrid from '../components/product/ProductGrid';
import ShopFilters from '../components/shop/ShopFilters';
import usePagination from '../hooks/usePagination';
import { card, pageShell } from '../styles/classNames';
import { applyFilters, DEFAULT_FILTERS, getCategoryCounts } from '../utils/filters';

const ShopPage = ({ allProducts, onProductClick, loading, error, onToggleWishlist, currentUser }) => {
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    const categories = useMemo(() => getCategoryCounts(allProducts), [allProducts]);
    const filtered = useMemo(() => applyFilters(allProducts, filters), [allProducts, filters]);
    const { currentPage, totalPages, pageItems, goToPage } = usePagination(filtered);

    return (
        <motion.div {...pageMotionProps} className={pageShell}>
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <PageHeader title="Our Collection" subtitle="Discover your signature scent." size="lg" className="!mb-8" />

                {error ? (
                    <div className="text-xs tracking-widest uppercase text-red-500 border border-red-200 p-6 text-center">
                        Could not load products. Please try again later.
                    </div>
                ) : (
                    <>
                        {!loading && (
                            <ShopFilters
                                filters={filters}
                                onChange={setFilters}
                                categories={categories}
                                totalCount={allProducts.length}
                                resultCount={filtered.length}
                            />
                        )}

                        {!loading && filtered.length === 0 ? (
                            <div className={`${card} p-16 text-center`}>
                                <p className="text-xs tracking-widest uppercase font-medium text-gray-500 mb-6">No products match these filters.</p>
                                <button onClick={() => setFilters(DEFAULT_FILTERS)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white border-b border-[#111] dark:border-white pb-1">
                                    Clear filters
                                </button>
                            </div>
                        ) : (
                            <ProductGrid
                                products={pageItems}
                                loading={loading}
                                skeletonCount={12}
                                onProductClick={onProductClick}
                                onToggleWishlist={onToggleWishlist}
                                wishlist={currentUser?.wishlist}
                            />
                        )}
                        {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default ShopPage;
