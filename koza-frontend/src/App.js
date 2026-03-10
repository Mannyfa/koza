import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


import heroImage1 from './images/hero.png';
import heroImage2 from './images/image 3.png';
import heroImage3 from './images/image1.png';
import heroImage4 from './images/image2.png';
// import myLogo from './images/logo.png';


// --- API Configuration ---
const API_BASE_URL = 'https://koza-2fkh.onrender.com';
const API_URL = `${API_BASE_URL}/api`;

const PAYSTACK_PUBLIC_KEY = "pk_test_bec9f5f9e180775e22c634dc005c55510f2a86ea";

// --- Theme Context ---
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

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

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
  { name: 'Blog', page: 'blog' },
  { name: 'Contact', page: 'contact' },
  { name: 'Track Order', page: 'track' },
];

const heroSlides = [
    {
        imageUrl: heroImage1, 
        title: 'Luxury Perfume, Unmatched Quality.',
        subtitle: 'Discover flawless fragrances that empower your style. Crafted for perfection, delivered to your doorstep.'
    },
    {
        imageUrl: heroImage2,
        title: 'Define Your Fragrance.',
        subtitle: 'Embrace your unique essence with our premium collection of curated scents.'
    },
    {
        imageUrl: heroImage3,
        title: 'Sleek, Nice, Stunning.',
        subtitle: 'Achieve a timeless, sophisticated aura with our long-lasting perfumes.'
    },
    {
        imageUrl: heroImage4,
        title: 'Confidence in Yourself.',
        subtitle: 'Invest in perfume that not only smells good but makes you feel incredible.'
    }
];
const whyUsData = [
    { title: '100% Quality Perfumes', description: 'We source only the highest quality, undiluted perfumes for all our products.', icon: 'SparklesIcon' },
    { title: 'No Stains Experts', description: 'Our high-definition sprays provides the most natural-looking, undetectable perfume stains.', icon: 'ScissorsIcon' },
    { title: 'Fast, Secure Delivery', description: 'Your order is processed quickly and shipped securely to your doorstep.', icon: 'TruckIcon' },
    { title: 'Exceptional Support', description: 'Our dedicated team is here to help you with any questions or concerns.', icon: 'ChatBubbleIcon' }
];

// --- Helper Functions & Icons ---
const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const ShoppingBagIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const XIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const StarIcon = ({ className }) => (<svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#D4AF37] mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L12 12l-2.293-2.293a1 1 0 010-1.414L12 6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l2.293 2.293a1 1 0 010 1.414L12 18l-2.293-2.293a1 1 0 010-1.414L12 12zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ScissorsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a1 1 0 01-1.414 0L9 12m0 0l2.879-2.879a1 1 0 011.414 0L16 12M4 4v.01M4 8v.01M4 12v.01M4 16v.01M8 4v.01M12 4v.01M16 4v.01" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 16l2 2h3.5a1 1 0 001-1.447l-2-4A1 1 0 0016.5 9H13v7z" /></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const HeartIcon = ({ className, isFilled }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>);
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"></path></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const MoonIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>);
const SunIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.485-8.485l-.707.707M5.222 5.222l-.707.707M12 12a4 4 0 100-8 4 4 0 000 8zM21 12h-1M4 12H3m16.778 6.778l-.707-.707M6.929 18.778l-.707-.707" /></svg>);

const icons = { SparklesIcon, ScissorsIcon, TruckIcon, ChatBubbleIcon };

// --- Animation Variants ---
const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    out: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};


