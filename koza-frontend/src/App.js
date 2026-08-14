import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import heroImage1 from './images/hero.png';
import heroImage2 from './images/image 3.png';
import heroImage3 from './images/image1.png';
import heroImage4 from './images/image2.png';
import ownerImage from './images/owner.jpg';

// --- API Configuration ---
const API_BASE_URL = 'https://koza-2fkh.onrender.com';
const API_URL = `${API_BASE_URL}/api`;
const PAYSTACK_PUBLIC_KEY = "pk_live_0656fb181e5469d49bf27ae2852ec9a830386d8b";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// --- Static Data ---
const navLinks = [
  { name: 'Home', page: 'home' },
  { name: 'Shop', page: 'shop' },
  { name: 'About', page: 'about' },
  { name: 'Contact', page: 'contact' },
];

const heroSlides = [
    { imageUrl: heroImage1, title: 'Unmatched Quality.', subtitle: 'Discover flawless fragrances that empower your style.' },
    { imageUrl: heroImage2, title: 'Define Your Essence.', subtitle: 'Premium collection of curated, long-lasting scents.' },
    { imageUrl: heroImage3, title: 'Timeless Aura.', subtitle: 'Achieve a sophisticated presence with every spray.' },
    { imageUrl: heroImage4, title: 'Pure Confidence.', subtitle: 'Invest in perfume that makes you feel incredible.' }
];

const whyUsData = [
    { title: '100% Quality Perfumes', description: 'We source only the highest quality, undiluted perfumes for all our products.', icon: 'SparklesIcon' },
    { title: 'No Stains Experts', description: 'Our high-definition sprays provides the most natural-looking, undetectable perfume stains.', icon: 'ScissorsIcon' },
    { title: 'Fast, Secure Delivery', description: 'Your order is processed quickly and shipped securely to your doorstep.', icon: 'TruckIcon' },
    { title: 'Exceptional Support', description: 'Our dedicated team is here to help you with any questions or concerns.', icon: 'ChatBubbleIcon' }
];

// --- Helper Functions & Icons ---
const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' });

const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const ShoppingBagIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const XIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>);
const StarIcon = ({ className }) => (<svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const StarOutlineIcon = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>);
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#111] dark:text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L12 12l-2.293-2.293a1 1 0 010-1.414L12 6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12l2.293 2.293a1 1 0 010 1.414L12 18l-2.293-2.293a1 1 0 010-1.414L12 12zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ScissorsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a1 1 0 01-1.414 0L9 12m0 0l2.879-2.879a1 1 0 011.414 0L16 12M4 4v.01M4 8v.01M4 12v.01M4 16v.01M8 4v.01M12 4v.01M16 4v.01" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 16l2 2h3.5a1 1 0 001-1.447l-2-4A1 1 0 0016.5 9H13v7z" /></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const HeartIcon = ({ className, isFilled }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>);
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="1.5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"></path></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const MoonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>);
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m8.485-8.485l-.707.707M5.222 5.222l-.707.707M12 12a4 4 0 100-8 4 4 0 000 8zM21 12h-1M4 12H3m16.778 6.778l-.707-.707M6.929 18.778l-.707-.707" /></svg>);
const ChevronLeftIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const ChevronRightIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;
const ReceiptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const ChevronDownIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" /></svg>);
const TiktokIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.33-2.9 5.6-1.8 1.34-4.22 1.76-6.4 1.15-2.26-.6-4.2-2.3-4.9-4.52-.75-2.22-.38-4.78 1.07-6.66 1.4-1.83 3.65-2.88 5.92-2.98.01 1.37.01 2.73.01 4.1-.9-.05-1.81.21-2.52.75-.72.54-1.18 1.36-1.28 2.25-.1 1.01.19 2.05.8 2.8.62.77 1.62 1.2 2.63 1.21 1.11.02 2.2-.39 3.01-1.11.75-.68 1.22-1.65 1.28-2.65.04-5.63.02-11.26.03-16.89z"/></svg>;
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21c-1.566 0-3.08-.42-4.42-1.215l-1.04-.616-4.912 1.285 1.312-4.786-.676-1.074C1.455 13.149 1 11.597 1 10.007 1 4.49 5.485 0 11.996 0 18.51 0 23 4.49 23 10.007c0 5.517-4.49 10.993-10.969 10.993zm-5.61-3.136c1.336.791 2.89 1.21 4.505 1.21 5.378 0 9.756-4.37 9.756-9.755 0-5.385-4.378-9.754-9.756-9.754-5.378 0-9.756 4.369-9.756 9.754 0 1.706.446 3.35 1.294 4.81l.135.228-1.075 3.92 4.025-1.053.255.148c.003 0 .003-.001.004-.002zm6.27-11.56c-.244-.543-.5-.554-.728-.564-.188-.008-.403-.008-.618-.008-.215 0-.564.08-.859.397-.295.317-1.127 1.101-1.127 2.686 0 1.585 1.154 3.118 1.315 3.33.161.212 2.274 3.469 5.512 4.869.771.332 1.373.531 1.841.679.774.246 1.48.211 2.035.128.623-.095 1.916-.782 2.185-1.538.268-.755.268-1.402.188-1.538-.08-.135-.295-.215-.618-.374-.322-.159-1.916-.946-2.211-1.052-.295-.106-.51-.159-.725.158-.215.318-.838 1.053-1.026 1.265-.188.212-.376.238-.698.08-.322-.159-1.368-.503-2.607-1.61-.963-.861-1.614-1.925-1.802-2.242-.188-.318-.02-.49.141-.649.145-.143.322-.375.483-.564.161-.188.215-.317.322-.531.107-.212.054-.397-.027-.556-.08-.159-.725-1.748-.994-2.392z"/></svg>;

const icons = { SparklesIcon, ScissorsIcon, TruckIcon, ChatBubbleIcon, TiktokIcon, WhatsAppIcon };

// --- Elegant Animation Variants ---
const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
    out: { opacity: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
};
const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};
const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};

