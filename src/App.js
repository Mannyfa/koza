import React, { useState, useMemo, useEffect } from 'react';
import { PaystackButton } from 'react-paystack';
import heroImage from './images/hero.jpg';
import image1 from './images/image1.jpg';
import image2 from './images/image2.jpg';
import image3 from './images/image 3.jpg';

// --- API Configuration ---
const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api`;
// IMPORTANT: Replace with your actual Paystack Test Public Key from your dashboard
const PAYSTACK_PUBLIC_KEY = "pk_test_bec9f5f9e180775e22c634dc005c55510f2a86ea";


// --- Static Data (can be moved to a separate file) ---
const navLinks = [
  { name: 'Home', page: 'home' },
  { name: 'Shop', page: 'shop' },
  { name: 'Blog', page: 'blog' },
  { name: 'Contact', page: 'contact' },
  { name: 'Track Order', page: 'track' },
];

const heroSlides = [
    {
        imageUrl: heroImage,
        title: 'Luxury Hair, Unmatched Quality.',
        subtitle: 'Discover flawless wigs and bundles that empower your style. Handcrafted for perfection, delivered to your doorstep.'
    },
    {
        imageUrl: image3,
        title: 'Define Your Curls.',
        subtitle: 'Embrace volume and texture with our premium collection of curly wigs and extensions.'
    },
    {
        imageUrl: image1,
        title: 'Sleek, Straight, Stunning.',
        subtitle: 'Achieve a timeless, sophisticated look with our bone-straight virgin hair.'
    },
    {
        imageUrl: image2,
        title: 'Confidence in Every Strand.',
        subtitle: 'Invest in hair that not only looks good but feels incredible.'
    }
];


const testimonials = [
    { id: 1, name: 'Amara K.', quote: "The best quality hair I've ever bought! The delivery was so fast, and the wig is flawless. Koza Hair Plug is the real deal!", avatar: 'https://placehold.co/100x100/EAD3C3/5C3A2F?text=A' },
    { id: 2, name: 'Funke A.', quote: "I was skeptical about buying wigs online, but I'm so glad I chose Koza. The customer service was amazing, and my wig is gorgeous.", avatar: 'https://placehold.co/100x100/D4BBAA/5C3A2F?text=F' },
    { id: 3, name: 'Chioma E.', quote: "My wholesale orders always arrive on time, and the quality is consistent. My customers love the hair. Thank you, Koza!", avatar: 'https://placehold.co/100x100/C8A998/5C3A2F?text=C' },
];

const whyUsData = [
    { title: '100% Virgin Hair', description: 'We source only the highest quality, unprocessed virgin hair for all our products.', icon: 'SparklesIcon' },
    { title: 'HD Lace Experts', description: 'Our high-definition lace provides the most natural-looking, undetectable hairline.', icon: 'ScissorsIcon' },
    { title: 'Fast, Secure Delivery', description: 'Your order is processed quickly and shipped securely to your doorstep.', icon: 'TruckIcon' },
    { title: 'Exceptional Support', description: 'Our dedicated team is here to help you with any questions or concerns.', icon: 'ChatBubbleIcon' }
];

const faqData = [
    { question: "What is your return policy?", answer: "We offer a 7-day return policy for items in their original, unworn condition with all tags and packaging intact." },
    { question: "How long does shipping take within Nigeria?", answer: "Standard shipping within Lagos takes 1-2 business days. For other states, it typically takes 2-4 business days." },
    { question: "What's the difference between a frontal and a closure?", answer: "A closure covers a small portion of the head, ideal for a simple part. A frontal extends from ear to ear, offering more versatile styling options." },
];


// --- Helper Functions & Icons ---
const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
const SearchIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);
const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
const ShoppingBagIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>);
const MenuIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>);
const XIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);
const StarIcon = ({ className }) => (<svg className={className} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const PlusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>);
const MinusIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>);
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L12 12l-2.293-2.293a1 1 0 010-1.414L12 6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l2.293 2.293a1 1 0 010 1.414L12 18l-2.293-2.293a1 1 0 010-1.414L12 12zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ScissorsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a1 1 0 01-1.414 0L9 12m0 0l2.879-2.879a1 1 0 011.414 0L16 12M4 4v.01M4 8v.01M4 12v.01M4 16v.01M8 4v.01M12 4v.01M16 4v.01" /></svg>;
const TruckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 16l2 2h3.5a1 1 0 001-1.447l-2-4A1 1 0 0016.5 9H13v7z" /></svg>;
const ChatBubbleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const HeartIcon = ({ className, isFilled }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>);
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="2"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"></path></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>;
const icons = { SparklesIcon, ScissorsIcon, TruckIcon, ChatBubbleIcon };


// --- UI Components ---
const Notification = ({ message, show }) => (
    <div className={`fixed top-20 right-5 z-50 transition-transform duration-300 ${show ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-green-500 text-white font-bold rounded-lg shadow-lg p-4"><p>{message}</p></div>
    </div>
);

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
        <header className="bg-white shadow-md sticky top-0 z-40">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center"><button onClick={() => onNavigate('home')} className="text-2xl font-bold text-stone-800 tracking-wider">KOZA</button></div>
                    <div className="hidden md:block"><div className="ml-10 flex items-baseline space-x-4 bg-gray-300 rounded-full p-1">{navLinks.map((link) => (<button key={link.name} onClick={() => onNavigate(link.page)} className="text-gray-600 hover:text-stone-800 px-4 py-2 rounded-full text-sm font-medium transition-colors">{link.name}</button>))}</div></div>
                    <div className="flex items-center">
                        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
                            <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="p-2 rounded-full border border-gray-300"/>
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"><SearchIcon/></button>
                        </form>
                        <button className="p-2 text-gray-600 hover:text-stone-800 sm:hidden" onClick={() => { /* Implement mobile search toggle */ }}><SearchIcon /></button>
                        
                        <div className="relative ml-3">
                            <div>
                                <button onClick={() => currentUser ? setUserMenuOpen(!userMenuOpen) : onNavigate('auth')} className="p-2 text-gray-600 hover:text-stone-800 flex items-center rounded-full focus:outline-none">
                                    <UserIcon />
                                </button>
                            </div>
                            {currentUser && userMenuOpen && (
                                <div 
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
                                    onMouseLeave={() => setUserMenuOpen(false)}
                                >
                                    <div className="px-4 py-3">
                                        <p className="text-sm">Signed in as</p>
                                        <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
                                    </div>
                                    <div className="border-t border-gray-100"></div>
                                    <button onClick={() => { onNavigate('wishlist'); setUserMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Wishlist</button>
                                    <button onClick={() => { onLogout(); setUserMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                </div>
                            )}
                        </div>

                        <button onClick={() => onNavigate('cart')} className="relative p-2 text-gray-600 hover:text-stone-800"><ShoppingBagIcon />{cartCount > 0 && <span className="absolute top-1 right-1 text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">{cartCount}</span>}</button>
                        <div className="md:hidden ml-2"><button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-md inline-flex items-center justify-center text-gray-600 hover:text-stone-800 focus:outline-none"><MenuIcon /></button></div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

const MobileMenu = ({ mobileMenuOpen, setMobileMenuOpen, onNavigate }) => (
    <div className={`fixed inset-0 z-50 md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2"><button onClick={() => setMobileMenuOpen(false)} className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"><XIcon /></button></div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto"><nav className="mt-5 px-2 space-y-1">{navLinks.map((link) => (<button key={link.name} onClick={() => { onNavigate(link.page); setMobileMenuOpen(false); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">{link.name}</button>))} </nav></div>
        </div>
    </div>
);

const ProductCard = ({ product, onProductClick, onToggleWishlist, isWishlisted }) => {
    const imageUrl = product.image && product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`;
    
    const handleWishlistClick = (e) => {
        e.stopPropagation(); // Prevent card click when wishlist icon is clicked
        onToggleWishlist(product.id);
    };

    return (
        <div key={product.id} onClick={() => onProductClick(product)} className="group relative cursor-pointer">
            <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img src={imageUrl} alt={product.name} className="w-full h-full object-center object-cover lg:w-full lg:h-full" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/cccccc/333333?text=Image+Error'; }} />
            </div>
            {onToggleWishlist && (
                <button onClick={handleWishlistClick} className="absolute top-2 right-2 bg-white rounded-full p-2 text-gray-500 hover:text-red-500 z-10 transition-colors">
                    <HeartIcon className="h-6 w-6 text-red-500" isFilled={isWishlisted} />
                </button>
            )}
            <div className="mt-4 flex justify-between">
                <div><h3 className="text-sm text-gray-700"><span aria-hidden="true" className="absolute inset-0" />{product.name}</h3></div>
                <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
            </div>
        </div>
    );
};

const Footer = ({ onNavigate }) => (
    <footer className="bg-black border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Shop</h3>
                    <ul className="mt-4 space-y-4">
                        <li><button onClick={() => onNavigate('shop')} className="text-base text-gray-500 hover:text-white">Wigs</button></li>
                        <li><button onClick={() => onNavigate('shop')} className="text-base text-gray-500 hover:text-white">Bundles</button></li>
                        <li><button onClick={() => onNavigate('shop')} className="text-base text-gray-500 hover:text-white">Closures & Frontals</button></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">About</h3>
                    <ul className="mt-4 space-y-4">
                        <li><a href="#!" className="text-base text-gray-500 hover:text-white">Our Story</a></li>
                        <li><a href="#!" className="text-base text-gray-500 hover:text-white">Reviews</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                    <ul className="mt-4 space-y-4">
                        <li><button onClick={() => onNavigate('contact')} className="text-base text-gray-500 hover:text-white">Contact Us</button></li>
                        <li><button onClick={() => onNavigate('faq')} className="text-base text-gray-500 hover:text-white">FAQ</button></li>
                        <li><a href="#!" className="text-base text-gray-500 hover:text-white">Shipping & Returns</a></li>
                    </ul>
                </div>
                 <div className="col-span-2 md:col-span-1">
                    <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect With Us</h3>
                    <p className="mt-4 text-base text-gray-500">Follow us on social media for the latest updates and styles.</p>
                    <div className="mt-4 flex space-x-6">
                        <a href="https://instagram.com/koza_hair_plug" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500"><span className="sr-only">Instagram</span><InstagramIcon /></a>
                        <a href="#!" className="text-gray-400 hover:text-gray-500"><span className="sr-only">Twitter</span><TwitterIcon /></a>
                        <a href="mailto:support@kozahair.com" className="text-gray-400 hover:text-gray-500"><span className="sr-only">Email</span><MailIcon /></a>
                    </div>
                </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Koza Hair Plug. All rights reserved.</p>
            </div>
        </div>
    </footer>
);

// --- Standalone Page Section Components ---

const HeroSection = ({ onNavigate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-screen bg-gray-900">
            {/* Image Slides */}
            {heroSlides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img
                        className="w-full h-full object-cover"
                        src={slide.imageUrl}
                        alt={`Slide ${index + 1}`}
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1920x1080/000000/FFFFFF?text=Image+Not+Found'; }}
                    />
                    <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true"></div>
                </div>
            ))}

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center items-center max-w-4xl mx-auto px-4 text-center sm:px-6 lg:px-8">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                    {heroSlides[currentIndex].title}
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300">
                    {heroSlides[currentIndex].subtitle}
                </p>
                <div className="mt-10">
                    <button
                        onClick={() => onNavigate('shop')}
                        className="inline-block bg-white border border-transparent rounded-md py-3 px-8 text-base font-medium text-stone-800 hover:bg-gray-200 transition-colors"
                    >
                        Shop The Collection
                    </button>
                </div>
            </div>
        </div>
    );
};

const FeaturedProducts = ({ allProducts, onProductClick, onNavigate, loading, error, onToggleWishlist, currentUser }) => (
    <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 text-center">Featured Collection</h2>
            <p className="text-center mt-2 text-gray-500">Our most loved styles, chosen by you.</p>
            {loading && <p className="text-center mt-8">Loading products...</p>}
            {error && <p className="text-center mt-8 text-red-500">Could not load products. Please try again later.</p>}
            {!loading && !error && (
                <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    {allProducts.slice(0, 4).map((product) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onProductClick={onProductClick} 
                            onToggleWishlist={onToggleWishlist}
                            isWishlisted={currentUser?.wishlist.includes(product.id)}
                        />
                    ))}
                </div>
            )}
            <div className="mt-12 text-center"><button onClick={() => onNavigate('shop')} className="inline-block bg-stone-800 text-white font-semibold py-3 px-8 rounded-md hover:bg-stone-700 transition-colors">Shop All Products</button></div>
        </div>
    </div>
);

const Testimonials = () => (
    <div className="bg-stone-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto lg:max-w-none">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 text-center">What Our Customers Say</h2>
                <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="group block">
                            <div className="flex items-center mb-4">
                                <img className="h-12 w-12 rounded-full object-cover" src={testimonial.avatar} alt={testimonial.name} />
                                <div className="ml-4"><h3 className="text-lg font-medium text-gray-900">{testimonial.name}</h3></div>
                            </div>
                            <p className="text-base text-gray-600">"{testimonial.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const WhyUsSection = () => (
    <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-base font-semibold text-stone-600 tracking-wide uppercase">The Koza Difference</h2>
                <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Why Choose Us?</p>
            </div>
            <div className="mt-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {whyUsData.map((feature) => {
                        const IconComponent = icons[feature.icon];
                        return (
                            <div key={feature.title} className="text-center">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-stone-100 text-stone-600 mx-auto">
                                    <IconComponent />
                                </div>
                                <h3 className="mt-5 text-lg font-medium text-gray-900">{feature.title}</h3>
                                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
);

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const toggleFaq = (index) => { setOpenIndex(openIndex === index ? null : index); };
    return (
        <div className="bg-stone-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">Frequently Asked Questions</h2>
                    <div className="mt-8 space-y-4">
                        {faqData.map((faq, index) => (
                            <div key={index} className="border-b border-gray-200 py-6">
                                <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center text-left text-gray-900">
                                    <span className="font-medium">{faq.question}</span>
                                    <span className="ml-6 h-7 flex items-center">{openIndex === index ? <MinusIcon /> : <PlusIcon />}</span>
                                </button>
                                {openIndex === index && (<div className="mt-4 pr-12 text-base text-gray-500">{faq.answer}</div>)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Page Components ---

const HomePage = ({ allProducts, onProductClick, onNavigate, loading, error, onToggleWishlist, currentUser }) => {
    return (
        <>
            <HeroSection onNavigate={onNavigate} />
            <FeaturedProducts allProducts={allProducts} onProductClick={onProductClick} onNavigate={onNavigate} loading={loading} error={error} onToggleWishlist={onToggleWishlist} currentUser={currentUser} />
            <WhyUsSection />
            <Testimonials />
            <FaqSection />
        </>
    );
};

const ShopPage = ({ allProducts, onProductClick, loading, error, onToggleWishlist, currentUser }) => {
    if (loading) return <p className="text-center py-16">Loading products...</p>;
    if (error) return <p className="text-center py-16 text-red-500">Could not load products. Please try again later.</p>;

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">All Products</h1>
                <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                    {allProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onProductClick={onProductClick} 
                            onToggleWishlist={onToggleWishlist}
                            isWishlisted={currentUser?.wishlist.includes(product.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const SearchPage = ({ searchResults, onProductClick, loading, query, onToggleWishlist, currentUser }) => {
    if (loading) return <p className="text-center py-16">Searching...</p>;
    
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Search Results for "{query}"</h1>
                {searchResults.length > 0 ? (
                    <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                        {searchResults.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onProductClick={onProductClick} 
                                onToggleWishlist={onToggleWishlist}
                                isWishlisted={currentUser?.wishlist.includes(product.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="mt-8 text-center text-gray-500">No products found matching your search.</p>
                )}
            </div>
        </div>
    );
};


const BlogPage = ({ onPostClick }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${API_URL}/blog`);
                const data = await response.json();
                setPosts(data.data.posts);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <p className="text-center py-16">Loading articles...</p>;

    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-center text-gray-900">The Koza Blog</h1>
                <div className="mt-12 max-w-lg mx-auto grid gap-8 lg:grid-cols-2 lg:max-w-none">
                    {posts.map(post => (
                        <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                            <div className="flex-shrink-0">
                                <img className="h-48 w-full object-cover" src={post.imageUrl} alt={post.title} />
                            </div>
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-stone-600">{post.author}</p>
                                    <button onClick={() => onPostClick(post.slug)} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900 text-left">{post.title}</p>
                                        <p className="mt-3 text-base text-gray-500 text-left">{post.summary}</p>
                                    </button>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="text-sm text-gray-500">
                                        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};



const ProductDetailPage = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
    const imageUrl = product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`;
    return (
        <div className="bg-white">
            <div className="pt-6">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
                    <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden"><img src={imageUrl} alt={product.name} className="w-full h-full object-center object-cover" /></div>
                    <div className="mt-4 lg:mt-0">
                        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1>
                        <div className="mt-3"><p className="text-3xl text-gray-900">{formatPrice(product.price)}</p></div>
                        <div className="mt-3"><div className="flex items-center"><div className="flex items-center">{[0, 1, 2, 3, 4].map((rating) => <StarIcon key={rating} className="text-yellow-400 h-5 w-5 flex-shrink-0" />)}</div></div></div>
                        <div className="mt-6"><div className="text-base text-gray-700 space-y-6"><p>{product.description || "No description available."}</p></div></div>
                        <form className="mt-6">
                            <div className="mt-10 flex space-x-3">
                                <button type="button" onClick={() => onAddToCart(product, 1)} className="flex-1 bg-stone-800 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-stone-700">Add to bag</button>
                                {onToggleWishlist && (
                                    <button type="button" onClick={() => onToggleWishlist(product.id)} className="p-3 border border-gray-300 rounded-md text-gray-500 hover:text-red-500 hover:bg-gray-50">
                                        <HeartIcon className="h-6 w-6 text-red-500" isFilled={isWishlisted} />
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CartPage = ({ cart, onUpdateCart, onRemoveFromCart, onNavigate }) => {
    const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);
    return (
        <div className="bg-white">
            <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
                <div className="mt-12">
                    {cart.length === 0 ? (
                        <div className="text-center">
                            <p className="text-lg text-gray-500">Your cart is empty.</p>
                            <button onClick={() => onNavigate('shop')} className="mt-4 inline-block bg-stone-800 text-white font-semibold py-3 px-8 rounded-md hover:bg-stone-700">Continue Shopping</button>
                        </div>
                    ) : (
                        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                            <section className="lg:col-span-7">
                                <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
                                    {cart.map((item) => {
                                        const imageUrl = item.image.startsWith('http') ? item.image : `${API_BASE_URL}/${item.image}`;
                                        return (
                                            <li key={item.id} className="flex py-6">
                                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden"><img src={imageUrl} alt={item.name} className="w-full h-full object-center object-cover" /></div>
                                                <div className="ml-4 flex-1 flex flex-col">
                                                    <div><div className="flex justify-between text-base font-medium text-gray-900"><h3>{item.name}</h3><p className="ml-4">{formatPrice(item.price * item.quantity)}</p></div></div>
                                                    <div className="flex-1 flex items-end justify-between text-sm">
                                                        <input type="number" value={item.quantity} onChange={(e) => onUpdateCart(item.id, parseInt(e.target.value))} className="w-16 rounded-md border-gray-300" min="1" />
                                                        <div className="flex"><button type="button" onClick={() => onRemoveFromCart(item.id)} className="font-medium text-stone-600 hover:text-stone-500">Remove</button></div>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                            <section className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
                                <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                                <dl className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between"><dt className="text-sm text-gray-600">Subtotal</dt><dd className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</dd></div>
                                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between"><dt className="text-base font-medium text-gray-900">Order total</dt><dd className="text-base font-medium text-gray-900">{formatPrice(subtotal)}</dd></div>
                                </dl>
                                <div className="mt-6"><button onClick={() => onNavigate('checkout')} className="w-full bg-stone-800 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-stone-700">Checkout</button></div>
                            </section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const AuthPage = ({ onLogin, onNavigate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/login' : '/register';
        try {
            const response = await fetch(`${API_URL}/users${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            if (isLogin) {
                onLogin(data.user);
                onNavigate('home');
            } else {
                alert('Registration successful! Please log in.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto py-16 px-4">
            <h1 className="text-3xl font-extrabold text-center text-gray-900">{isLogin ? 'Login' : 'Create Account'}</h1>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full p-3 border border-gray-300 rounded-md" required />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border border-gray-300 rounded-md" required />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button type="submit" className="w-full bg-stone-800 text-white py-3 rounded-md hover:bg-stone-700">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <p className="mt-4 text-center">
                <button onClick={() => setIsLogin(!isLogin)} className="text-stone-600 hover:underline">
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>
            </p>
        </div>
    );
};

const WishlistPage = ({ allProducts, onProductClick, onToggleWishlist, currentUser }) => {
    if (!currentUser) return <p className="text-center py-16">Please log in to see your wishlist.</p>;
    
    const wishlistedProducts = allProducts.filter(p => currentUser.wishlist.includes(p.id));

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Wishlist</h1>
                {wishlistedProducts.length > 0 ? (
                    <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6">
                        {wishlistedProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onProductClick={onProductClick} 
                                onToggleWishlist={onToggleWishlist}
                                isWishlisted={true} 
                            />
                        ))}
                    </div>
                ) : (
                    <p className="mt-8 text-center text-gray-500">Your wishlist is empty.</p>
                )}
            </div>
        </div>
    );
};

const CheckoutPage = ({ cart, onPaymentSuccess }) => {
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '' });
    const subtotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomerInfo(prev => ({ ...prev, [name]: value }));
    };

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: customerInfo.email,
        amount: subtotal * 100, // Amount in kobo (Paystack requires this)
        publicKey: PAYSTACK_PUBLIC_KEY,
        metadata: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            cartItems: cart.map(item => ({id: item.id, name: item.name, quantity: item.quantity}))
        }
    };
    
    const handlePaystackSuccess = (reference) => {
        onPaymentSuccess(reference.reference);
    };

    const handlePaystackClose = () => {
        console.log('Payment popup closed by user.');
    };

    return (
        <div className="bg-gray-50">
            <main className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto lg:max-w-none">
                    <h1 className="sr-only">Checkout</h1>
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        <div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                                <div className="mt-4 space-y-4">
                                    <input type="text" name="name" placeholder="Full Name" onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                                    <input type="email" name="email" placeholder="Email address" onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                                    <input type="tel" name="phone" placeholder="Phone" onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required />
                                </div>
                            </div>
                            <div className="mt-10 border-t border-gray-200 pt-10">
                                <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div className="sm:col-span-2"><input type="text" name="address" placeholder="Address" className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required /></div>
                                    <div><input type="text" name="city" placeholder="City" className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required /></div>
                                    <div><input type="text" name="state" placeholder="State / Province" className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm" required /></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
                            <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                                <ul className="divide-y divide-gray-200">{cart.map((product) => (<li key={product.id} className="flex py-6 px-4 sm:px-6"><div className="flex-shrink-0"><img src={product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`} alt={product.name} className="w-20 rounded-md" /></div><div className="ml-6 flex-1 flex flex-col"><div className="flex"><div className="min-w-0 flex-1"><h4 className="text-sm"><a href="#!" className="font-medium text-gray-700 hover:text-gray-800">{product.name}</a></h4><p className="mt-1 text-sm text-gray-500">Qty: {product.quantity}</p></div></div><div className="flex-1 pt-2 flex items-end justify-between"><p className="mt-1 text-sm font-medium text-gray-900">{formatPrice(product.price * product.quantity)}</p></div></div></li>))}</ul>
                                <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6"><div className="flex items-center justify-between"><dt className="text-sm">Subtotal</dt><dd className="text-sm font-medium text-gray-900">{formatPrice(subtotal)}</dd></div><div className="flex items-center justify-between"><dt className="text-sm">Shipping</dt><dd className="text-sm font-medium text-gray-900">{formatPrice(0)}</dd></div><div className="flex items-center justify-between border-t border-gray-200 pt-6"><dt className="text-base font-medium">Total</dt><dd className="text-base font-medium text-gray-900">{formatPrice(subtotal)}</dd></div></dl>
                                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                    <PaystackButton
                                        {...paystackConfig}
                                        text="Pay Now"
                                        onSuccess={handlePaystackSuccess}
                                        onClose={handlePaystackClose}
                                        className="w-full bg-stone-800 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-stone-700 disabled:bg-gray-400"
                                        disabled={!customerInfo.email || !customerInfo.name || cart.length === 0}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const TrackOrderPage = () => {
    const [trackingNumber, setTrackingNumber] = useState('');
    const [status, setStatus] = useState(null);

    const handleTrack = (e) => {
        e.preventDefault();
        // Placeholder logic
        if (trackingNumber) {
            setStatus(`Order ${trackingNumber} is currently in transit.`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-16 px-4">
            <h1 className="text-3xl font-extrabold text-center text-gray-900">Track Your Order</h1>
            <p className="mt-4 text-center text-gray-500">Enter your tracking number below to see the status of your delivery.</p>
            <form onSubmit={handleTrack} className="mt-8 flex flex-col items-center">
                <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                    className="w-full max-w-md p-3 border border-gray-300 rounded-md"
                />
                <button type="submit" className="mt-4 w-full max-w-md bg-stone-800 text-white py-3 rounded-md hover:bg-stone-700">
                    Track
                </button>
            </form>
            {status && (
                <div className="mt-8 p-4 bg-gray-100 rounded-md text-center">
                    <p>{status}</p>
                </div>
            )}
        </div>
    );
};

const ContactPage = () => (
    <div className="max-w-2xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Contact Us</h1>
        <p className="mt-4 text-center text-gray-500">Have a question? We'd love to hear from you. Fill out the form below or email us directly.</p>
        <form className="mt-8 space-y-6">
            <input type="text" placeholder="Your Name" className="w-full p-3 border border-gray-300 rounded-md" />
            <input type="email" placeholder="Your Email" className="w-full p-3 border border-gray-300 rounded-md" />
            <textarea placeholder="Your Message" rows="5" className="w-full p-3 border border-gray-300 rounded-md"></textarea>
            <button type="submit" className="w-full bg-stone-800 text-white py-3 rounded-md hover:bg-stone-700">
                Send Message
            </button>
        </form>
    </div>
);

const OrderConfirmationPage = ({ onNavigate }) => (
    <div className="bg-white">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
            <CheckCircleIcon />
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">Order confirmed!</h1>
            <p className="mt-4 text-lg text-gray-500">Thank you for your purchase. You will receive an email confirmation shortly.</p>
            <button onClick={() => onNavigate('home')} className="mt-8 w-full inline-flex items-center justify-center bg-stone-800 py-3 px-5 text-base font-medium text-white rounded-md hover:bg-stone-700 sm:w-auto">Continue Shopping</button>
        </div>
    </div>
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

    const handleLogin = (user) => {
        setCurrentUser(user);
        showNotification('Welcome back!');
    };
    
    const handleLogout = () => {
        setCurrentUser(null);
        showNotification('You have been logged out.');
    };

    const handleToggleWishlist = async (productId) => {
        if (!currentUser) {
            showNotification('Please log in to use the wishlist.');
            return;
        }
        
        const isWishlisted = currentUser.wishlist.includes(productId);
        const endpoint = isWishlisted ? `/${currentUser.id}/wishlist/${productId}` : `/${currentUser.id}/wishlist`;
        const method = isWishlisted ? 'DELETE' : 'POST';

        try {
            const response = await fetch(`${API_URL}/users${endpoint}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: isWishlisted ? null : JSON.stringify({ productId }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            setCurrentUser(prev => ({ ...prev, wishlist: data.wishlist }));
            showNotification(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        } catch (err) {
            showNotification(`Error: ${err.message}`);
        }
    };


    const handlePaymentSuccess = async (reference) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/payments/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reference }),
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
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => { setSearchQuery(query); const results = allProducts.filter(p => p.name.toLowerCase().includes(query.toLowerCase())); setSearchResults(results); handleNavigate('search'); };
    const showNotification = (message) => { setNotification({ message, show: true }); setTimeout(() => { setNotification({ message: '', show: false }); }, 3000); };
    const handleNavigate = (page) => { setCurrentPage(page); setSelectedProduct(null); window.scrollTo(0, 0); };
    const handleProductClick = (product) => { setSelectedProduct(product); setCurrentPage('product'); window.scrollTo(0, 0); };
    const handlePostClick = async (slug) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/blog/${slug}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            // setSelectedPost(data.data.post);
            setCurrentPage('blogPost');
            window.scrollTo(0, 0);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (product, quantity) => { setCart(prevCart => { const existingItem = prevCart.find(item => item.id === product.id); if (existingItem) { return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item); } return [...prevCart, { ...product, quantity }]; }); showNotification(`${product.name} added to cart!`); };
    const handleUpdateCart = (productId, quantity) => { setCart(prevCart => prevCart.map(item => item.id === productId ? {...item, quantity: quantity} : item).filter(item => item.quantity > 0)); };
    const handleRemoveFromCart = (productId) => { setCart(prevCart => prevCart.filter(item => item.id !== productId)); };
    const cartCount = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart]);

    const renderPage = () => {
        const isWishlisted = (productId) => currentUser?.wishlist.includes(productId);
        const pageProps = { allProducts, onProductClick: handleProductClick, onNavigate: handleNavigate, loading, error, onToggleWishlist: handleToggleWishlist, currentUser };
        
        if (currentPage === 'product' && selectedProduct) { 
            return <ProductDetailPage 
                product={selectedProduct} 
                onAddToCart={handleAddToCart} 
                onToggleWishlist={handleToggleWishlist}
                isWishlisted={isWishlisted(selectedProduct.id)}
            />; 
        }
        switch (currentPage) {
            case 'home': return <HomePage {...pageProps} />;
            case 'shop': return <ShopPage {...pageProps} />;
            case 'search': return <SearchPage searchResults={searchResults} onProductClick={handleProductClick} loading={loading} query={searchQuery} onToggleWishlist={handleToggleWishlist} currentUser={currentUser} />;
            case 'cart': return <CartPage cart={cart} onUpdateCart={handleUpdateCart} onRemoveFromCart={handleRemoveFromCart} onNavigate={handleNavigate} />;
            case 'checkout': return <CheckoutPage cart={cart} onPaymentSuccess={handlePaymentSuccess} />;
            case 'orderConfirmation': return <OrderConfirmationPage onNavigate={handleNavigate} />;
            case 'track': return <TrackOrderPage />;
            case 'contact': return <ContactPage />;
            case 'faq': return <FaqSection />;
            case 'auth': return <AuthPage onLogin={handleLogin} onNavigate={handleNavigate} />;
            case 'wishlist': return <WishlistPage allProducts={allProducts} onProductClick={handleProductClick} onToggleWishlist={handleToggleWishlist} currentUser={currentUser} />;
            case 'blog': return <BlogPage onPostClick={handlePostClick} />;
          default: return <HomePage {...pageProps} />;
        }
    };

    return (
        <div className="bg-white font-sans">
            <Notification message={notification.message} show={notification.show} />
            <Header setMobileMenuOpen={setMobileMenuOpen} onNavigate={handleNavigate} cartCount={cartCount} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout} />
            <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} onNavigate={handleNavigate} />
            <main>{renderPage()}</main>
            <Footer onNavigate={handleNavigate} />
        </div>
    );
}
