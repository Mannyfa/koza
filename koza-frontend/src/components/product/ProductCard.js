import React from 'react';
import { motion } from 'framer-motion';
import { EASE, itemVariant } from '../../animations/variants';
import { PLACEHOLDER_IMAGE } from '../../config/constants';
import { formatPrice, getEffectivePrice, getImageUrl, isOutOfStock } from '../../utils/formatters';
import { HeartIcon } from '../icons';
import OutOfStockBadge from './OutOfStockBadge';

// --- Product Card: Minimalist Editorial ---
const ProductCard = ({ product, onProductClick, onToggleWishlist, isWishlisted }) => {
    const hasDiscount = product.discountPercentage > 0;
    const soldOut = isOutOfStock(product);

    return (
        <motion.div variants={itemVariant} onClick={() => onProductClick(product)} className="group cursor-pointer flex flex-col">
            <div className="w-full aspect-[3/4] bg-[#F9F9F9] dark:bg-[#1A1A1A] overflow-hidden relative mb-4">
                <motion.img
                    whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: EASE }}
                    src={getImageUrl(product.image)} alt={product.name} loading="lazy"
                    className={`w-full h-full object-cover object-center transition-opacity ${soldOut ? 'opacity-50 grayscale' : ''}`}
                    onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                />

                {soldOut && <OutOfStockBadge />}

                {hasDiscount && !soldOut && (
                    <div className="absolute top-4 left-4 border border-[#111] dark:border-white text-[#111] dark:text-white text-[10px] uppercase tracking-widest px-2 py-1 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                        {product.discountPercentage}% OFF
                    </div>
                )}

                {onToggleWishlist && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                        className="absolute top-4 right-4 text-[#111] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <HeartIcon className={`h-5 w-5 ${isWishlisted ? 'fill-[#111] dark:fill-white' : ''}`} isFilled={isWishlisted} />
                    </button>
                )}
            </div>

            <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-end mb-2">
                    <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
                        {product.bottleSize ? `Size: ${product.bottleSize}` : 'Standard Size'}
                    </p>
                    {soldOut ? (
                        <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-red-500">Sold Out</span>
                    ) : product.stockAmount !== undefined && (
                        <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-gray-400">{product.stockAmount} Available</span>
                    )}
                </div>
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-medium text-[#111] dark:text-white leading-snug truncate">{product.name}</h3>
                    <div className="text-right">
                        {hasDiscount ? (
                            <div className="flex flex-col items-end">
                                <p className="text-sm font-medium text-[#111] dark:text-white">{formatPrice(getEffectivePrice(product))}</p>
                                <p className="text-[10px] text-gray-400 line-through">{formatPrice(product.price)}</p>
                            </div>
                        ) : (
                            <p className="text-sm font-medium text-[#111] dark:text-white">{formatPrice(product.price)}</p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
