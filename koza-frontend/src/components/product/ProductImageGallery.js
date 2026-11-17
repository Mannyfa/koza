import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl, isOutOfStock } from '../../utils/formatters';
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from '../icons';
import OutOfStockBadge from './OutOfStockBadge';

const navBtn = 'absolute top-1/2 -translate-y-1/2 bg-white dark:bg-black p-3 text-[#111] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors border border-gray-200 dark:border-gray-800 opacity-0 group-hover:opacity-100 rounded-none';

const ProductImageGallery = ({ product, onToggleWishlist, isWishlisted }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = product.images?.length > 0 ? product.images : [product.image];
    const hasMultiple = images.length > 1;

    const next = () => setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    const prev = () => setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

    return (
        <div className="flex flex-col gap-4 mb-12 lg:mb-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="aspect-[3/4] bg-[#F9F9F9] dark:bg-[#111] relative border border-gray-200 dark:border-gray-800 group rounded-none">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                        src={getImageUrl(images[currentIndex])}
                        alt={`${product.name} - View ${currentIndex + 1}`}
                        className="w-full h-full object-cover object-center"
                    />
                </AnimatePresence>

                {isOutOfStock(product) && <OutOfStockBadge className="top-6 left-6" />}

                {hasMultiple && (
                    <>
                        <button onClick={prev} className={`left-4 ${navBtn}`} aria-label="Previous image"><ChevronLeftIcon className="w-5 h-5" /></button>
                        <button onClick={next} className={`right-4 ${navBtn}`} aria-label="Next image"><ChevronRightIcon className="w-5 h-5" /></button>
                    </>
                )}

                {onToggleWishlist && (
                    <button onClick={() => onToggleWishlist(product.id)} className="absolute top-6 right-6 p-3 text-[#111] dark:text-white hover:text-red-500 transition-colors z-20" aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                        <HeartIcon className={`h-6 w-6 ${isWishlisted ? 'fill-[#111] dark:fill-white text-[#111] dark:text-white hover:fill-red-500' : ''}`} isFilled={isWishlisted} />
                    </button>
                )}
            </motion.div>

            {/* Thumbnail Strip */}
            {hasMultiple && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`flex-shrink-0 w-20 h-24 border transition-all duration-300 rounded-none ${currentIndex === idx ? 'border-[#111] dark:border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
                        >
                            <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductImageGallery;
