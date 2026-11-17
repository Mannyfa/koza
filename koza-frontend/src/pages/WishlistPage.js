import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import CenteredCard from '../components/common/CenteredCard';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import { HeartIcon } from '../components/icons';
import ProductGrid from '../components/product/ProductGrid';
import { btnPrimary, pageShell } from '../styles/classNames';

const WishlistPage = ({ allProducts, currentUser, onNavigate, onProductClick, onToggleWishlist }) => {
    const wishlist = currentUser?.wishlist;
    const wishlistedItems = useMemo(
        () => allProducts.filter((product) => wishlist?.includes(product.id)),
        [allProducts, wishlist]
    );

    if (!currentUser) {
        return (
            <CenteredCard>
                <HeartIcon className="w-10 h-10 mx-auto text-gray-400 mb-6" />
                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#111] dark:text-white mb-4">Authentication Required</h2>
                <p className="text-gray-500 text-sm mb-12">Sign in to view and curate your personal collection.</p>
                <button onClick={() => onNavigate('auth')} className={`w-full py-4 ${btnPrimary}`}>Sign In</button>
            </CenteredCard>
        );
    }

    return (
        <motion.div {...pageMotionProps} className={pageShell}>
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <PageHeader title="Curated Collection" subtitle="Your personal selection." />

                {wishlistedItems.length === 0 ? (
                    <EmptyState
                        icon={<HeartIcon className="w-8 h-8" />}
                        title="Your collection is empty"
                        actionLabel="Explore Catalog"
                        onAction={() => onNavigate('shop')}
                    />
                ) : (
                    <ProductGrid
                        products={wishlistedItems}
                        onProductClick={onProductClick}
                        onToggleWishlist={onToggleWishlist}
                        wishlist={wishlist}
                    />
                )}
            </div>
        </motion.div>
    );
};

export default WishlistPage;