const Notification = ({ message, show }) => (
    <AnimatePresence>
        {show && (
            <motion.div 
                initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
                className="fixed top-24 right-5 z-50"
            >
                <div className="bg-[#111] dark:bg-white text-white dark:text-[#111] font-medium text-xs tracking-widest uppercase p-4 flex items-center gap-4 shadow-lg border border-gray-800 dark:border-gray-200">
                    <SparklesIcon />
                    <p>{message}</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

// const BrandLoader = () => (
//     <div className="flex justify-center items-center w-full py-32 min-h-[50vh]">
//         <div className="flex space-x-2 text-2xl md:text-3xl font-black tracking-[0.3em] uppercase">
//             <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0 }} className="text-[#111] dark:text-white">Ope</motion.span>
//             <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} className="text-gray-400">Vicky</motion.span>
//             <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }} className="text-[#111] dark:text-white">Scents</motion.span>
//         </div>
//     </div>
// );

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <button onClick={toggleTheme} className="hover:opacity-50 transition-opacity" aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};

// --- Header: Editorial & Stark ---
// --- Header: Editorial & Stark (Always White) ---
const Header = ({ setMobileMenuOpen, onNavigate, cartCount, onSearch, currentUser, onLogout }) => {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    return (
        <header className={`fixed top-0 w-full z-40 transition-all duration-500 bg-white/95 backdrop-blur-md border-b border-gray-200 ${scrolled ? 'py-4 shadow-sm' : 'py-6'}`}>
            <nav className="max-w-screen-2xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                
                <div className="flex items-center gap-6 w-1/3">
                    <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-[#111] hover:opacity-50 transition-opacity">
                        <MenuIcon />
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
                        <button onClick={() => currentUser ? setUserMenuOpen(!userMenuOpen) : onNavigate('auth')} className="hover:opacity-50 transition-opacity">
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
                                    <button onClick={() => { onNavigate('orders'); setUserMenuOpen(false); }} className="w-full text-left block px-4 py-3 text-xs tracking-widest uppercase text-gray-700 hover:bg-gray-50 transition-colors">My Orders</button>
                                    <button onClick={() => { onNavigate('wishlist'); setUserMenuOpen(false); }} className="w-full text-left block px-4 py-3 text-xs tracking-widest uppercase text-gray-700 hover:bg-gray-50 transition-colors">Wishlist</button>
                                    <button onClick={() => { onLogout(); setUserMenuOpen(false); }} className="w-full text-left block px-4 py-3 text-xs tracking-widest uppercase text-red-500 hover:bg-red-50 transition-colors">Logout</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button onClick={() => onNavigate('cart')} className="relative hover:opacity-50 transition-opacity">
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

const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen, onNavigate }) => (
    <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 md:hidden flex">
                <div className="fixed inset-0 bg-[#111]/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                <motion.div 
                    initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-[#0A0A0A] border-r border-gray-200 dark:border-gray-800 rounded-none"
                >
                    <div className="absolute top-0 right-0 -mr-12 pt-6">
                        <button onClick={() => setMobileMenuOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 text-white focus:outline-none hover:opacity-50 transition-opacity">
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
                                    key={link.name} onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }} 
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

// --- NEW: Minimalist Skeleton Loader ---
const ProductSkeleton = () => (
    <div className="flex flex-col animate-pulse">
        <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-800 mb-4 rounded-none"></div>
        <div className="h-2.5 bg-gray-200 dark:bg-gray-800 w-1/4 mb-3"></div>
        <div className="flex justify-between items-start gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-16"></div>
        </div>
    </div>
);

// --- Product Card: Minimalist Editorial ---
const ProductCard = ({ product, onProductClick, onToggleWishlist, isWishlisted }) => {
    const imageUrl = product.image && product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`;
    const effectivePrice = product.discountPercentage > 0 ? product.price - (product.price * (product.discountPercentage / 100)) : product.price;

    return (
        <motion.div variants={itemVariant} onClick={() => onProductClick(product)} className="group cursor-pointer flex flex-col">
            <div className="w-full aspect-[3/4] bg-[#F9F9F9] dark:bg-[#1A1A1A] overflow-hidden relative mb-4">
                <motion.img 
                    whileHover={{ scale: 1.05 }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    src={imageUrl} alt={product.name} className="w-full h-full object-cover object-center" 
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x500/cccccc/333333?text=No+Image'; }}
                />
                
                {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 border border-[#111] dark:border-white text-[#111] dark:text-white text-[10px] uppercase tracking-widest px-2 py-1 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                        {product.discountPercentage}% OFF
                    </div>
                )}

                {onToggleWishlist && (
                    <button onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }} className="absolute top-4 right-4 text-[#111] dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <HeartIcon className={`h-5 w-5 ${isWishlisted ? 'fill-[#111] dark:fill-white' : ''}`} isFilled={isWishlisted} />
                    </button>
                )}
            </div>
            
            <div className="flex flex-col flex-grow">
                <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mb-1">
                    {product.bottleSize || 'Signature'}
                </p>
                <div className="flex justify-between items-start gap-4">
                    <h3 className="text-sm font-medium text-[#111] dark:text-white leading-snug truncate">{product.name}</h3>
                    <div className="text-right">
                        {product.discountPercentage > 0 ? (
                            <div className="flex flex-col items-end">
                                <p className="text-sm font-medium text-[#111] dark:text-white">{formatPrice(effectivePrice)}</p>
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

// --- Footer: High End Minimalist ---
const Footer = ({ onNavigate }) => (
    <footer className="bg-[#111] text-white pt-24 pb-12 border-t border-gray-900">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-2xl font-black tracking-[0.2em] uppercase mb-6">Opevicky</h2>
                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                        Curating the finest luxury fragrances. Elevate your presence and leave a lasting impression wherever you go.
                    </p>
                </div>
                <div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">Collections</h3>
                    <ul className="space-y-4">
                        <li><button onClick={() => onNavigate('shop')} className="text-sm text-gray-300 hover:text-white transition-colors">All Perfumes</button></li>
                        <li><button onClick={() => onNavigate('shop')} className="text-sm text-gray-300 hover:text-white transition-colors">New Arrivals</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">Client Services</h3>
                    <ul className="space-y-4">
                        <li><button onClick={() => onNavigate('contact')} className="text-sm text-gray-300 hover:text-white transition-colors">Contact Us</button></li>
                        <li><button onClick={() => onNavigate('about')} className="text-sm text-gray-300 hover:text-white transition-colors">Our Story</button></li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 text-xs text-gray-500 uppercase tracking-widest">
                <p>&copy; {new Date().getFullYear()} OpevickyScents. All Rights Reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram"><InstagramIcon /></a>
                    <a href="https://www.tiktok.com/@opevickyscents?_r=1&_t=ZS-98d6IGw5WAj" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="TikTok"><TiktokIcon /></a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter"><TwitterIcon /></a>
                    <a href="https://wa.me/2348142600088" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="WhatsApp"><WhatsAppIcon /></a>
                    <a href="mailto:opevickyscents@gmail.com" className="hover:text-white transition-colors" aria-label="Email"><MailIcon /></a>
                </div>
            </div>
        </div>
    </footer>
);

// --- Page Components ---

const HomePage = ({ allProducts, onProductClick, onNavigate, loading, error, onToggleWishlist, currentUser }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => { setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length); }, 6000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            
            <div className="relative w-full h-screen overflow-hidden bg-[#111]">
                <AnimatePresence mode="wait">
                    <motion.div key={currentIndex} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.8, ease: "easeInOut" }} className="absolute inset-0">
                        <img className="w-full h-full object-cover opacity-60" src={heroSlides[currentIndex].imageUrl} alt="Luxury Perfume" />
                    </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 z-10">
                    <motion.h1 key={`title-${currentIndex}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.1em] text-white mb-6">
                        {heroSlides[currentIndex].title}
                    </motion.h1>
                    <motion.p key={`sub-${currentIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="text-sm md:text-base tracking-[0.2em] uppercase text-gray-300 mb-10 max-w-lg font-light">
                        {heroSlides[currentIndex].subtitle}
                    </motion.p>
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} onClick={() => onNavigate('shop')} className="border border-white text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors duration-500 rounded-none">
                        Discover Collection
                    </motion.button>
                </div>
            </div>

            <div className="py-32 px-6 lg:px-12 max-w-screen-2xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-200 dark:border-gray-800 pb-8">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-medium text-[#111] dark:text-white tracking-tight">Curated Signatures</h2>
                    </div>
                    <button onClick={() => onNavigate('shop')} className="mt-4 md:mt-0 text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-gray-400 hover:opacity-50 transition-opacity">
                        View Complete Range →
                    </button>
                </div>
                
                {loading ? ( 
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                        {[...Array(4)].map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                ) : error ? ( 
                    <p className="text-center text-red-500 font-bold">{error}</p> 
                ) : (
                    <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
                        {allProducts.slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} onProductClick={onProductClick} onToggleWishlist={onToggleWishlist} isWishlisted={currentUser?.wishlist?.includes(product.id)} />
                        ))}
                    </motion.div>
                )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-900 bg-white dark:bg-[#0A0A0A]">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="h-[60vh] lg:h-auto overflow-hidden">
                        <img src={ownerImage} alt="Opeyemi Victoria" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
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

            <div className="bg-[#F9F9F9] dark:bg-[#111] py-24 border-t border-gray-200 dark:border-gray-900">
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-center">
                        {whyUsData.map((feature) => {
                            const IconComponent = icons[feature.icon];
                            return (
                                <div key={feature.title} className="flex flex-col items-center">
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
};

const AboutPage = () => {
    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-white dark:bg-[#0A0A0A] min-h-screen">
            <div className="relative pt-32 pb-24 bg-[#111] overflow-hidden flex items-center justify-center min-h-[50vh]">
                <img src="https://images.unsplash.com/photo-1615397323812-7bfdf7b78ff3?auto=format&fit=crop&w=1920&q=80" alt="Perfume background" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale" />
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

                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white mt-16 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                        Humble Beginnings
                    </h2>
                    <p className="mb-6 text-sm leading-relaxed">
                        Our journey began on May 15th, 2020, with just one dozen bottles of perfume oil. At the time, resources were extremely limited. I even had to borrow money just to pay the delivery fee to my supplier. There were days when my siblings and I would walk long distances around Ago Okota, carrying perfumes from place to place because we couldn’t afford transportation. We were simply determined to make sales and create a better future.
                    </p>
                    <p className="mb-6 text-sm leading-relaxed">
                        During that period, I was also learning tailoring, hoping it would become a source of income. Although life eventually led me down a different path, the discipline, resilience, and work ethic I developed during those years became the foundation of the business I’m building today.
                    </p>
                    <p className="mb-6 text-sm leading-relaxed">
                        Despite every challenge, I refused to give up. I stayed consistent, believing that every customer mattered and that every single sale brought me one step closer to my dream.
                    </p>

                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white mt-16 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                        Setbacks & Resilience
                    </h2>
                    <p className="mb-6 text-sm leading-relaxed">
                        In 2023, I achieved a major milestone by opening my very first physical store. It was a dream come true, but unfortunately, the location wasn’t suitable for the business. Sales declined, and I lost a significant amount of money. It was one of the most difficult seasons of my life. I had to close the store, move everything back home, and return to operating exclusively online.
                    </p>
                    <p className="mb-6 text-sm leading-relaxed">
                        Starting over wasn’t easy. There were moments when I questioned everything, but one thing never changed—my love for perfumes. To me, perfumes are more than just products; they’re a way people express themselves, create lasting memories, and feel more confident. That passion kept me going even when everything around me seemed uncertain.
                    </p>
                    <p className="mb-6 text-sm font-bold text-[#111] dark:text-white">
                        Rather than giving up, I chose to begin again.
                    </p>

                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white mt-16 mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                        The Vision Ahead
                    </h2>
                    <p className="mb-6 text-sm leading-relaxed">
                        Today, Opevicky Scents proudly serves customers both online and from our growing physical store. Every order, every recommendation, every returning customer, and every milestone reminds us how far we’ve come and motivates us to keep building.
                    </p>
                    <p className="mb-6 text-sm leading-relaxed">
                        Our journey has taught us that success isn’t defined by where you start—it’s defined by your willingness to keep going, no matter how many times life asks you to begin again.
                    </p>
                    
                    <blockquote className="border-l border-[#111] dark:border-white pl-6 my-12 italic text-gray-500 py-2">
                        Our vision is to become one of Nigeria’s most trusted perfume brands, known for authenticity, quality, exceptional customer service, and unforgettable fragrances that leave lasting impressions.
                    </blockquote>

                    <hr className="my-16 border-gray-200 dark:border-gray-800" />

                    <div className="text-center p-8 sm:p-12 border border-gray-200 dark:border-gray-800 bg-[#F9F9F9] dark:bg-[#111] rounded-none">
                        <p className="mb-8 text-sm leading-relaxed">
                            To every customer who has supported Opevicky Scents from the very beginning—and to everyone who is just discovering us—thank you for believing in our journey. Your trust, support, and loyalty continue to inspire us every single day.
                        </p>
                        <p className="mb-8 font-black tracking-widest uppercase text-[#111] dark:text-white text-sm">
                            This is only the beginning.
                        </p>
                        <p className="mb-10 text-sm text-gray-500">
                            We’re still growing, still learning, and still building the brand we’ve always dreamed of. The best is yet to come.
                        </p>
                        
                        <h3 className="text-xl font-black uppercase tracking-widest text-[#111] dark:text-white mb-3">
                            Welcome to Opevicky Scents.
                        </h3>
                        <p className="text-xs text-gray-400 font-medium tracking-[0.2em] uppercase">
                            Where every fragrance tells a story.
                        </p>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

const ShopPage = ({ allProducts, onProductClick, loading, error, onToggleWishlist, currentUser }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => { setCurrentPage(1); }, [allProducts]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = allProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(allProducts.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen pt-32 pb-24">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[#111] dark:text-white mb-2">Our Collection</h1>
                    <p className="text-xs tracking-[0.2em] uppercase text-gray-500">Discover your signature scent.</p>
                </div>

                {loading ? ( 
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                        {[...Array(12)].map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                ) : error ? ( 
                    <div className="text-xs tracking-widest uppercase text-red-500 border border-red-200 p-6 text-center">Could not load products. Please ensure backend is running.</div> 
                ) : (
                    <>
                        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                            {currentProducts.map(product => (
                                <ProductCard key={product.id} product={product} onProductClick={onProductClick} onToggleWishlist={onToggleWishlist} isWishlisted={currentUser?.wishlist?.includes(product.id)} />
                            ))}
                        </motion.div>

                        {totalPages > 1 && (
                            <div className="mt-24 w-full flex justify-center">
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => paginate(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="w-12 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-700 text-[#111] dark:text-white disabled:opacity-30 hover:bg-[#111] hover:text-white dark:hover:bg-white dark:hover:text-[#111] transition-colors rounded-none"><ChevronLeftIcon /></button>
                                    <div className="flex space-x-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button key={i + 1} onClick={() => paginate(i + 1)} className={`w-12 h-12 flex items-center justify-center border text-xs font-bold transition-colors rounded-none ${currentPage === i + 1 ? 'border-[#111] dark:border-white bg-[#111] dark:bg-white text-white dark:text-[#111]' : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#111] dark:hover:border-white'}`}>{i + 1}</button>
                                        ))}
                                    </div>
                                    <button onClick={() => paginate(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className="w-12 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-700 text-[#111] dark:text-white disabled:opacity-30 hover:bg-[#111] hover:text-white dark:hover:bg-white dark:hover:text-[#111] transition-colors rounded-none"><ChevronRightIcon /></button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </motion.div>
    );
};

const SearchPage = ({ searchResults, onProductClick, loading, query, onToggleWishlist, currentUser }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => { setCurrentPage(1); }, [searchResults]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = searchResults.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(searchResults.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen pt-32 pb-24">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
                    <h1 className="text-3xl font-black uppercase tracking-tight text-[#111] dark:text-white">Results for "{query}"</h1>
                </div>
                
                {loading ? ( 
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                        {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
                    </div>
                ) : searchResults.length > 0 ? (
                    <>
                        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                            {currentProducts.map(product => (
                                <ProductCard key={product.id} product={product} onProductClick={onProductClick} onToggleWishlist={onToggleWishlist} isWishlisted={currentUser?.wishlist?.includes(product.id)} />
                            ))}
                        </motion.div>
                        {totalPages > 1 && (
                            <div className="mt-24 w-full flex justify-center">
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => paginate(Math.max(currentPage - 1, 1))} disabled={currentPage === 1} className="w-12 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-700 text-[#111] dark:text-white disabled:opacity-30 hover:bg-[#111] hover:text-white dark:hover:bg-white dark:hover:text-[#111] transition-colors rounded-none"><ChevronLeftIcon /></button>
                                    <div className="flex space-x-2">
                                        {[...Array(totalPages)].map((_, i) => (
                                            <button key={i + 1} onClick={() => paginate(i + 1)} className={`w-12 h-12 flex items-center justify-center border text-xs font-bold transition-colors rounded-none ${currentPage === i + 1 ? 'border-[#111] dark:border-white bg-[#111] dark:bg-white text-white dark:text-[#111]' : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#111] dark:hover:border-white'}`}>{i + 1}</button>
                                        ))}
                                    </div>
                                    <button onClick={() => paginate(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages} className="w-12 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-700 text-[#111] dark:text-white disabled:opacity-30 hover:bg-[#111] hover:text-white dark:hover:bg-white dark:hover:text-[#111] transition-colors rounded-none"><ChevronRightIcon /></button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="border border-gray-200 dark:border-gray-800 p-16 text-center mt-8 bg-white dark:bg-[#111]">
                        <p className="text-xs tracking-widest uppercase font-medium text-gray-500">No products found matching your search.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const ProductDetailPage = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onBack, currentUser, orders, onSubmitReview }) => {
    const [quantity, setQuantity] = useState(1);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true); 
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    
    const isOutOfStock = product.stockAmount === 0;
    const productReviews = product.reviews || [];
    const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
    
    const getImageUrl = (path) => {
        if (!path) return 'https://placehold.co/400x500/cccccc/333333?text=No+Image';
        return path.startsWith('http') ? path : `${API_BASE_URL}/${path}`;
    };

    const hasPurchased = orders?.some(order => 
        (order.cart || []).some(item => item.product === product.id || item.id === product.id || item.product === product._id || item._id === product.id)
    );

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if(!reviewText.trim()) return;
        onSubmitReview(product.id || product._id, { rating, text: reviewText });
        setReviewText("");
        setRating(5);
    };

    const effectivePrice = product.discountPercentage > 0 
        ? product.price - (product.price * (product.discountPercentage / 100))
        : product.price;

    const formatDescription = (text) => {
        if (!text) return <p>Experience the epitome of luxury. This fragrance is crafted from the finest ingredients to create a scent that is both captivating and enduring.</p>;
        return text.split('\n').map((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                return <li key={index} className="ml-6 list-disc mb-2 text-sm text-gray-600 dark:text-gray-400">{trimmedLine.substring(1).trim()}</li>;
            }
            if (trimmedLine === '') return <div key={index} className="h-2"></div>;
            return <p key={index} className="mb-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{trimmedLine}</p>;
        });
    };

    const nextImage = () => setCurrentImageIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
    const prevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-white dark:bg-[#0A0A0A] min-h-screen pt-32 pb-24">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
                <button onClick={onBack} className="mb-12 text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white hover:opacity-50 flex items-center transition-opacity">
                    ← Back to Shop
                </button>
                
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24 mb-24">
                    
                    {/* Image Carousel */}
                    <div className="flex flex-col gap-4 mb-12 lg:mb-0">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="aspect-[3/4] bg-[#F9F9F9] dark:bg-[#111] relative border border-gray-200 dark:border-gray-800 group rounded-none">
                            <AnimatePresence mode="wait">
                                <motion.img 
                                    key={currentImageIndex}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                                    src={getImageUrl(productImages[currentImageIndex])} 
                                    alt={`${product.name} - View ${currentImageIndex + 1}`} 
                                    className="w-full h-full object-cover object-center" 
                                />
                            </AnimatePresence>

                            {productImages.length > 1 && (
                                <>
                                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white dark:bg-black p-3 text-[#111] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors border border-gray-200 dark:border-gray-800 opacity-0 group-hover:opacity-100 rounded-none">
                                        <ChevronLeftIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white dark:bg-black p-3 text-[#111] dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors border border-gray-200 dark:border-gray-800 opacity-0 group-hover:opacity-100 rounded-none">
                                        <ChevronRightIcon className="w-5 h-5" />
                                    </button>
                                </>
                            )}

                            {onToggleWishlist && (
                                <button onClick={() => onToggleWishlist(product.id)} className="absolute top-6 right-6 p-3 text-[#111] dark:text-white hover:text-red-500 transition-colors z-20">
                                    <HeartIcon className={`h-6 w-6 ${isWishlisted ? 'fill-[#111] dark:fill-white text-[#111] dark:text-white hover:fill-red-500' : ''}`} isFilled={isWishlisted} />
                                </button>
                            )}
                        </motion.div>

                        {/* Thumbnail Strip */}
                        {productImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {productImages.map((img, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-24 border transition-all duration-300 rounded-none ${currentImageIndex === idx ? 'border-[#111] dark:border-white' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Product Details */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col justify-start pt-4">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-4">
                            {product.bottleSize ? `Signature • ${product.bottleSize}` : 'Signature Collection'}
                        </p>
                        <h1 className="text-3xl md:text-5xl font-medium text-[#111] dark:text-white tracking-tight mb-6">{product.name}</h1>
                        
                        <div className="flex items-center gap-4 mb-8">
                            {product.discountPercentage > 0 ? (
                                <div className="flex items-end gap-3">
                                    <p className="text-2xl font-medium text-[#111] dark:text-white">{formatPrice(effectivePrice)}</p>
                                    <p className="text-sm font-light text-gray-400 line-through pb-1">{formatPrice(product.price)}</p>
                                    <span className="ml-2 border border-[#111] dark:border-white text-[#111] dark:text-white text-[10px] uppercase tracking-widest px-2 py-1 mb-1">
                                        {product.discountPercentage}% OFF
                                    </span>
                                </div>
                            ) : (
                                <p className="text-2xl font-medium text-[#111] dark:text-white">{formatPrice(product.price)}</p>
                            )}
                        </div>

                        {product.stockAmount !== undefined && (
                            <p className={`text-xs uppercase tracking-widest font-bold mb-8 ${!isOutOfStock ? 'text-[#111] dark:text-white' : 'text-red-500'}`}>
                                {!isOutOfStock ? 'In Stock' : 'Out of Stock'}
                            </p>
                        )}
                        
                        <div className="flex items-center mb-10 pb-10 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex text-[#111] dark:text-white">
                                {[1,2,3,4,5].map(star => <StarIcon key={star} className="h-4 w-4" />)}
                            </div>
                            <span className="ml-4 text-xs font-medium text-gray-500 tracking-widest uppercase">
                                {productReviews.length} Reviews
                            </span>
                        </div>
                        
                        <div className="mb-12">
                            <button onClick={() => setIsDescriptionOpen(!isDescriptionOpen)} className="w-full flex justify-between items-center group focus:outline-none mb-4">
                                <span className="text-sm font-bold uppercase tracking-widest text-[#111] dark:text-white">The Details</span>
                                <motion.div animate={{ rotate: isDescriptionOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                    <ChevronDownIcon className="w-5 h-5 text-[#111] dark:text-white" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {isDescriptionOpen && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="pt-2">
                                            {formatDescription(product.description)}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-auto">
                            <div className="flex items-center border border-[#111] dark:border-white h-14 w-full sm:w-32 bg-transparent rounded-none">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-[#111] dark:text-white h-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">-</button>
                                <span className="flex-1 text-center font-medium text-[#111] dark:text-white">{quantity}</span>
                                <button onClick={() => setQuantity(Math.min(product.stockAmount || 1, quantity + 1))} disabled={quantity >= (product.stockAmount || 0)} className="px-4 text-[#111] dark:text-white h-full disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">+</button>
                            </div>
                            
                            <motion.button onClick={() => onAddToCart(product, quantity)} disabled={isOutOfStock} className="flex-1 bg-[#111] dark:bg-white text-white dark:text-[#111] h-14 text-xs font-bold tracking-[0.2em] uppercase rounded-none hover:bg-black/80 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                {/* Reviews Section */}
                <div className="border-t border-[#111] dark:border-gray-800 pt-24">
                    <h2 className="text-2xl font-medium tracking-tight text-[#111] dark:text-white mb-12">Client Feedback</h2>
                    
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                        <div className="lg:col-span-7 space-y-4 mb-12 lg:mb-0">
                            {productReviews.length === 0 ? (
                                <p className="text-gray-500 text-sm italic">No reviews yet. Be the first to share your experience.</p>
                            ) : (
                                productReviews.map((review, index) => (
                                    <div key={index} className="bg-[#F9F9F9] dark:bg-[#111] p-8 border border-gray-200 dark:border-gray-800 rounded-none">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="font-bold text-xs uppercase tracking-widest text-[#111] dark:text-white">{review.userName}</p>
                                                <p className="text-xs text-gray-500 mt-1">{formatDate(review.createdAt || review.date || new Date())}</p>
                                            </div>
                                            <div className="flex text-[#111] dark:text-white">
                                                {[1,2,3,4,5].map(star => (
                                                    star <= review.rating ? <StarIcon key={star} className="h-3 w-3" /> : <StarOutlineIcon key={star} className="h-3 w-3" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{review.text}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="lg:col-span-5">
                            {hasPurchased ? (
                                <div className="border border-[#111] dark:border-gray-800 p-8 bg-white dark:bg-[#0A0A0A] rounded-none sticky top-32">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Leave a Review</h3>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-6">
                                            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Rating</p>
                                            <div className="flex gap-2">
                                                {[1,2,3,4,5].map(star => (
                                                    <button type="button" key={star} onClick={() => setRating(star)} className="text-[#111] dark:text-white focus:outline-none transition-transform hover:scale-110">
                                                        {star <= rating ? <StarIcon className="h-6 w-6" /> : <StarOutlineIcon className="h-6 w-6" />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-8">
                                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-3">Experience</label>
                                            <textarea required rows="4" value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your thoughts..." className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent text-[#111] dark:text-white rounded-none focus:border-[#111] dark:focus:border-white focus:outline-none transition-colors text-sm"></textarea>
                                        </div>
                                        <button type="submit" className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-none hover:bg-black/80 dark:hover:bg-gray-200 transition-colors">
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="border border-gray-200 dark:border-gray-800 p-12 bg-[#F9F9F9] dark:bg-[#111] rounded-none text-center">
                                    <div className="mx-auto w-12 h-12 text-gray-400 mb-6 flex justify-center items-center"><ShoppingBagIcon /></div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#111] dark:text-white mb-2">Verified Clients Only</h3>
                                    <p className="text-sm text-gray-500">Reviews are reserved for accounts that have purchased this item.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

const AuthPage = ({ onLogin, onNavigate }) => {
    const [authView, setAuthView] = useState('login'); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = authView === 'login' ? '/auth/login' : '/auth/register';
        
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            localStorage.setItem('token', data.token);
            const userData = data.user ? data.user : data;
            if (!userData.wishlist) userData.wishlist = []; 
            localStorage.setItem('user', JSON.stringify(userData));
            
            onLogin(userData);
            onNavigate('home');
        } catch (error) { alert(error.message); } finally { setLoading(false); }
    };

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] py-32 px-4 sm:px-6">
            <div className="max-w-md w-full bg-white dark:bg-[#111] p-10 border border-gray-200 dark:border-gray-800 rounded-none">
                
                {(authView === 'login' || authView === 'register') && (
                    <>
                        <div className="mb-10 text-center border-b border-gray-200 dark:border-gray-800 pb-8">
                            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#111] dark:text-white">
                                {authView === 'login' ? 'Sign In' : 'Create Account'}
                            </h2>
                        </div>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                                    <input type="email" required className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent text-[#111] dark:text-white rounded-none focus:outline-none focus:border-[#111] dark:focus:border-white transition-colors" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                                    <input type="password" required minLength="6" className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent text-[#111] dark:text-white rounded-none focus:outline-none focus:border-[#111] dark:focus:border-white transition-colors" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>
                            
                            {authView === 'login' && (
                                <div className="text-right">
                                    <button type="button" onClick={() => { setAuthView('forgot'); setResetEmail(email); }} className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#111] dark:hover:text-white transition-colors">
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <div className="pt-4">
                                <button disabled={loading} type="submit" className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-none hover:bg-black/80 dark:hover:bg-gray-200 transition-colors disabled:opacity-50">
                                    {loading ? 'Processing...' : (authView === 'login' ? 'Authenticate' : 'Register')}
                                </button>
                            </div>
                            <div className="text-center mt-6">
                                <button type="button" onClick={() => setAuthView(authView === 'login' ? 'register' : 'login')} className="text-xs tracking-widest uppercase font-medium text-gray-500 hover:text-[#111] dark:hover:text-white border-b border-transparent hover:border-[#111] dark:hover:border-white pb-1 transition-all">
                                    {authView === 'login' ? "Create an account" : "Return to sign in"}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {authView === 'forgot' && (
                    <div className="space-y-6">
                        <div className="mb-10 text-center border-b border-gray-200 dark:border-gray-800 pb-8">
                            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#111] dark:text-white mb-2">Reset Password</h2>
                            <p className="text-xs text-gray-500 tracking-widest uppercase">Enter email for recovery code</p>
                        </div>
                        <div>
                            <input type="email" placeholder="EMAIL ADDRESS" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent text-[#111] dark:text-white rounded-none focus:outline-none focus:border-[#111] dark:focus:border-white transition-colors text-xs tracking-widest uppercase" />
                        </div>
                        <button disabled={loading} onClick={async () => {
                            setLoading(true);
                            try {
                                await fetch(`${API_URL}/auth/forgot-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: resetEmail }) });
                                setAuthView('reset');
                            } catch (e) { alert("Failed to send reset code."); } finally { setLoading(false); }
                        }} className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-none hover:bg-black/80 dark:hover:bg-gray-200 transition-colors disabled:opacity-50">
                            {loading ? 'Sending...' : 'Send Code'}
                        </button>
                        <div className="text-center">
                            <button onClick={() => setAuthView('login')} className="text-xs tracking-widest uppercase font-medium text-gray-500 hover:text-[#111] dark:hover:text-white border-b border-transparent hover:border-[#111] dark:hover:border-white pb-1 transition-all">Cancel</button>
                        </div>
                    </div>
                )}

                {authView === 'reset' && (
                    <div className="space-y-6">
                        <div className="mb-10 text-center border-b border-gray-200 dark:border-gray-800 pb-8">
                            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#111] dark:text-white mb-2">Enter Code</h2>
                            <p className="text-xs text-gray-500 tracking-widest uppercase">Sent to {resetEmail}</p>
                        </div>
                        <div className="space-y-4">
                            <input type="text" placeholder="6-DIGIT CODE" value={resetCode} onChange={(e) => setResetCode(e.target.value)} maxLength={6} className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent text-[#111] dark:text-white text-center rounded-none focus:outline-none focus:border-[#111] dark:focus:border-white transition-colors text-xl tracking-[0.5em] font-bold" />
                            <input type="password" placeholder="NEW PASSWORD" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent text-[#111] dark:text-white rounded-none focus:outline-none focus:border-[#111] dark:focus:border-white transition-colors text-xs tracking-widest uppercase" />
                        </div>
                        <button disabled={loading} onClick={async () => {
                            setLoading(true);
                            try {
                                const res = await fetch(`${API_URL}/auth/reset-password`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: resetEmail, code: resetCode, newPassword }) });
                                if (res.ok) { alert("Password successfully reset."); setAuthView('login'); } else { const data = await res.json(); alert(data.message); }
                            } catch (e) { alert("Failed to reset password."); } finally { setLoading(false); }
                        }} className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-none hover:bg-black/80 dark:hover:bg-gray-200 transition-colors disabled:opacity-50">
                            {loading ? 'Verifying...' : 'Update Password'}
                        </button>
                        <div className="text-center">
                            <button onClick={() => setAuthView('login')} className="text-xs tracking-widest uppercase font-medium text-gray-500 hover:text-[#111] dark:hover:text-white border-b border-transparent hover:border-[#111] dark:hover:border-white pb-1 transition-all">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const CartPage = ({ cart, onUpdateCart, onRemoveFromCart, onNavigate }) => {
    const subtotal = useMemo(() => cart.reduce((total, item) => {
        const itemPrice = item.discountPercentage > 0 ? item.price - (item.price * (item.discountPercentage / 100)) : item.price;
        return total + itemPrice * item.quantity;
    }, 0), [cart]);

    const [showDisclaimer, setShowDisclaimer] = useState(false);
    
    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen pt-32 pb-24 relative">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#111] dark:text-white">Shopping Bag</h1>
                </div>
                
                {cart.length === 0 ? (
                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-24 text-center rounded-none">
                        <div className="mx-auto w-12 h-12 text-[#111] dark:text-white flex justify-center items-center mb-8"><ShoppingBagIcon /></div>
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-4">Your bag is empty</h2>
                        <button onClick={() => onNavigate('shop')} className="border-b border-[#111] dark:border-white text-xs tracking-widest uppercase pb-1 hover:opacity-50 transition-opacity text-[#111] dark:text-white">Discover Fragrances</button>
                    </div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
                        <section className="lg:col-span-8">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-800 border-t border-gray-200 dark:border-gray-800">
                                <AnimatePresence>
                                    {cart.map((item) => {
                                        const imageUrl = item.image.startsWith('http') ? item.image : `${API_BASE_URL}/${item.image}`;
                                        const effectivePrice = item.discountPercentage > 0 ? item.price - (item.price * (item.discountPercentage / 100)) : item.price;

                                        return (
                                            <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key={item.id} className="flex py-8">
                                                <div className="flex-shrink-0 w-32 h-40 bg-[#F9F9F9] dark:bg-black border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden relative">
                                                    <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="ml-6 flex-1 flex flex-col">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{item.bottleSize || 'Signature'}</p>
                                                            <h3 className="text-lg font-medium text-[#111] dark:text-white">{item.name}</h3>
                                                        </div>
                                                        <button onClick={() => onRemoveFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors"><XIcon /></button>
                                                    </div>
                                                    <div className="mt-auto flex items-end justify-between">
                                                        <div className="flex items-center border border-[#111] dark:border-gray-600 h-10 w-28 bg-transparent rounded-none">
                                                            <button onClick={() => onUpdateCart(item.id, Math.max(1, item.quantity - 1))} className="px-3 text-[#111] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">-</button>
                                                            <span className="flex-1 text-center text-sm font-medium text-[#111] dark:text-white">{item.quantity}</span>
                                                            <button onClick={() => onUpdateCart(item.id, Math.min(item.stockAmount || 1, item.quantity + 1))} disabled={item.quantity >= (item.stockAmount || 0)} className="px-3 text-[#111] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50">+</button>
                                                        </div>
                                                        <p className="font-medium text-lg text-[#111] dark:text-white">{formatPrice(effectivePrice * item.quantity)}</p>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        );
                                    })}
                                </AnimatePresence>
                            </ul>
                        </section>
                        
                        <section className="mt-16 lg:mt-0 lg:col-span-4 sticky top-32">
                            <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-8 rounded-none">
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Order Summary</h2>
                                <dl className="space-y-4 text-sm text-gray-600 dark:text-gray-400 mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
                                    <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-medium text-[#111] dark:text-white">{formatPrice(subtotal)}</dd></div>
                                    <div className="flex justify-between"><dt>Shipping</dt><dd className="text-gray-500 italic">Calculated at next step</dd></div>
                                </dl>
                                <div className="flex justify-between items-end mb-8">
                                    <dt className="text-xs font-bold uppercase tracking-widest text-[#111] dark:text-white">Estimated Total</dt>
                                    <dd className="text-2xl font-medium text-[#111] dark:text-white">{formatPrice(subtotal)}</dd>
                                </div>
                                <button onClick={() => setShowDisclaimer(true)} className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-none hover:bg-black/80 dark:hover:bg-gray-200 transition-colors">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </div>
            
            <AnimatePresence>
                {showDisclaimer && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-[#0A0A0A] p-12 max-w-lg w-full border border-gray-200 dark:border-gray-800 rounded-none">
                            <h3 className="text-lg font-black uppercase tracking-widest text-[#111] dark:text-white mb-6 text-center border-b border-gray-200 dark:border-gray-800 pb-4">Delivery Policy</h3>
                            <p className="text-gray-500 text-sm leading-relaxed text-center mb-10">Delivery within Lagos takes 24 to 48 hours, while delivery outside Lagos takes 3-5 business days. Delivery pricing varies by location; our concierge team will reach out to confirm precise logistics. Thank you for choosing Opevicky.</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={() => setShowDisclaimer(false)} className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 border border-gray-300 dark:border-gray-700 hover:border-[#111] dark:hover:border-white hover:text-[#111] dark:hover:text-white transition-colors rounded-none">Decline</button>
                                <button onClick={() => { setShowDisclaimer(false); onNavigate('checkout'); }} className="flex-1 bg-[#111] dark:bg-white text-white dark:text-[#111] font-bold text-xs uppercase tracking-widest py-4 rounded-none hover:bg-black/80 dark:hover:bg-gray-200 transition-colors">Acknowledge</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const CheckoutPage = ({ cart, onPaymentSuccess, currentUser, onNavigate }) => {
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: currentUser?.email || '', phone: '', address: '', city: '', state: '' });
    const [isPaying, setIsPaying] = useState(false);
    const [isGuestCheckout, setIsGuestCheckout] = useState(false); 
    
    const subtotal = useMemo(() => cart.reduce((total, item) => {
        const itemPrice = item.discountPercentage > 0 ? item.price - (item.price * (item.discountPercentage / 100)) : item.price;
        return total + itemPrice * item.quantity;
    }, 0), [cart]);

    if (!currentUser && !isGuestCheckout) {
        return (
            <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen py-32 flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white dark:bg-[#111] p-12 border border-gray-200 dark:border-gray-800 text-center rounded-none">
                    <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#111] dark:text-white mb-4">Authentication</h2>
                    <p className="text-gray-500 text-sm mb-12">Sign in for a streamlined experience, or proceed as a guest.</p>
                    
                    <div className="space-y-4">
                        <button onClick={() => onNavigate('auth')} className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-xs font-bold tracking-widest uppercase py-4 hover:bg-black/80 dark:hover:bg-gray-200 transition-colors rounded-none">
                            Sign In
                        </button>
                        <button onClick={() => setIsGuestCheckout(true)} className="w-full bg-transparent text-[#111] dark:text-white text-xs font-bold tracking-widest uppercase py-4 border border-[#111] dark:border-white hover:bg-[#111] hover:text-white dark:hover:bg-white dark:hover:text-[#111] transition-colors rounded-none">
                            Guest Checkout
                        </button>
                    </div>
                </div>
            </motion.div>
        );
    }

    const handleInputChange = (e) => setCustomerInfo(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    const handlePaystackPayment = () => {
        setIsPaying(true);
        const triggerPaystack = () => {
            const handler = window.PaystackPop.setup({
                key: PAYSTACK_PUBLIC_KEY, email: customerInfo.email, amount: subtotal * 100, ref: (new Date()).getTime().toString(),
                metadata: { name: customerInfo.name, phone: customerInfo.phone, address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}` },
                onClose: () => { setIsPaying(false); },
                callback: (reference) => { onPaymentSuccess(reference.reference, customerInfo); }
            });
            handler.openIframe();
        };

        if (typeof window.PaystackPop === 'undefined') {
            const script = document.createElement('script'); script.src = 'https://js.paystack.co/v1/inline.js'; script.async = true; script.onload = triggerPaystack;
            script.onerror = () => { alert('Could not load payment gateway.'); setIsPaying(false); };
            document.body.appendChild(script);
        } else { triggerPaystack(); }
    };

    const isFormValid = customerInfo.email && customerInfo.name && customerInfo.phone && customerInfo.address && customerInfo.city && customerInfo.state && cart.length > 0;

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen pt-32 pb-24">
            <main className="max-w-screen-xl mx-auto px-6 lg:px-12">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-12 flex items-center justify-between">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#111] dark:text-white">Checkout</h1>
                    {!currentUser && <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 border border-gray-300 dark:border-gray-700 px-3 py-1">Guest</span>}
                </div>

                <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white mb-6">Contact Detail</h2>
                            <div className="space-y-4">
                                <input type="text" name="name" placeholder="FULL NAME" onChange={handleInputChange} value={customerInfo.name} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 text-[#111] dark:text-white text-xs tracking-widest p-4 focus:border-[#111] dark:focus:border-white focus:outline-none transition-colors rounded-none" required />
                                <input type="email" name="email" placeholder="EMAIL ADDRESS" onChange={handleInputChange} value={customerInfo.email} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 text-[#111] dark:text-white text-xs tracking-widest p-4 focus:border-[#111] dark:focus:border-white focus:outline-none transition-colors rounded-none" required />
                                <input type="tel" name="phone" placeholder="PHONE NUMBER" onChange={handleInputChange} value={customerInfo.phone} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 text-[#111] dark:text-white text-xs tracking-widest p-4 focus:border-[#111] dark:focus:border-white focus:outline-none transition-colors rounded-none" required />
                            </div>
                        </section>
                        
                        <section>
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white mb-6">Shipping Destination</h2>
                            <div className="space-y-4">
                                <input type="text" name="address" placeholder="STREET ADDRESS" onChange={handleInputChange} value={customerInfo.address} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 text-[#111] dark:text-white text-xs tracking-widest p-4 focus:border-[#111] dark:focus:border-white focus:outline-none transition-colors rounded-none" required />
                                <div className="grid grid-cols-2 gap-6">
                                    <input type="text" name="city" placeholder="CITY" onChange={handleInputChange} value={customerInfo.city} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 text-[#111] dark:text-white text-xs tracking-widest p-4 focus:border-[#111] dark:focus:border-white focus:outline-none transition-colors rounded-none" required />
                                    <input type="text" name="state" placeholder="STATE/REGION" onChange={handleInputChange} value={customerInfo.state} className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 text-[#111] dark:text-white text-xs tracking-widest p-4 focus:border-[#111] dark:focus:border-white focus:outline-none transition-colors rounded-none" required />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-16 lg:mt-0 lg:col-span-5">
                        <div className="bg-white dark:bg-[#111] p-8 border border-gray-200 dark:border-gray-800 rounded-none sticky top-32">
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">Manifest</h2>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[40vh] overflow-y-auto pr-4 mb-8">
                                {cart.map((product) => {
                                    const imageUrl = product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`;
                                    const effectivePrice = product.discountPercentage > 0 ? product.price - (product.price * (product.discountPercentage / 100)) : product.price;

                                    return (
                                        <li key={product.id} className="flex py-6">
                                            <div className="w-16 h-20 bg-[#F9F9F9] dark:bg-black border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden flex-shrink-0">
                                                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="ml-4 flex-1 flex flex-col justify-center">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="text-sm font-medium text-[#111] dark:text-white">{product.name}</h3>
                                                    <p className="text-sm font-medium text-[#111] dark:text-white">{formatPrice(effectivePrice * product.quantity)}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 uppercase tracking-widest">Qty: {product.quantity}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="flex justify-between items-end pt-6 border-t border-[#111] dark:border-white mb-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#111] dark:text-white">Total</span>
                                <span className="text-2xl font-medium text-[#111] dark:text-white">{formatPrice(subtotal)}</span>
                            </div>
                            <button type="button" onClick={handlePaystackPayment} className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-xs font-bold tracking-[0.2em] uppercase py-4 rounded-none hover:bg-black/80 dark:hover:bg-gray-200 transition-colors disabled:opacity-50" disabled={!isFormValid || isPaying}>
                                {isPaying ? 'Processing...' : 'Authorize Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </motion.div>
    );
};

const WishlistPage = ({ allProducts, currentUser, onNavigate, onProductClick, onToggleWishlist }) => {
    if (!currentUser) {
        return (
            <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen py-32 flex items-center justify-center px-6">
                <div className="max-w-md w-full bg-white dark:bg-[#111] p-12 border border-gray-200 dark:border-gray-800 text-center rounded-none">
                    <HeartIcon className="w-10 h-10 mx-auto text-gray-400 mb-6" />
                    <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#111] dark:text-white mb-4">Authentication Required</h2>
                    <p className="text-gray-500 text-sm mb-12">Sign in to view and curate your personal collection.</p>
                    <button onClick={() => onNavigate('auth')} className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-xs font-bold tracking-widest uppercase py-4 hover:bg-black/80 dark:hover:bg-gray-200 transition-colors rounded-none">
                        Sign In
                    </button>
                </div>
            </motion.div>
        );
    }

    const wishlistedItems = allProducts.filter(product => currentUser.wishlist?.includes(product.id));

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen pt-32 pb-24">
            <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#111] dark:text-white mb-2">Curated Collection</h1>
                    <p className="text-xs tracking-[0.2em] uppercase text-gray-500">Your personal selection.</p>
                </div>

                {wishlistedItems.length === 0 ? (
                    <div className="border border-gray-200 dark:border-gray-800 p-24 text-center mt-8 bg-white dark:bg-[#111] rounded-none">
                        <HeartIcon className="w-8 h-8 mx-auto text-gray-300 mb-6" />
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-4">Your collection is empty</h2>
                        <button onClick={() => onNavigate('shop')} className="border-b border-[#111] dark:border-white text-xs tracking-widest uppercase pb-1 hover:opacity-50 transition-opacity text-[#111] dark:text-white">Explore Catalog</button>
                    </div>
                ) : (
                    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                        {wishlistedItems.map(product => (
                            <ProductCard key={product.id} product={product} onProductClick={onProductClick} onToggleWishlist={onToggleWishlist} isWishlisted={true} />
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const OrdersPage = ({ orders, onNavigate }) => {
    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen pt-32 pb-24">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
                <div className="border-b border-gray-200 dark:border-gray-800 pb-8 mb-12">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#111] dark:text-white">Order History</h1>
                </div>
                
                {!orders || orders.length === 0 ? (
                    <div className="border border-gray-200 dark:border-gray-800 p-24 text-center mt-8 bg-white dark:bg-[#111] rounded-none">
                        <ReceiptIcon className="w-8 h-8 mx-auto text-gray-300 mb-6" />
                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-4">No Previous Orders</h2>
                        <button onClick={() => onNavigate('shop')} className="border-b border-[#111] dark:border-white text-xs tracking-widest uppercase pb-1 hover:opacity-50 transition-opacity text-[#111] dark:text-white">Begin Shopping</button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {orders.map(order => (
                            <div key={order._id || order.id} className="bg-white dark:bg-[#111] p-8 lg:p-12 border border-gray-200 dark:border-gray-800 rounded-none shadow-sm">
                                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
                                    <div className="mb-6 md:mb-0">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2">Order / {(order._id || order.id || '').toString().slice(-8)}</p>
                                        <p className="text-sm text-[#111] dark:text-white">{formatDate(order.createdAt || order.date)}</p>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <p className="text-2xl font-medium text-[#111] dark:text-white mb-2">{formatPrice(order.totalAmount || order.total)}</p>
                                        <span className="inline-block border border-[#111] dark:border-white text-[#111] dark:text-white px-3 py-1 text-[10px] tracking-widest uppercase">
                                            {order.status || 'Processing'}
                                        </span>
                                    </div>
                                </div>
                                
                                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {(order.cart || []).map((item, i) => {
                                        const imageUrl = item.image && item.image.startsWith('http') ? item.image : `${API_BASE_URL}/${item.image}`;
                                        return (
                                            <li key={i} className="py-6 flex flex-col sm:flex-row sm:items-center gap-6">
                                                <div className="w-20 h-24 bg-[#F9F9F9] dark:bg-black border border-gray-200 dark:border-gray-800 overflow-hidden flex-shrink-0 rounded-none">
                                                    <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">QTY: {item.quantity}</p>
                                                    <h4 className="text-base font-medium text-[#111] dark:text-white">{item.name}</h4>
                                                </div>
                                                <button onClick={() => onNavigate('product', { ...item, id: item.product || item.id || item._id })} className="sm:ml-auto self-start sm:self-auto text-[10px] font-bold text-[#111] dark:text-white uppercase tracking-[0.2em] border-b border-[#111] dark:border-white pb-0.5 hover:opacity-50 transition-opacity">
                                                    Review Item
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const OrderConfirmationPage = ({ onNavigate }) => ( 
    <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen flex items-center justify-center py-32 px-6"> 
        <div className="max-w-xl w-full text-center border border-[#111] dark:border-gray-800 bg-white dark:bg-[#111] p-16 rounded-none"> 
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }} className="mb-10"><CheckCircleIcon /></motion.div>
            <h1 className="text-3xl font-black uppercase tracking-[0.1em] text-[#111] dark:text-white mb-4">Transaction Approved</h1> 
            <p className="text-sm text-gray-500 leading-relaxed mb-12">Thank you for your purchase. Your digital receipt and shipping updates will be dispatched to your email.</p> 
            <button onClick={() => onNavigate('orders')} className="w-full bg-[#111] dark:bg-white text-white dark:text-[#111] text-xs tracking-widest font-bold uppercase py-4 rounded-none hover:bg-black/80 dark:hover:bg-gray-200 transition-colors">
                Track Acquisition
            </button> 
        </div> 
    </motion.div> 
);

export default function App() {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [notification, setNotification] = useState({ message: '', show: false });
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [orders, setOrders] = useState([]);

    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                const activeProducts = data.data.products
                    .filter(product => product.isActive !== false)
                    .map(product => ({ ...product, id: product._id || product.id }));
                setAllProducts(activeProducts);
            } catch (e) { setError(e.message); } finally { setLoading(false); }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (currentUser) {
            const fetchOrders = async () => {
                const token = localStorage.getItem('token');
                if (!token) return;
                try {
                    const res = await fetch(`${API_URL}/orders/my-orders`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        const fetchedOrders = Array.isArray(data) ? data : (data.orders || data.data || []);
                        setOrders(fetchedOrders);
                    }
                } catch(e) { console.error("Error fetching orders:", e); }
            };
            fetchOrders();
        } else {
            setOrders([]);
        }
    }, [currentUser]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const results = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        setSearchResults(results);
        handleNavigate('search');
    };

    const showNotification = (message) => { setNotification({ message, show: true }); setTimeout(() => { setNotification({ message: '', show: false }); }, 3000); };
    
    const handleNavigate = (page, data = null) => { 
        setCurrentPage(page); 
        if(page === 'product' && data) { setSelectedProduct(data); }
        else if (page !== 'product') { setSelectedProduct(null); }
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };
    
    const handleProductClick = (product) => { handleNavigate('product', product); };
    const handleAddToCart = (product, quantity) => { setCart(prevCart => { const existingItem = prevCart.find(item => item.id === product.id); if (existingItem) { return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item); } return [...prevCart, { ...product, quantity }]; }); showNotification(`Item Reserved`); };
    const handleUpdateCart = (productId, quantity) => { setCart(prevCart => prevCart.map(item => item.id === productId ? {...item, quantity: quantity} : item).filter(item => item.quantity > 0)); };
    const handleRemoveFromCart = (productId) => { setCart(prevCart => prevCart.filter(item => item.id !== productId)); };
    const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

    const handleToggleWishlist = async (id) => {
        if(!currentUser) { handleNavigate('auth'); return; }
        const currentWishlist = currentUser.wishlist || []; 
        const isWishlisted = currentWishlist.includes(id);
        const newWishlist = isWishlisted ? currentWishlist.filter(wId => wId !== id) : [...currentWishlist, id];
            
        const updatedUser = { ...currentUser, wishlist: newWishlist };
        setCurrentUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser)); 
        showNotification(isWishlisted ? "Removed from collection" : "Saved to collection");

        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/users/wishlist`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ wishlist: newWishlist })
            });
        } catch (error) { console.error("Sync failed:", error); }
    }
    
    const handleSubmitReview = async (productId, reviewData) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ rating: reviewData.rating, text: reviewData.text })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setAllProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: data.reviews } : p));
            setSelectedProduct(prev => prev ? { ...prev, reviews: data.reviews } : prev); 
            showNotification("Feedback Recorded");
        } catch (e) { alert(e.message); }
    };

    const handlePaymentSuccess = async (reference, customerDetails) => {
        const token = localStorage.getItem('token');
        try {
            const adjustedCart = cart.map(item => ({
                ...item,
                price: item.discountPercentage > 0 ? item.price - (item.price * (item.discountPercentage / 100)) : item.price
            }));

            const response = await fetch(`${API_URL}/payments/verify`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ reference: reference, cart: adjustedCart, customer: customerDetails }),
            });
            
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Verification failed');
            }

            const data = await response.json();
            setOrders(prev => [data.order, ...prev]);
            setCart([]);
            handleNavigate('orderConfirmation');
        } catch (err) {
            console.error("Sync failed:", err);
            alert(`Process interrupted: ${err.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setOrders([]);
        handleNavigate('home');
    };

    const renderPage = () => {
        const pageProps = { allProducts, onProductClick: handleProductClick, onNavigate: handleNavigate, loading, error, onToggleWishlist: handleToggleWishlist, currentUser };
        
        return (
            <AnimatePresence mode="wait">
                <React.Fragment key={currentPage + (selectedProduct ? selectedProduct.id : '')}>
                    {currentPage === 'product' && selectedProduct ? (
                        <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} onBack={() => handleNavigate('shop')} onToggleWishlist={handleToggleWishlist} isWishlisted={currentUser?.wishlist?.includes(selectedProduct.id)} currentUser={currentUser} orders={orders} onSubmitReview={handleSubmitReview} />
                    ) : currentPage === 'home' ? ( <HomePage {...pageProps} />
                    ) : currentPage === 'about' ? ( <AboutPage />
                    ) : currentPage === 'shop' ? ( <ShopPage {...pageProps} />
                    ) : currentPage === 'search' ? ( <SearchPage searchResults={searchResults} onProductClick={handleProductClick} loading={loading} query={searchQuery} onToggleWishlist={handleToggleWishlist} currentUser={currentUser} />
                    ) : currentPage === 'cart' ? ( <CartPage cart={cart} onUpdateCart={handleUpdateCart} onRemoveFromCart={handleRemoveFromCart} onNavigate={handleNavigate} />
                    ) : currentPage === 'checkout' ? ( <CheckoutPage cart={cart} onPaymentSuccess={handlePaymentSuccess} currentUser={currentUser} onNavigate={handleNavigate} />
                    ) : currentPage === 'orderConfirmation' ? ( <OrderConfirmationPage onNavigate={handleNavigate} />
                    ) : currentPage === 'orders' ? ( <OrdersPage orders={orders} onNavigate={handleNavigate} />
                    ) : currentPage === 'wishlist' ? ( <WishlistPage allProducts={allProducts} currentUser={currentUser} onNavigate={handleNavigate} onProductClick={handleProductClick} onToggleWishlist={handleToggleWishlist} />
                    ) : currentPage === 'auth' ? ( <AuthPage onLogin={setCurrentUser} onNavigate={handleNavigate} />
                    ) : ( <HomePage {...pageProps} /> )}
                </React.Fragment>
            </AnimatePresence>
        );
    };

    return (
        <ThemeProvider>
            <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] font-sans text-[#111] dark:text-white min-h-screen flex flex-col selection:bg-[#111] selection:text-white dark:selection:bg-white dark:selection:text-[#111]">
                <Notification message={notification.message} show={notification.show} />
                <Header setMobileMenuOpen={setMobileMenuOpen} onNavigate={handleNavigate} cartCount={cartCount} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout} />
                <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} onNavigate={handleNavigate} />
                <main className="flex-grow">{renderPage()}</main>
                <Footer onNavigate={handleNavigate} />
            </div>
        </ThemeProvider>
    );
}