// --- UI Components ---
const Notification = ({ message, show }) => (
    <AnimatePresence>
        {show && (
            <motion.div 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="fixed top-20 right-5 z-50"
            >
                <div className="bg-[#191970] text-[#D4AF37] border border-[#D4AF37] font-bold rounded-lg shadow-xl p-4 flex items-center gap-3">
                    <SparklesIcon className="w-5 h-5" />
                    <p>{message}</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#191970] hover:text-[#D4AF37] dark:text-gray-300 dark:hover:text-[#D4AF37] transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};

const Header = ({ setMobileMenuOpen, onNavigate, cartCount, onSearch, currentUser, onLogout }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    return (
        <header className="sticky top-0 z-40 flex flex-col shadow-sm">
            {/* Solid Announcement Bar */}
            <div className="bg-gradient-to-r from-[#191970] to-[#0047AB] text-[#D4AF37] text-center p-2 text-xs font-semibold tracking-widest uppercase relative z-50">
                Free Delivery On All Orders In Nigeria
            </div>
            
            {/* Glassmorphism Navbar */}
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <button onClick={() => onNavigate('home')} className="flex items-center gap-3 group">
                                {/* 👉 LOGO PLACEHOLDER: Swap 'https://placehold.co/...' with your imported 'myLogo' variable like src={myLogo}  */}
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border border-[#D4AF37] shadow-sm">
                                    <img 
                                        src="https://placehold.co/100x100/191970/D4AF37?text=OS" 
                                        alt="OpevickyScents Logo" 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                    />
                                </div>
                                <span className="hidden sm:block text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#191970] to-[#0047AB] dark:from-[#D4AF37] dark:to-[#B58B22] tracking-wider">
                                    OpevickyScents
                                </span>
                            </button>
                        </div>
                        
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-1 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-full p-1 border border-gray-100/50 dark:border-gray-800/50">
                                {navLinks.map((link) => (
                                    <button 
                                        key={link.name} 
                                        onClick={() => onNavigate(link.page)} 
                                        className="text-[#191970] dark:text-gray-300 hover:bg-white/80 hover:text-[#D4AF37] dark:hover:bg-black/60 dark:hover:text-[#D4AF37] px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                                    >
                                        {link.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <ThemeToggle />
                            
                            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block ml-2">
                                <input 
                                    type="search" 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                    placeholder="Search..." 
                                    className="w-48 pl-4 pr-10 py-2 rounded-full border border-gray-200/60 bg-gray-50/60 focus:bg-white/90 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] dark:bg-gray-900/60 dark:border-gray-800/60 dark:text-white transition-all outline-none backdrop-blur-sm" 
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#191970] hover:text-[#D4AF37] dark:text-gray-400 dark:hover:text-[#D4AF37] transition-colors"><SearchIcon/></button>
                            </form>
                            
                            <button className="p-2 text-[#191970] dark:text-gray-300 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] lg:hidden" onClick={() => { onSearch(prompt("Search...")) }}><SearchIcon /></button>
                            
                            <div className="relative">
                                <button onClick={() => currentUser ? setUserMenuOpen(!userMenuOpen) : onNavigate('auth')} className="p-2 text-[#191970] dark:text-gray-300 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] flex items-center rounded-full transition-colors">
                                    <UserIcon />
                                </button>
                                
                                <AnimatePresence>
                                    {currentUser && userMenuOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl ring-1 ring-black ring-opacity-5 z-50 border border-gray-100/50 dark:border-gray-800/50"
                                            onMouseLeave={() => setUserMenuOpen(false)}
                                        >
                                            <div className="px-4 py-3">
                                                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Signed in as</p>
                                                <p className="text-sm font-bold text-[#191970] dark:text-[#D4AF37] truncate mt-1">{currentUser.email}</p>
                                            </div>
                                            <div className="border-t border-gray-100/50 dark:border-gray-800/50"></div>
                                            <button onClick={() => { onNavigate('wishlist'); setUserMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-black/50 hover:text-[#D4AF37] transition-colors">My Wishlist</button>
                                            <button onClick={() => { onLogout(); setUserMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-colors">Logout</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button onClick={() => onNavigate('cart')} className="relative p-2 text-[#191970] dark:text-gray-300 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors">
                                <ShoppingBagIcon />
                                <AnimatePresence>
                                    {cartCount > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute top-0 right-0 text-[10px] font-bold bg-gradient-to-r from-[#D4AF37] to-[#B58B22] text-[#191970] rounded-full w-5 h-5 flex items-center justify-center border-2 border-white dark:border-black shadow-sm"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </button>
                            
                            <div className="md:hidden ml-1">
                                <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-[#191970] dark:text-gray-300 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors">
                                    <MenuIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
};

const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen, onNavigate }) => (
    <AnimatePresence>
        {mobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 md:hidden flex"
            >
                <div className="fixed inset-0 bg-[#191970]/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-black shadow-2xl border-r border-gray-100 dark:border-gray-800"
                >
                    <div className="absolute top-0 right-0 -mr-12 pt-4">
                        <button onClick={() => setMobileMenuOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none">
                            <XIcon className="text-white" />
                        </button>
                    </div>
                    <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto px-6">
                        <div className="mb-8">
                             <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#191970] to-[#0047AB] dark:from-[#D4AF37] dark:to-[#B58B22] tracking-wider">OpevickyScents</h2>
                        </div>
                        <nav className="space-y-2">
                            {navLinks.map((link) => (
                                <button 
                                    key={link.name} 
                                    onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }} 
                                    className="w-full text-left block px-4 py-3 rounded-xl text-base font-bold text-[#191970] dark:text-gray-300 hover:text-[#D4AF37] hover:bg-gray-50 dark:hover:bg-gray-900 dark:hover:text-[#D4AF37] transition-all"
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

const ProductCard = ({ product, onProductClick, onToggleWishlist, isWishlisted }) => {
    const imageUrl = product.image && product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`;
    
    const handleWishlistClick = (e) => {
        e.stopPropagation(); 
        onToggleWishlist(product.id);
    };

    return (
        <motion.div 
            variants={itemVariant}
            whileHover={{ y: -5 }}
            onClick={() => onProductClick(product)} 
            className="group relative cursor-pointer bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col h-full"
        >
            <div className="w-full aspect-[4/5] bg-gray-50 dark:bg-black overflow-hidden relative">
                <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x500/cccccc/333333?text=No+Image'; }} 
                />
                
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#191970]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {onToggleWishlist && (
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleWishlistClick} 
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm dark:bg-black/90 rounded-full p-2.5 text-gray-400 hover:text-red-500 z-10 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                    >
                        <HeartIcon className={`h-5 w-5 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} isFilled={isWishlisted} />
                    </motion.button>
                )}
            </div>
            
            <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                    <p className="text-xs text-[#D4AF37] uppercase tracking-wider font-bold mb-1">Fragrance</p>
                    <h3 className="text-lg font-extrabold text-[#191970] dark:text-white leading-tight mb-2 group-hover:text-[#D4AF37] transition-colors">
                        {product.name}
                    </h3>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xl font-black text-[#191970] dark:text-[#D4AF37]">{formatPrice(product.price)}</p>
                    <span className="text-sm font-bold text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                        View Details <span className="ml-1">→</span>
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

const Footer = ({ onNavigate }) => (
    <footer className="bg-gradient-to-br from-[#191970] via-[#0a0a33] to-[#0047AB] text-gray-300 py-16 mt-auto border-t-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                <div className="space-y-6">
                    <h2 className="text-2xl font-extrabold text-[#D4AF37] tracking-wider">OpevickyScents</h2>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Curating the finest luxury fragrances. Elevate your presence and leave a lasting impression wherever you go.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-[#D4AF37] tracking-wider uppercase mb-6">Shop</h3>
                    <ul className="space-y-4">
                        <li><button onClick={() => onNavigate('shop')} className="text-sm hover:text-white transition-colors">All Perfumes</button></li>
                        <li><button onClick={() => onNavigate('shop')} className="text-sm hover:text-white transition-colors">New Arrivals</button></li>
                        <li><button onClick={() => onNavigate('shop')} className="text-sm hover:text-white transition-colors">Best Sellers</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-[#D4AF37] tracking-wider uppercase mb-6">Support</h3>
                    <ul className="space-y-4">
                        <li><button onClick={() => onNavigate('contact')} className="text-sm hover:text-white transition-colors">Contact Us</button></li>
                        <li><button onClick={() => onNavigate('faq')} className="text-sm hover:text-white transition-colors">FAQ</button></li>
                        <li><button onClick={() => onNavigate('track')} className="text-sm hover:text-white transition-colors">Track Order</button></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-sm font-bold text-[#D4AF37] tracking-wider uppercase mb-6">Connect</h3>
                    <div className="flex space-x-5">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><span className="sr-only">Instagram</span><InstagramIcon /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><span className="sr-only">Twitter</span><TwitterIcon /></a>
                        <a href="mailto:hello@opevickyscents.com" className="text-gray-400 hover:text-[#D4AF37] transition-colors"><span className="sr-only">Email</span><MailIcon /></a>
                    </div>
                </div>
            </div>
            <div className="mt-16 pt-8 border-t border-[#D4AF37]/20 flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} OpevickyScents. All rights reserved.</p>
                <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-500">
                    <a href="#privacy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</a>
                    <a href="#terms" className="hover:text-[#D4AF37] transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
);

// --- Page Components ---

const HomePage = ({ allProducts, onProductClick, onNavigate, loading, error, onToggleWishlist, currentUser }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
        }, 6000); 
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out">
            {/* Hero Section */}
            <div className="relative w-full h-[85vh] bg-[#191970] overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        <img
                            className="w-full h-full object-cover"
                            src={heroSlides[currentIndex].imageUrl}
                            alt="Luxury Perfume"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#191970]/90 via-[#191970]/50 to-transparent"></div>
                    </motion.div>
                </AnimatePresence>

                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                    <div className="max-w-2xl">
                        <motion.h1 
                            key={`title-${currentIndex}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[#D4AF37]"
                        >
                            {heroSlides[currentIndex].title}
                        </motion.h1>
                        <motion.p 
                            key={`sub-${currentIndex}`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="mt-6 text-xl text-gray-200 leading-relaxed font-light"
                        >
                            {heroSlides[currentIndex].subtitle}
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="mt-10 flex gap-4"
                        >
                            <button
                                onClick={() => onNavigate('shop')}
                                className="bg-gradient-to-r from-[#D4AF37] to-[#B58B22] text-[#191970] px-10 py-4 rounded-full font-extrabold text-lg hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                            >
                                Explore Collection
                            </button>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Featured Section */}
            <div className="bg-gray-50 dark:bg-black py-24 sm:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold text-[#D4AF37] tracking-widest uppercase mb-3">Handpicked Selection</h2>
                        <h3 className="text-3xl sm:text-5xl font-extrabold text-[#191970] dark:text-white">Featured Fragrances</h3>
                    </div>
                    
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#191970] dark:border-[#D4AF37]"></div></div>
                    ) : error ? (
                        <p className="text-center text-red-500 font-bold">{error}</p>
                    ) : (
                        <motion.div 
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, margin: "-100px" }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                        >
                            {allProducts.slice(0, 4).map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onProductClick={onProductClick} 
                                    onToggleWishlist={onToggleWishlist}
                                    isWishlisted={currentUser?.wishlist.includes(product.id)}
                                />
                            ))}
                        </motion.div>
                    )}
                    
                    <div className="mt-16 text-center">
                        <button 
                            onClick={() => onNavigate('shop')} 
                            className="inline-flex items-center font-bold text-[#191970] dark:text-[#D4AF37] hover:text-[#D4AF37] dark:hover:text-[#B58B22] border-b-2 border-[#191970] dark:border-[#D4AF37] pb-1 transition-all hover:gap-2"
                        >
                            View All Products <span>→</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Features/Why Us */}
            <div className="bg-white dark:bg-[#0a0a1a] py-24 border-y border-gray-100 dark:border-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center"
                    >
                        {whyUsData.map((feature, i) => {
                            const IconComponent = icons[feature.icon];
                            return (
                                <div key={feature.title} className="flex flex-col items-center">
                                    <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#191970] to-[#0047AB] text-[#D4AF37] flex items-center justify-center mb-6 shadow-xl">
                                        <IconComponent />
                                    </div>
                                    <h4 className="text-xl font-extrabold text-[#191970] dark:text-white mb-3">{feature.title}</h4>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const ShopPage = ({ allProducts, onProductClick, loading, error, onToggleWishlist, currentUser }) => {
    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-gray-50 dark:bg-black min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-gray-200 dark:border-gray-800 pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-[#191970] dark:text-white">Our Collection</h1>
                        <p className="mt-2 text-lg text-[#D4AF37] font-semibold">Discover your signature scent.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#191970] dark:border-[#D4AF37]"></div></div>
                ) : error ? (
                    <div className="bg-red-50 text-red-500 p-6 rounded-xl text-center border border-red-200">Could not load products. Please ensure backend is running.</div>
                ) : (
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {allProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onProductClick={onProductClick} 
                                onToggleWishlist={onToggleWishlist}
                                isWishlisted={currentUser?.wishlist.includes(product.id)}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const SearchPage = ({ searchResults, onProductClick, loading, query, onToggleWishlist, currentUser }) => {
    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-gray-50 dark:bg-black min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-black tracking-tight text-[#191970] dark:text-white mb-12">Search Results for "<span className="text-[#D4AF37]">{query}</span>"</h1>
                
                {loading ? (
                    <div className="flex justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#191970] dark:border-[#D4AF37]"></div></div>
                ) : searchResults.length > 0 ? (
                    <motion.div 
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {searchResults.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onProductClick={onProductClick} 
                                onToggleWishlist={onToggleWishlist}
                                isWishlisted={currentUser?.wishlist.includes(product.id)}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm border border-gray-100 dark:border-gray-800 mt-8">
                        <p className="text-xl font-medium text-gray-500 dark:text-gray-400">No products found matching your search.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const ProductDetailPage = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onBack }) => {
    const imageUrl = product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`;
    const [quantity, setQuantity] = useState(1);

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-white dark:bg-black min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button onClick={onBack} className="mb-8 text-sm font-bold text-[#191970] hover:text-[#D4AF37] dark:text-[#D4AF37] dark:hover:text-white flex items-center transition-colors">
                    ← Back to Shop
                </button>
                
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                        className="aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 dark:bg-gray-900 relative shadow-2xl border border-gray-100 dark:border-gray-800"
                    >
                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover object-center" />
                        
                        {onToggleWishlist && (
                            <button 
                                onClick={() => onToggleWishlist(product.id)} 
                                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm dark:bg-black/90 rounded-full p-4 text-gray-400 hover:text-red-500 shadow-xl transition-transform active:scale-95"
                            >
                                <HeartIcon className={`h-6 w-6 ${isWishlisted ? 'text-red-500 fill-red-500' : ''}`} isFilled={isWishlisted} />
                            </button>
                        )}
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 lg:mt-0 flex flex-col justify-center"
                    >
                        <p className="text-sm font-black text-[#D4AF37] uppercase tracking-widest mb-3">Premium Fragrance</p>
                        <h1 className="text-4xl sm:text-5xl font-black text-[#191970] dark:text-white mb-4">{product.name}</h1>
                        <p className="text-3xl font-bold text-[#191970] dark:text-[#D4AF37] mb-6">{formatPrice(product.price)}</p>
                        
                        <div className="flex items-center mb-8">
                            <div className="flex text-[#D4AF37]"><StarIcon className="h-5 w-5"/><StarIcon className="h-5 w-5"/><StarIcon className="h-5 w-5"/><StarIcon className="h-5 w-5"/><StarIcon className="h-5 w-5"/></div>
                            <span className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">(128 Reviews)</span>
                        </div>
                        
                        <div className="prose prose-lg text-gray-600 dark:text-gray-300 mb-10">
                            <p className="leading-relaxed">{product.description || "Experience the epitome of luxury. This fragrance is crafted from the finest ingredients to create a scent that is both captivating and enduring. Perfect for those who appreciate the finer things in life."}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 mt-auto">
                            <div className="flex items-center border-2 border-gray-200 dark:border-gray-800 rounded-xl h-14 w-32 bg-white dark:bg-black">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 text-gray-500 hover:text-[#D4AF37] h-full font-bold">-</button>
                                <span className="flex-1 text-center font-bold text-[#191970] dark:text-white">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="px-4 text-gray-500 hover:text-[#D4AF37] h-full font-bold">+</button>
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onAddToCart(product, quantity)} 
                                className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B58B22] text-[#191970] h-14 rounded-xl font-extrabold text-lg shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2"
                            >
                                <ShoppingBagIcon /> Add to Bag
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const CartPage = ({ cart, onUpdateCart, onRemoveFromCart, onNavigate }) => {
    const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);
    
    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-gray-50 dark:bg-black min-h-screen py-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-black text-[#191970] dark:text-white mb-10">Your Shopping Bag</h1>
                
                {cart.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-gray-900 rounded-3xl p-16 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="mx-auto w-24 h-24 bg-gray-50 dark:bg-black rounded-full flex items-center justify-center mb-6 text-[#D4AF37]">
                            <ShoppingBagIcon />
                        </div>
                        <h2 className="text-2xl font-bold text-[#191970] dark:text-white mb-2">Your bag is empty</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added any fragrances yet.</p>
                        <button onClick={() => onNavigate('shop')} className="bg-gradient-to-r from-[#D4AF37] to-[#B58B22] text-[#191970] px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
                            Start Shopping
                        </button>
                    </motion.div>
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
                        <section className="lg:col-span-7">
                            <ul className="space-y-6">
                                <AnimatePresence>
                                    {cart.map((item) => {
                                        const imageUrl = item.image.startsWith('http') ? item.image : `${API_BASE_URL}/${item.image}`;
                                        return (
                                            <motion.li 
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                key={item.id} 
                                                className="flex bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
                                            >
                                                <div className="flex-shrink-0 w-32 h-32 bg-gray-50 dark:bg-black rounded-xl overflow-hidden">
                                                    <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="ml-6 flex-1 flex flex-col justify-center">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-[#191970] dark:text-white">{item.name}</h3>
                                                            <p className="mt-1 text-sm font-medium text-[#D4AF37]">{formatPrice(item.price)} each</p>
                                                        </div>
                                                        <button onClick={() => onRemoveFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                                            <XIcon />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center justify-between mt-4">
                                                        <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg h-10 bg-gray-50 dark:bg-black">
                                                            <button onClick={() => onUpdateCart(item.id, Math.max(1, item.quantity - 1))} className="px-3 text-gray-500 hover:text-[#D4AF37] font-bold">-</button>
                                                            <span className="px-2 font-bold text-[#191970] dark:text-white">{item.quantity}</span>
                                                            <button onClick={() => onUpdateCart(item.id, item.quantity + 1)} className="px-3 text-gray-500 hover:text-[#D4AF37] font-bold">+</button>
                                                        </div>
                                                        <p className="font-extrabold text-lg text-[#191970] dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        );
                                    })}
                                </AnimatePresence>
                            </ul>
                        </section>
                        
                        <section className="mt-10 lg:mt-0 lg:col-span-5 sticky top-28">
                            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
                                <h2 className="text-2xl font-black text-[#191970] dark:text-white mb-6">Order Summary</h2>
                                <dl className="space-y-4 text-base text-gray-600 dark:text-gray-300">
                                    <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold text-[#191970] dark:text-white">{formatPrice(subtotal)}</dd></div>
                                    <div className="flex justify-between"><dt>Shipping</dt><dd className="text-green-600 font-bold">Free</dd></div>
                                    <div className="flex justify-between"><dt>Taxes</dt><dd className="font-medium text-gray-500">Calculated at checkout</dd></div>
                                    <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                        <dt className="text-lg font-black text-[#191970] dark:text-white">Estimated Total</dt>
                                        <dd className="text-3xl font-black text-[#D4AF37]">{formatPrice(subtotal)}</dd>
                                    </div>
                                </dl>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onNavigate('checkout')} 
                                    className="w-full mt-8 bg-gradient-to-r from-[#D4AF37] to-[#B58B22] text-[#191970] font-extrabold py-4 rounded-xl shadow-lg transition-all"
                                >
                                    Proceed to Checkout
                                </motion.button>
                                <div className="mt-6 flex justify-center items-center space-x-2 text-xs font-medium text-gray-400">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    <span>Secure Encrypted Checkout</span>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

const AuthPage = ({ onLogin, onNavigate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        onLogin({ id: 1, email, wishlist: [] }); // Mock login
        onNavigate('home');
    };

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-black text-[#191970] dark:text-white">
                        {isLogin ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="text-center mt-2 text-sm text-[#D4AF37] font-semibold">Join the OpevickyScents family</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <input type="email" required className="appearance-none relative block w-full px-4 py-4 border border-gray-200 dark:border-gray-700 dark:bg-black dark:text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <input type="password" required className="appearance-none relative block w-full px-4 py-4 border border-gray-200 dark:border-gray-700 dark:bg-black dark:text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-[#191970] bg-gradient-to-r from-[#D4AF37] to-[#B58B22] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] shadow-lg">
                            {isLogin ? 'Sign In' : 'Register'}
                        </motion.button>
                    </div>
                    
                    <div className="text-center mt-4">
                        <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-bold text-sm text-[#191970] dark:text-gray-300 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors">
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

const CheckoutPage = ({ cart, onPaymentSuccess }) => {
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '' });
    const [isPaying, setIsPaying] = useState(false);
    const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };
    
    // Handles the dynamic Paystack integration
    const handlePaystackPayment = () => {
        setIsPaying(true);
        
        const triggerPaystack = () => {
            const handler = window.PaystackPop.setup({
                key: PAYSTACK_PUBLIC_KEY,
                email: customerInfo.email,
                amount: subtotal * 100, // Paystack requires amount in kobo
                ref: (new Date()).getTime().toString(),
                metadata: {
                    name: customerInfo.name,
                    phone: customerInfo.phone,
                    address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}`,
                    cartItems: JSON.stringify(cart.map(item => ({id: item.id, name: item.name, quantity: item.quantity})))
                },
                onClose: () => {
                    console.log('Payment popup closed by user.');
                    setIsPaying(false); 
                },
                callback: (reference) => {
                    // Pass reference back to App for backend verification
                    onPaymentSuccess(reference.reference, customerInfo);
                }
            });
            handler.openIframe();
        };

        // Load Paystack Script if not already loaded dynamically
        if (typeof window.PaystackPop === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            script.onload = triggerPaystack;
            script.onerror = () => {
                alert('Could not load payment gateway. Please check your connection.');
                setIsPaying(false);
            };
            document.body.appendChild(script);
        } else {
            triggerPaystack();
        }
    };

    const isFormValid = customerInfo.email && customerInfo.name && customerInfo.phone && customerInfo.address && customerInfo.city && customerInfo.state && cart.length > 0;

    return (
        <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-gray-50 dark:bg-black min-h-screen py-16">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto lg:max-w-none">
                    <h1 className="text-3xl font-black text-[#191970] dark:text-white mb-10">Complete Your Order</h1>
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        
                        {/* Form Section */}
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
                            <div>
                                <h2 className="text-xl font-bold text-[#191970] dark:text-white">Contact Information</h2>
                                <div className="mt-6 space-y-4">
                                    <input type="text" name="name" placeholder="Full Name" onChange={handleInputChange} value={customerInfo.name} className="block w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] dark:bg-black dark:border-gray-700 dark:text-white transition-all" required />
                                    <input type="email" name="email" placeholder="Email Address" onChange={handleInputChange} value={customerInfo.email} className="block w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] dark:bg-black dark:border-gray-700 dark:text-white transition-all" required />
                                    <input type="tel" name="phone" placeholder="Phone Number" onChange={handleInputChange} value={customerInfo.phone} className="block w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] dark:bg-black dark:border-gray-700 dark:text-white transition-all" required />
                                </div>
                            </div>
                            <div className="mt-10 border-t border-gray-100 dark:border-gray-800 pt-10">
                                <h2 className="text-xl font-bold text-[#191970] dark:text-white">Shipping Information</h2>
                                <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div className="sm:col-span-2"><input type="text" name="address" placeholder="Street Address" onChange={handleInputChange} value={customerInfo.address} className="block w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] dark:bg-black dark:border-gray-700 dark:text-white transition-all" required /></div>
                                    <div><input type="text" name="city" placeholder="City" onChange={handleInputChange} value={customerInfo.city} className="block w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] dark:bg-black dark:border-gray-700 dark:text-white transition-all" required /></div>
                                    <div><input type="text" name="state" placeholder="State / Province" onChange={handleInputChange} value={customerInfo.state} className="block w-full p-4 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] dark:bg-black dark:border-gray-700 dark:text-white transition-all" required /></div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="mt-10 lg:mt-0">
                            <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 sticky top-28">
                                <h2 className="text-xl font-bold text-[#191970] dark:text-white mb-6">Order Summary</h2>
                                <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[40vh] overflow-y-auto pr-2">
                                    {cart.map((product) => {
                                        const imageUrl = product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`;
                                        return (
                                            <li key={product.id} className="flex py-6">
                                                <div className="flex-shrink-0 w-20 h-20 bg-gray-50 dark:bg-black rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                                    <img src={imageUrl} alt={product.name} className="w-full h-full object-center object-cover" />
                                                </div>
                                                <div className="ml-4 flex-1 flex flex-col justify-center">
                                                    <div className="flex justify-between text-base font-bold text-[#191970] dark:text-white">
                                                        <h3>{product.name}</h3>
                                                        <p className="ml-4 text-[#D4AF37]">{formatPrice(product.price * product.quantity)}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">Qty: {product.quantity}</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <dl className="border-t border-gray-100 dark:border-gray-800 pt-6 mt-6 space-y-4">
                                    <div className="flex items-center justify-between"><dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Subtotal</dt><dd className="text-sm font-bold text-[#191970] dark:text-white">{formatPrice(subtotal)}</dd></div>
                                    <div className="flex items-center justify-between"><dt className="text-sm font-medium text-gray-600 dark:text-gray-400">Shipping</dt><dd className="text-sm font-bold text-green-600">Free</dd></div>
                                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6">
                                        <dt className="text-lg font-black text-[#191970] dark:text-white">Total</dt>
                                        <dd className="text-2xl font-black text-[#D4AF37]">{formatPrice(subtotal)}</dd>
                                    </div>
                                </dl>
                                <div className="mt-8">
                                    <button
                                        type="button"
                                        onClick={handlePaystackPayment}
                                        className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B58B22] text-[#191970] font-extrabold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100"
                                        disabled={!isFormValid || isPaying}
                                    >
                                        {isPaying ? 'Processing...' : 'Pay Now Securely'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </motion.div>
    );
};

const OrderConfirmationPage = ({ onNavigate }) => ( 
    <motion.div variants={pageVariants} initial="initial" animate="in" exit="out" className="bg-gray-50 dark:bg-black min-h-[70vh] flex items-center justify-center py-12 px-4"> 
        <div className="max-w-xl w-full mx-auto text-center p-12 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800"> 
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
                <CheckCircleIcon /> 
            </motion.div>
            <h1 className="mt-8 text-4xl font-black text-[#191970] dark:text-white">Order Confirmed!</h1> 
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 font-medium">Thank you for your purchase. You will receive an email confirmation shortly.</p> 
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onNavigate('home')} className="mt-10 px-10 py-4 font-bold text-[#191970] bg-gradient-to-r from-[#D4AF37] to-[#B58B22] rounded-full shadow-lg">Continue Shopping</motion.button> 
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
    const [cart, setCart] = useState([]);
    const [notification, setNotification] = useState({ message: '', show: false });
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setAllProducts(data.data.products);
            } catch (e) { setError(e.message); } finally { setLoading(false); }
        };
        fetchProducts();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        const results = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
        setSearchResults(results);
        handleNavigate('search');
    };

    const showNotification = (message) => { setNotification({ message, show: true }); setTimeout(() => { setNotification({ message: '', show: false }); }, 3000); };
    
    const handleNavigate = (page) => { 
        setCurrentPage(page); 
        setSelectedProduct(null); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };
    
    const handleProductClick = (product) => { 
        setSelectedProduct(product); 
        setCurrentPage('product'); 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    };

    const handleAddToCart = (product, quantity) => { setCart(prevCart => { const existingItem = prevCart.find(item => item.id === product.id); if (existingItem) { return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item); } return [...prevCart, { ...product, quantity }]; }); showNotification(`${product.name} added to bag!`); };
    const handleUpdateCart = (productId, quantity) => { setCart(prevCart => prevCart.map(item => item.id === productId ? {...item, quantity: quantity} : item).filter(item => item.quantity > 0)); };
    const handleRemoveFromCart = (productId) => { setCart(prevCart => prevCart.filter(item => item.id !== productId)); };
    const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

    const handleToggleWishlist = (id) => {
        if(!currentUser) { handleNavigate('auth'); return; }
        const isWishlisted = currentUser.wishlist.includes(id);
        const newWishlist = isWishlisted ? currentUser.wishlist.filter(wId => wId !== id) : [...currentUser.wishlist, id];
        setCurrentUser({...currentUser, wishlist: newWishlist});
        showNotification(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    }

    // Connects Paystack checkout back to the server
    const handlePaymentSuccess = async (reference, customerDetails) => {
        try {
            const response = await fetch(`${API_URL}/payments/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    reference: reference,
                    cart: cart,
                    customer: customerDetails
                }),
            });

            const result = await response.json();
            if (result.status === 'success') {
                setCart([]); // Clear the cart
                handleNavigate('orderConfirmation');
            } else {
                throw new Error(result.message || 'Payment verification failed.');
            }
        } catch (err) {
            console.error("Verification failed:", err);
            alert(`An error occurred: ${err.message}`);
        }
    };

    const renderPage = () => {
        const pageProps = { allProducts, onProductClick: handleProductClick, onNavigate: handleNavigate, loading, error, onToggleWishlist: handleToggleWishlist, currentUser };
        
        return (
            <AnimatePresence mode="wait">
                <React.Fragment key={currentPage + (selectedProduct ? selectedProduct.id : '')}>
                    {currentPage === 'product' && selectedProduct ? (
                        <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} onBack={() => handleNavigate('shop')} onToggleWishlist={handleToggleWishlist} isWishlisted={currentUser?.wishlist.includes(selectedProduct.id)} />
                    ) : currentPage === 'home' ? (
                        <HomePage {...pageProps} />
                    ) : currentPage === 'shop' ? (
                        <ShopPage {...pageProps} />
                    ) : currentPage === 'search' ? (
                        <SearchPage searchResults={searchResults} onProductClick={handleProductClick} loading={loading} query={searchQuery} onToggleWishlist={handleToggleWishlist} currentUser={currentUser} />
                    ) : currentPage === 'cart' ? (
                        <CartPage cart={cart} onUpdateCart={handleUpdateCart} onRemoveFromCart={handleRemoveFromCart} onNavigate={handleNavigate} />
                    ) : currentPage === 'checkout' ? (
                        <CheckoutPage cart={cart} onPaymentSuccess={handlePaymentSuccess} />
                    ) : currentPage === 'orderConfirmation' ? (
                        <OrderConfirmationPage onNavigate={handleNavigate} />
                    ) : currentPage === 'auth' ? (
                        <AuthPage onLogin={setCurrentUser} onNavigate={handleNavigate} />
                    ) : (
                        <HomePage {...pageProps} />
                    )}
                </React.Fragment>
            </AnimatePresence>
        );
    };

    return (
        <ThemeProvider>
            <div className="bg-white dark:bg-black font-sans text-gray-900 dark:text-gray-100 min-h-screen flex flex-col selection:bg-[#D4AF37] selection:text-[#191970]">
                <Notification message={notification.message} show={notification.show} />
                <Header setMobileMenuOpen={setMobileMenuOpen} onNavigate={handleNavigate} cartCount={cartCount} onSearch={handleSearch} currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
                <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} onNavigate={handleNavigate} />
                <main className="flex-grow">
                    {renderPage()}
                </main>
                <Footer onNavigate={handleNavigate} />
            </div>
        </ThemeProvider>
    );
}