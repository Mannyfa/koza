import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import { ChevronDownIcon } from '../components/icons';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductReviews from '../components/product/ProductReviews';
import StarRating from '../components/product/StarRating';
import { btnPrimary } from '../styles/classNames';
import { formatPrice, getEffectivePrice, isOutOfStock as checkOutOfStock } from '../utils/formatters';

const DEFAULT_DESCRIPTION = 'Experience the epitome of luxury. This fragrance is crafted from the finest ingredients to create a scent that is both captivating and enduring.';

/** Renders plain-text descriptions; lines starting with - or * become bullet points. */
const FormattedDescription = ({ text }) => {
    if (!text) return <p>{DEFAULT_DESCRIPTION}</p>;
    return text.split('\n').map((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
            return <li key={index} className="ml-6 list-disc mb-2 text-sm text-gray-600 dark:text-gray-400">{trimmed.substring(1).trim()}</li>;
        }
        if (trimmed === '') return <div key={index} className="h-2"></div>;
        return <p key={index} className="mb-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{trimmed}</p>;
    });
};

const hasPurchasedProduct = (orders, product) =>
    orders?.some((order) =>
        (order.cart || []).some((item) =>
            [item.product, item.id, item._id].some((id) => id && (id === product.id || id === product._id))
        )
    );

const ProductDetailPage = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onBack, orders, onSubmitReview }) => {
    const [quantity, setQuantity] = useState(1);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

    const isOutOfStock = checkOutOfStock(product);
    const maxQuantity = product.stockAmount || 0;
    const reviews = product.reviews || [];
    const hasDiscount = product.discountPercentage > 0;

    return (
        <motion.div {...pageMotionProps} className="bg-white dark:bg-[#0A0A0A] min-h-screen pt-32 pb-24">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
                <button onClick={onBack} className="mb-12 text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white hover:opacity-50 flex items-center transition-opacity">
                    ← Back to Shop
                </button>

                <div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24 mb-24">
                    <ProductImageGallery product={product} onToggleWishlist={onToggleWishlist} isWishlisted={isWishlisted} />

                    {/* Product Details */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col justify-start pt-4">
                        <div className="flex justify-between items-end mb-4">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
                                {[product.category, product.bottleSize ? `Size • ${product.bottleSize}` : 'Standard Size'].filter(Boolean).join('  /  ')}
                            </p>
                            {isOutOfStock ? (
                                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-red-500">Out of Stock</p>
                            ) : product.stockAmount !== undefined && (
                                <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">{product.stockAmount} Units Available</p>
                            )}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-medium text-[#111] dark:text-white tracking-tight mb-6">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-8">
                            {hasDiscount ? (
                                <div className="flex items-end gap-3">
                                    <p className="text-2xl font-medium text-[#111] dark:text-white">{formatPrice(getEffectivePrice(product))}</p>
                                    <p className="text-sm font-light text-gray-400 line-through pb-1">{formatPrice(product.price)}</p>
                                    <span className="ml-2 border border-[#111] dark:border-white text-[#111] dark:text-white text-[10px] uppercase tracking-widest px-2 py-1 mb-1">
                                        {product.discountPercentage}% OFF
                                    </span>
                                </div>
                            ) : (
                                <p className="text-2xl font-medium text-[#111] dark:text-white">{formatPrice(product.price)}</p>
                            )}
                        </div>

                        <div className="flex items-center mb-10 pb-10 border-b border-gray-200 dark:border-gray-800">
                            <StarRating value={5} />
                            <span className="ml-4 text-xs font-medium text-gray-500 tracking-widest uppercase">{reviews.length} Reviews</span>
                        </div>

                        <div className="mb-12">
                            <button onClick={() => setIsDescriptionOpen(!isDescriptionOpen)} className="w-full flex justify-between items-center group focus:outline-none mb-4" aria-expanded={isDescriptionOpen}>
                                <span className="text-sm font-bold uppercase tracking-widest text-[#111] dark:text-white">The Details</span>
                                <motion.div animate={{ rotate: isDescriptionOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                    <ChevronDownIcon className="w-5 h-5 text-[#111] dark:text-white" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {isDescriptionOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="pt-2"><FormattedDescription text={product.description} /></div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-auto">
                            <div className="flex items-center border border-[#111] dark:border-white h-14 w-full sm:w-32 bg-transparent rounded-none">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-[#111] dark:text-white h-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors" aria-label="Decrease quantity">-</button>
                                <span className="flex-1 text-center font-medium text-[#111] dark:text-white">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(maxQuantity || 1, quantity + 1))} disabled={quantity >= maxQuantity} className="px-4 text-[#111] dark:text-white h-full disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors" aria-label="Increase quantity">+</button>
                            </div>

                            <button onClick={() => onAddToCart(product, quantity)} disabled={isOutOfStock} className={`flex-1 h-14 flex items-center justify-center disabled:cursor-not-allowed ${btnPrimary}`}>
                                {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
                            </button>
                        </div>
                    </motion.div>
                </div>

                <ProductReviews
                    reviews={reviews}
                    canReview={hasPurchasedProduct(orders, product)}
                    onSubmitReview={(review) => onSubmitReview(product.id || product._id, review)}
                />
            </div>
        </motion.div>
    );
};

export default ProductDetailPage;
