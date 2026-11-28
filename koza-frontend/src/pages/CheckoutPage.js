import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import CenteredCard from '../components/common/CenteredCard';
import PageHeader from '../components/common/PageHeader';
import { validateCart } from '../services/api';
import { openPaystackPopup } from '../services/paystack';
import { btnPrimary, card, inputUnderline, pageShell } from '../styles/classNames';
import { formatPrice, getCartSubtotal, getEffectivePrice, getImageUrl } from '../utils/formatters';

const REQUIRED_FIELDS = ['name', 'email', 'phone', 'address', 'city', 'state'];

const SignInPrompt = ({ onSignIn, onGuest }) => (
    <CenteredCard>
        <h2 className="text-xl font-black uppercase tracking-[0.2em] text-[#111] dark:text-white mb-4">Authentication</h2>
        <p className="text-gray-500 text-sm mb-12">Sign in for a streamlined experience, or proceed as a guest.</p>
        <div className="space-y-4">
            <button onClick={onSignIn} className={`w-full py-4 ${btnPrimary}`}>Sign In</button>
            <button onClick={onGuest} className="w-full bg-transparent text-[#111] dark:text-white text-xs font-bold tracking-widest uppercase py-4 border border-[#111] dark:border-white hover:bg-[#111] hover:text-white dark:hover:bg-white dark:hover:text-[#111] transition-colors rounded-none">
                Guest Checkout
            </button>
        </div>
    </CenteredCard>
);

const CheckoutPage = ({ cart, onPaymentSuccess, currentUser, onNavigate }) => {
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: currentUser?.email || '', phone: '', address: '', city: '', state: '' });
    const [isPaying, setIsPaying] = useState(false);
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);

    const subtotal = useMemo(() => getCartSubtotal(cart), [cart]);

    if (!currentUser && !isGuestCheckout) {
        return <SignInPrompt onSignIn={() => onNavigate('auth')} onGuest={() => setIsGuestCheckout(true)} />;
    }

    const handleInputChange = (e) => setCustomerInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handlePayment = async () => {
        setIsPaying(true);
        try {
            // Confirm stock and prices with the server before the customer is charged
            const { total } = await validateCart(cart.map((item) => ({ id: item.id, quantity: item.quantity })));

            await openPaystackPopup({
                email: customerInfo.email,
                amount: total,
                // Paystack sends this back to the backend's webhook, which uses it to create
                // the order even if this page closes before the order is confirmed.
                metadata: {
                    name: customerInfo.name,
                    phone: customerInfo.phone,
                    address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}`,
                    customer: customerInfo,
                    cart: cart.map((item) => ({ id: item.id, quantity: item.quantity, name: item.name })),
                },
                onClose: () => setIsPaying(false),
                onSuccess: (reference) => onPaymentSuccess(reference, customerInfo),
            });
        } catch (error) {
            alert(error.message);
            setIsPaying(false);
        }
    };

    const isFormValid = REQUIRED_FIELDS.every((field) => customerInfo[field]) && cart.length > 0;

    const field = (name, placeholder, type = 'text') => (
        <input type={type} name={name} placeholder={placeholder} aria-label={placeholder} onChange={handleInputChange} value={customerInfo[name]} className={inputUnderline} required />
    );

    return (
        <motion.div {...pageMotionProps} className={pageShell}>
            <main className="max-w-screen-xl mx-auto px-6 lg:px-12">
                <PageHeader title="Checkout" className="flex items-center justify-between">
                    {!currentUser && <span className="text-[10px] tracking-widest uppercase font-bold text-gray-400 border border-gray-300 dark:border-gray-700 px-3 py-1">Guest</span>}
                </PageHeader>

                <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                    <div className="lg:col-span-7 space-y-12">
                        <section>
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white mb-6">Contact Detail</h2>
                            <div className="space-y-4">
                                {field('name', 'FULL NAME')}
                                {field('email', 'EMAIL ADDRESS', 'email')}
                                {field('phone', 'PHONE NUMBER', 'tel')}
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white mb-6">Shipping Destination</h2>
                            <div className="space-y-4">
                                {field('address', 'STREET ADDRESS')}
                                <div className="grid grid-cols-2 gap-6">
                                    {field('city', 'CITY')}
                                    {field('state', 'STATE/REGION')}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-16 lg:mt-0 lg:col-span-5">
                        <div className={`${card} p-8 sticky top-32`}>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">Manifest</h2>
                            <ul className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[40vh] overflow-y-auto pr-4 mb-8">
                                {cart.map((product) => (
                                    <li key={product.id} className="flex py-6">
                                        <div className="w-16 h-20 bg-[#F9F9F9] dark:bg-black border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden flex-shrink-0">
                                            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="ml-4 flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-sm font-medium text-[#111] dark:text-white">{product.name}</h3>
                                                <p className="text-sm font-medium text-[#111] dark:text-white">{formatPrice(getEffectivePrice(product) * product.quantity)}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 uppercase tracking-widest">Qty: {product.quantity}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between items-end pt-6 border-t border-[#111] dark:border-white mb-8">
                                <span className="text-xs font-bold uppercase tracking-widest text-[#111] dark:text-white">Total</span>
                                <span className="text-2xl font-medium text-[#111] dark:text-white">{formatPrice(subtotal)}</span>
                            </div>
                            <button type="button" onClick={handlePayment} className={`w-full py-4 ${btnPrimary}`} disabled={!isFormValid || isPaying}>
                                {isPaying ? 'Processing...' : 'Authorize Payment'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </motion.div>
    );
};

export default CheckoutPage;
