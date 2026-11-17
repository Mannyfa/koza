import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navLinks } from '../../data/siteData';
import { MenuIcon, SearchIcon, ShoppingBagIcon, UserIcon } from '../icons';
import ThemeToggle from './ThemeToggle';

const userMenuItem = 'w-full text-left block px-4 py-3 text-xs tracking-widest uppercase transition-colors';

// --- Header: Editorial & Stark (Always White) ---
const Header = ({ setMobileMenuOpen, onNavigate, cartCount, onSearch, currentUser, onLogout }) => {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) onSearch(searchQuery.trim());
    };

    const handleMobileSearch = () => {
        const query = window.prompt('Search for a fragrance:');
        if (query && query.trim()) onSearch(query.trim());
    };

    const handleUserMenuAction = (action) => {
        action();
        setUserMenuOpen(false);
    };

    return (
        <header className={`fixed top-0 w-full z-40 transition-all duration-500 bg-white/95 backdrop-blur-md border-b border-gray-200 ${scrolled ? 'py-4 shadow-sm' : 'py-6'}`}>
            <nav className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex items-center justify-between">

                <div className="flex items-center gap-4 sm:gap-6 w-1/3">
                    <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-[#111] hover:opacity-50 transition-opacity" aria-label="Open menu">
                        <MenuIcon />
                    </button>
                    <button onClick={handleMobileSearch} className="lg:hidden text-[#111] hover:opacity-50 transition-opacity" aria-label="Search">
                        <SearchIcon />
                    </button>

                    <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center border-b border-[#111] pb-1 opacity-50 hover:opacity-100 transition-opacity focus-within:opacity-100">
                        <SearchIcon />
                        <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="SEARCH..." className="bg-transparent border-none outline-none text-xs font-medium tracking-[0.15em] uppercase text-[#111] placeholder-gray-500 ml-2 w-32 focus:w-48 transition-all" />
                    </form>
                </div>

                <div className="flex-1 flex justify-center w-1/3">
                    <button onClick={() => onNavigate('home')} className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase text-[#111] hover:opacity-70 transition-opacity">
                        Opevicky
                    </button>
                </div>

                <div className="flex items-center justify-end gap-6 w-1/3 text-[#111] relative">
                    <div className="hidden lg:flex items-center gap-8 mr-4">
                        {navLinks.map((link) => (
                            <button key={link.name} onClick={() => onNavigate(link.page)} className="text-xs font-medium tracking-[0.15em] uppercase hover:opacity-50 transition-opacity">
                                {link.name}
                            </button>
                        ))}
                    </div>

                    <ThemeToggle />

                    <div className="relative">
                        <button onClick={() => (currentUser ? setUserMenuOpen(!userMenuOpen) : onNavigate('auth'))} className="hover:opacity-50 transition-opacity" aria-label="Account">
                            <UserIcon />
                        </button>
                        <AnimatePresence>
                            {currentUser && userMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-4 w-48 bg-white border border-gray-200 shadow-xl z-50 rounded-none"
                                    onMouseLeave={() => setUserMenuOpen(false)}
                                >
                                    <div className="p-4 border-b border-gray-100">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Account</p>
                                        <p className="text-xs font-bold text-[#111] truncate mt-1">{currentUser.email}</p>
                                    </div>
                                    <button onClick={() => handleUserMenuAction(() => onNavigate('orders'))} className={`${userMenuItem} text-gray-700 hover:bg-gray-50`}>My Orders</button>
                                    <button onClick={() => handleUserMenuAction(() => onNavigate('wishlist'))} className={`${userMenuItem} text-gray-700 hover:bg-gray-50`}>Wishlist</button>
                                    <button onClick={() => handleUserMenuAction(onLogout)} className={`${userMenuItem} text-red-500 hover:bg-red-50`}>Logout</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button onClick={() => onNavigate('cart')} className="relative hover:opacity-50 transition-opacity" aria-label="Shopping bag">
                        <ShoppingBagIcon />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-2 bg-[#111] text-white font-bold text-[9px] w-4 h-4 flex items-center justify-center rounded-none border border-transparent">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
