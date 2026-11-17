import React from 'react';
import { motion } from 'framer-motion';
import { EASE, pageMotionProps } from '../animations/variants';
import HeroCarousel from '../components/home/HeroCarousel';
import { icons } from '../components/icons';
import ProductGrid from '../components/product/ProductGrid';
import { whyUsData } from '../data/siteData';
import ownerImage from '../images/owner.webp';
import { btnOutlineLight } from '../styles/classNames';

const FEATURED_COUNT = 4;

const HomePage = ({ allProducts, onProductClick, onNavigate, loading, error, onToggleWishlist, currentUser }) => (
    <motion.div {...pageMotionProps} className="bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <HeroCarousel onNavigate={onNavigate} />

        {/* Featured products */}
        <div className="py-32 px-6 lg:px-12 max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-200 dark:border-gray-800 pb-8">
                <h2 className="text-3xl md:text-4xl font-medium text-[#111] dark:text-white tracking-tight">Curated Signatures</h2>
                <button onClick={() => onNavigate('shop')} className="mt-4 md:mt-0 text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-gray-400 hover:opacity-50 transition-opacity">
                    View Complete Range →
                </button>
            </div>

            {error ? (
                <p className="text-center text-red-500 font-bold">{error}</p>
            ) : (
                <ProductGrid
                    products={allProducts.slice(0, FEATURED_COUNT)}
                    loading={loading}
                    skeletonCount={FEATURED_COUNT}
                    onProductClick={onProductClick}
                    onToggleWishlist={onToggleWishlist}
                    wishlist={currentUser?.wishlist}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16"
                    animateOnScroll
                />
            )}
        </div>

        {/* Learn With Opevicky preview */}
        <div className="border-t border-gray-200 dark:border-gray-900 bg-[#111] text-white py-32">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 text-center">
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-6">Learn With Opevicky</h3>
                <h2 className="text-3xl md:text-5xl font-medium leading-tight mb-8">Master the Art of Fragrance & Craft.</h2>
                <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed mb-12">
                    Learn practical skills in fragrance creation and gypsum craft with step-by-step guidance designed for beginners and aspiring entrepreneurs.
                </p>
                <button onClick={() => onNavigate('learn')} className={btnOutlineLight}>Explore Training</button>
            </div>
        </div>

        {/* Founder */}
        <div className="border-t border-gray-200 dark:border-gray-900 bg-white dark:bg-[#0A0A0A]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-[60vh] lg:h-auto overflow-hidden">
                    <img src={ownerImage} alt="Opeyemi Victoria" loading="lazy" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                </div>
                <div className="flex flex-col justify-center px-8 py-24 lg:p-24">
                    <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-8">The Architect of Scent</h3>
                    <h2 className="text-3xl md:text-5xl font-medium text-[#111] dark:text-white leading-tight mb-8">
                        "Perfume is the invisible accessory that leaves a lasting impression."
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-12 max-w-md">
                        Founded by Opeyemi Victoria, OpevickyScents was established to bring world-class, undeniable elegance to the modern individual. A pursuit of uncompromising quality.
                    </p>
                    <button onClick={() => onNavigate('about')} className="self-start border-b border-[#111] dark:border-white text-[#111] dark:text-white pb-1 text-xs tracking-[0.2em] uppercase hover:opacity-50 transition-opacity">
                        Read The Manifesto
                    </button>
                </div>
            </div>
        </div>

        {/* Why us */}
        <div className="bg-[#F9F9F9] dark:bg-[#111] py-24 border-t border-gray-200 dark:border-gray-900">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-center">
                    {whyUsData.map((feature) => {
                        const IconComponent = icons[feature.icon];
                        return (
                            <div className="flex flex-col items-center" key={feature.title}>
                                <div className="h-16 w-16 text-[#111] dark:text-white flex items-center justify-center mb-6">
                                    <IconComponent />
                                </div>
                                <h4 className="text-sm font-bold uppercase tracking-widest text-[#111] dark:text-white mb-4">{feature.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">{feature.description}</p>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    </motion.div>
);

export default HomePage;
