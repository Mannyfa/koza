import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { ThemeProvider } from './context/ThemeContext';
import Notification from './components/common/Notification';
import Header from './components/layout/Header';
import MobileMenu from './components/layout/MobileMenu';
import Footer from './components/layout/Footer';
import {
    AboutPage, AuthPage, CartPage, CheckoutPage, HomePage, LearnPage, OrderConfirmationPage,
    OrdersPage, ProductDetailPage, SearchPage, ShopPage, WishlistPage,
} from './pages';

import useAuth from './hooks/useAuth';
import useCart from './hooks/useCart';
import useNotification from './hooks/useNotification';
import useRouter from './hooks/useRouter';
import * as api from './services/api';

export default function App() {
    // --- Data ---
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // --- App state hooks ---
    const { currentPage, selectedProduct, setSelectedProduct, navigate } = useRouter(allProducts);
    const { currentUser, login, logout, updateUser } = useAuth();
    const { cart, cartCount, addToCart, updateQuantity, removeFromCart, clearCart, syncWithProducts } = useCart();
    const { notification, showNotification } = useNotification();

    useEffect(() => {
        api.fetchProducts()
            .then(setAllProducts)
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Keep saved bag prices/stock in line with the live catalogue
    useEffect(() => {
        const removed = syncWithProducts(allProducts);
        if (removed > 0) showNotification(`${removed} unavailable item${removed > 1 ? 's' : ''} removed from your bag`);
    }, [allProducts, syncWithProducts, showNotification]);

    useEffect(() => {
        if (!currentUser) {
            setOrders([]);
            return;
        }
        api.fetchMyOrders()
            .then(setOrders)
            .catch((e) => console.error('Error fetching orders:', e));
    }, [currentUser]);

    // --- Handlers ---
    const handleSearch = (query) => {
        setSearchQuery(query);
        const q = query.toLowerCase();
        setSearchResults(allProducts.filter((p) => p.name.toLowerCase().includes(q)));
        navigate('search');
    };

    const handleProductClick = (product) => navigate('product', product);

    const handleAddToCart = (product, quantity) => {
        addToCart(product, quantity);
        showNotification('Item Reserved');
    };

    const handleToggleWishlist = async (id) => {
        if (!currentUser) {
            navigate('auth');
            return;
        }
        const currentWishlist = currentUser.wishlist || [];
        const isWishlisted = currentWishlist.includes(id);
        const newWishlist = isWishlisted ? currentWishlist.filter((wId) => wId !== id) : [...currentWishlist, id];

        updateUser({ ...currentUser, wishlist: newWishlist });
        showNotification(isWishlisted ? 'Removed from collection' : 'Saved to collection');

        try {
            await api.updateWishlist(newWishlist);
        } catch (e) {
            console.error('Wishlist sync failed:', e);
        }
    };

    const handleSubmitReview = async (productId, review) => {
        try {
            const data = await api.submitReview(productId, review);
            setAllProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, reviews: data.reviews } : p)));
            setSelectedProduct((prev) => (prev ? { ...prev, reviews: data.reviews } : prev));
            showNotification('Feedback Recorded');
        } catch (e) {
            alert(e.message);
        }
    };

    const handlePaymentSuccess = async (reference, customerDetails) => {
        try {
            // The server re-prices every item from the database; only ids and quantities matter.
            const orderLines = cart.map((item) => ({ id: item.id, quantity: item.quantity }));
            const data = await api.verifyPayment(reference, orderLines, customerDetails);
            setOrders((prev) => [data.order, ...prev]);
            clearCart();
            navigate('orderConfirmation');
        } catch (e) {
            console.error('Payment verification failed:', e);
            alert(`Process interrupted: ${e.message}`);
        }
    };

    const handleLogout = () => {
        logout();
        setOrders([]);
        navigate('home');
    };

    // --- Routing ---
    const renderPage = () => {
        const productListProps = {
            allProducts, loading, error, currentUser,
            onProductClick: handleProductClick,
            onNavigate: navigate,
            onToggleWishlist: handleToggleWishlist,
        };

        if (currentPage === 'product' && selectedProduct) {
            return (
                <ProductDetailPage
                    product={selectedProduct}
                    onAddToCart={handleAddToCart}
                    onBack={() => navigate('shop')}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={currentUser?.wishlist?.includes(selectedProduct.id)}
                    orders={orders}
                    onSubmitReview={handleSubmitReview}
                />
            );
        }

        switch (currentPage) {
            case 'learn': return <LearnPage />;
            case 'about': return <AboutPage />;
            case 'shop': return <ShopPage {...productListProps} />;
            case 'search':
                return <SearchPage searchResults={searchResults} query={searchQuery} loading={loading} currentUser={currentUser} onProductClick={handleProductClick} onToggleWishlist={handleToggleWishlist} />;
            case 'cart':
                return <CartPage cart={cart} onUpdateCart={updateQuantity} onRemoveFromCart={removeFromCart} onNavigate={navigate} />;
            case 'checkout':
                return <CheckoutPage cart={cart} onPaymentSuccess={handlePaymentSuccess} currentUser={currentUser} onNavigate={navigate} />;
            case 'orderConfirmation': return <OrderConfirmationPage onNavigate={navigate} />;
            case 'orders': return <OrdersPage orders={orders} onNavigate={navigate} />;
            case 'wishlist':
                return <WishlistPage allProducts={allProducts} currentUser={currentUser} onNavigate={navigate} onProductClick={handleProductClick} onToggleWishlist={handleToggleWishlist} />;
            case 'auth': return <AuthPage onLogin={login} onNavigate={navigate} />;
            case 'home':
            default:
                return <HomePage {...productListProps} />;
        }
    };

    return (
        <ThemeProvider>
            <div className="bg-[#FAFAFA] dark:bg-[#0A0A0A] font-sans text-[#111] dark:text-white min-h-screen flex flex-col selection:bg-[#111] selection:text-white dark:selection:bg-white dark:selection:text-[#111]">
                <Notification message={notification.message} show={notification.show} />
                <Header setMobileMenuOpen={setMobileMenuOpen} onNavigate={navigate} cartCount={cartCount} onSearch={handleSearch} currentUser={currentUser} onLogout={handleLogout} />
                <MobileMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} onNavigate={navigate} />
                <main className="flex-grow">
                    <AnimatePresence mode="wait">
                        <React.Fragment key={currentPage + (selectedProduct ? selectedProduct.id : '')}>
                            {renderPage()}
                        </React.Fragment>
                    </AnimatePresence>
                </main>
                <Footer onNavigate={navigate} />
            </div>
        </ThemeProvider>
    );
}
