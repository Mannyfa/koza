import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer } from '../../animations/variants';
import { productGridCols } from '../../styles/classNames';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';

/**
 * Animated grid of ProductCards, or skeletons while loading.
 * Pass `animateOnScroll` to reveal the grid when it scrolls into view.
 */
const ProductGrid = ({
    products,
    loading = false,
    skeletonCount = 8,
    onProductClick,
    onToggleWishlist,
    wishlist = [],
    className = productGridCols,
    animateOnScroll = false,
}) => {
    if (loading) {
        return (
            <div className={className}>
                {Array.from({ length: skeletonCount }, (_, i) => <ProductSkeleton key={i} />)}
            </div>
        );
    }

    const revealProps = animateOnScroll
        ? { whileInView: 'show', viewport: { once: true, margin: '-100px' } }
        : { animate: 'show' };

    return (
        <motion.div variants={staggerContainer} initial="hidden" {...revealProps} className={className}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onProductClick={onProductClick}
                    onToggleWishlist={onToggleWishlist}
                    isWishlisted={wishlist.includes(product.id)}
                />
            ))}
        </motion.div>
    );
};

export default ProductGrid;
