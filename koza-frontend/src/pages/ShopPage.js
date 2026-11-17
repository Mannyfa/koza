import React from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import PageHeader from '../components/common/PageHeader';
import Pagination from '../components/common/Pagination';
import ProductGrid from '../components/product/ProductGrid';
import usePagination from '../hooks/usePagination';
import { pageShell } from '../styles/classNames';

const ShopPage = ({ allProducts, onProductClick, loading, error, onToggleWishlist, currentUser }) => {
    const { currentPage, totalPages, pageItems, goToPage } = usePagination(allProducts);

    return (
        <motion.div {...pageMotionProps} className={pageShell}>
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <PageHeader title="Our Collection" subtitle="Discover your signature scent." size="lg" />

                {error ? (
                    <div className="text-xs tracking-widest uppercase text-red-500 border border-red-200 p-6 text-center">
                        Could not load products. Please try again later.
                    </div>
                ) : (
                    <>
                        <ProductGrid
                            products={pageItems}
                            loading={loading}
                            skeletonCount={12}
                            onProductClick={onProductClick}
                            onToggleWishlist={onToggleWishlist}
                            wishlist={currentUser?.wishlist}
                        />
                        {!loading && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />}
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default ShopPage;
