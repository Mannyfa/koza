import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE } from '../../animations/variants';
import { navLinks } from '../../data/siteData';
import { XIcon } from '../icons';

const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen, onNavigate }) => {
    const close = () => setMobileMenuOpen(false);

    return (
        <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 md:hidden flex">
                    <div className="fixed inset-0 bg-[#111]/60 backdrop-blur-sm" onClick={close}></div>
                    <motion.div
                        initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.5, ease: EASE }}
                        className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800 rounded-none"
                    >
                        <div className="absolute top-0 right-0 -mr-12 pt-6">
                            <button onClick={close} className="ml-1 flex items-center justify-center h-10 w-10 text-white focus:outline-none hover:opacity-50 transition-opacity" aria-label="Close menu">
                                <XIcon className="text-white" />
                            </button>
                        </div>
                        <div className="flex-1 h-0 pt-12 pb-4 overflow-y-auto px-8">
                            <div className="mb-12">
                                <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#111] dark:text-white">Opevicky</h2>
                            </div>
                            <nav className="space-y-6">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.name} onClick={() => { onNavigate(link.page); close(); }}
                                        className="w-full text-left block text-sm tracking-[0.2em] uppercase font-medium text-[#111] dark:text-gray-300 hover:text-gray-500 transition-colors"
                                    >
                                        {link.name}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
