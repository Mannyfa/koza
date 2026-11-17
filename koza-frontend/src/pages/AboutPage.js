import React from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';

const ABOUT_HERO_IMAGE = 'https://images.unsplash.com/photo-1615397323812-7bfdf7b78ff3?auto=format&fit=crop&w=1920&q=80';

const SectionHeading = ({ children }) => (
    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white mt-16 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
        {children}
    </h2>
);

const Paragraph = ({ children }) => <p className="mb-6 text-sm leading-relaxed">{children}</p>;

const AboutPage = () => (
    <motion.div {...pageMotionProps} className="bg-white dark:bg-[#0A0A0A] min-h-screen">
        <div className="relative pt-32 pb-24 bg-[#111] overflow-hidden flex items-center justify-center min-h-[50vh]">
            <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30 grayscale" style={{ backgroundImage: `url('${ABOUT_HERO_IMAGE}')` }} />
            <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-4xl sm:text-6xl font-black text-white tracking-[0.1em] uppercase mb-6">
                    The Manifesto
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-sm md:text-base tracking-[0.2em] text-gray-300 uppercase font-light">
                    Redefining elegance, one fragrance at a time.
                </motion.p>
            </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-24">
            <div className="text-gray-600 dark:text-gray-300">
                <p className="text-xl md:text-2xl font-medium text-[#111] dark:text-white mb-16 text-center leading-relaxed">
                    Opevicky Scents was born out of faith, resilience, and the belief that every great dream starts with a small beginning.
                </p>

                <SectionHeading>Humble Beginnings</SectionHeading>
                <Paragraph>
                    Our journey began on May 15th, 2020, with just one dozen bottles of perfume oil. At the time, resources were extremely limited. I even had to borrow money just to pay the delivery fee to my supplier. There were days when my siblings and I would walk long distances around Ago Okota, carrying perfumes from place to place because we couldn’t afford transportation. We were simply determined to make sales and create a better future.
                </Paragraph>
                <Paragraph>
                    During that period, I was also learning tailoring, hoping it would become a source of income. Although life eventually led me down a different path, the discipline, resilience, and work ethic I developed during those years became the foundation of the business I’m building today.
                </Paragraph>
                <Paragraph>
                    Despite every challenge, I refused to give up. I stayed consistent, believing that every customer mattered and that every single sale brought me one step closer to my dream.
                </Paragraph>

                <SectionHeading>Setbacks & Resilience</SectionHeading>
                <Paragraph>
                    In 2023, I achieved a major milestone by opening my very first physical store. It was a dream come true, but unfortunately, the location wasn’t suitable for the business. Sales declined, and I lost a significant amount of money. It was one of the most difficult seasons of my life. I had to close the store, move everything back home, and return to operating exclusively online.
                </Paragraph>
                <Paragraph>
                    Starting over wasn’t easy. There were moments when I questioned everything, but one thing never changed—my love for perfumes. To me, perfumes are more than just products; they’re a way people express themselves, create lasting memories, and feel more confident. That passion kept me going even when everything around me seemed uncertain.
                </Paragraph>
                <p className="mb-6 text-sm font-bold text-[#111] dark:text-white">Rather than giving up, I chose to begin again.</p>

                <SectionHeading>The Vision Ahead</SectionHeading>
                <Paragraph>
                    Today, Opevicky Scents proudly serves customers both online and from our growing physical store. Every order, every recommendation, every returning customer, and every milestone reminds us how far we’ve come and motivates us to keep building.
                </Paragraph>
                <Paragraph>
                    Our journey has taught us that success isn’t defined by where you start—it’s defined by your willingness to keep going, no matter how many times life asks you to begin again.
                </Paragraph>

                <blockquote className="border-l border-[#111] dark:border-white pl-6 my-12 italic text-gray-500 py-2">
                    Our vision is to become one of Nigeria’s most trusted perfume brands, known for authenticity, quality, exceptional customer service, and unforgettable fragrances that leave lasting impressions.
                </blockquote>

                <hr className="my-16 border-gray-200 dark:border-gray-800" />

                <div className="text-center p-8 sm:p-12 border border-gray-200 dark:border-gray-800 bg-[#F9F9F9] dark:bg-[#111] rounded-none">
                    <p className="mb-8 text-sm leading-relaxed">
                        To every customer who has supported Opevicky Scents from the very beginning—and to everyone who is just discovering us—thank you for believing in our journey. Your trust, support, and loyalty continue to inspire us every single day.
                    </p>
                    <p className="mb-8 font-black tracking-widest uppercase text-[#111] dark:text-white text-sm">This is only the beginning.</p>
                    <p className="mb-10 text-sm text-gray-500">
                        We’re still growing, still learning, and still building the brand we’ve always dreamed of. The best is yet to come.
                    </p>
                    <h3 className="text-xl font-black uppercase tracking-widest text-[#111] dark:text-white mb-3">Welcome to Opevicky Scents.</h3>
                    <p className="text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">Where every fragrance tells a story.</p>
                </div>
            </div>
        </div>
    </motion.div>
);

export default AboutPage;
