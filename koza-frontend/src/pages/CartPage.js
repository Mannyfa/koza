import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import CartItem from '../components/cart/CartItem';
import DeliveryPolicyModal from '../components/cart/DeliveryPolicyModal';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import { ShoppingBagIcon } from '../components/icons';
import { btnPrimary, card, pageShell } from '../styles/classNames';
import { formatPrice, getCartSubtotal } from '../utils/formatters';

const CartPage = ({ cart, onUpdateCart, onRemoveFromCart, onNavigate }) => {
    const subtotal = useMemo(() => getCartSubtotal(cart), [cart]);
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    return (
        <motion.div {...pageMotionProps} className={`${pageShell} relative`}>
            <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
                <PageHeader title="Shopping Bag" />

                {cart.length === 0 ? (
                    <EmptyState
                        icon={<ShoppingBagIcon />}
                        iconClassName="text-[#111] dark:text-white"
                        title="Your bag is empty"
                        actionLabel="Discover Fragrances"
                        onAction={() => onNavigate('shop')}
                        className=""
                    />
                ) : (
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">
                        <section className="lg:col-span-8">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-800 border-t border-gray-200 dark:border-gray-800">
                                <AnimatePresence>
                                    {cart.map((item) => (
                                        <CartItem key={item.id} item={item} onUpdateQuantity={onUpdateCart} onRemove={onRemoveFromCart} />
                                    ))}
                                </AnimatePresence>
                            </ul>
                        </section>

                        <section className="mt-16 lg:mt-0 lg:col-span-4 sticky top-32">
                            <div className={`${card} p-8`}>
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Order Summary</h2>
                                <dl className="space-y-4 text-sm text-gray-600 dark:text-gray-400 mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
                                    <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-medium text-[#111] dark:text-white">{formatPrice(subtotal)}</dd></div>
                                    <div className="flex justify-between"><dt>Shipping</dt><dd className="text-gray-500 italic">Calculated at next step</dd></div>
                                </dl>
                                <dl className="flex justify-between items-end mb-8">
                                    <dt className="text-xs font-bold uppercase tracking-widest text-[#111] dark:text-white">Estimated Total</dt>
                                    <dd className="text-2xl font-medium text-[#111] dark:text-white">{formatPrice(subtotal)}</dd>
                                </dl>
                                <button onClick={() => setShowDisclaimer(true)} className={`w-full py-4 ${btnPrimary}`}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </section>
                    </div>
                )}
            </div>

            <DeliveryPolicyModal
                open={showDisclaimer}
                onDecline={() => setShowDisclaimer(false)}
                onAccept={() => { setShowDisclaimer(false); onNavigate('checkout'); }}
            />
        </motion.div>
    );
};

export default CartPage;
