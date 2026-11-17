import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HERO_SLIDE_INTERVAL_MS } from '../../config/constants';
import { heroSlides } from '../../data/siteData';
import { btnOutlineLight } from '../../styles/classNames';

const HeroCarousel = ({ onNavigate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slide = heroSlides[currentIndex];

    useEffect(() => {
        const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % heroSlides.length), HERO_SLIDE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-[#111]">
            <AnimatePresence mode="wait">
                <motion.div key={currentIndex} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.8, ease: 'easeInOut' }} className="absolute inset-0">
                    <img className="w-full h-full object-cover opacity-60" src={slide.imageUrl} alt="Luxury Perfume" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
                <motion.h1 key={`title-${currentIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.1em] text-white mb-6">
                    {slide.title}
                </motion.h1>
                <motion.p key={`sub-${currentIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="text-sm md:text-base tracking-[0.2em] uppercase text-gray-300 mb-10 max-w-lg font-light">
                    {slide.subtitle}
                </motion.p>
                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} onClick={() => onNavigate('shop')} className={btnOutlineLight}>
                    Discover Collection
                </motion.button>
            </div>
        </div>
    );
};

export default HeroCarousel;
