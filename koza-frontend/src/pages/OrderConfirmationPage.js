import React from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../animations/variants';
import CenteredCard from '../components/common/CenteredCard';
import { CheckCircleIcon } from '../components/icons';
import { btnPrimary, linkUnderline } from '../styles/classNames';

/** Short order number shown in emails and used for guest tracking (last 6 characters of the id). */
export const orderNumberOf = (order) => String(order?._id || order?.id || '').slice(-6).toUpperCase();

const OrderConfirmationPage = ({ onNavigate, order, isSignedIn }) => {
    const orderNumber = orderNumberOf(order);

    return (
        <CenteredCard className="max-w-xl p-16 !border-[#111] dark:!border-gray-800">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, ease: EASE }} className="mb-10">
                <CheckCircleIcon />
            </motion.div>
            <h1 className="text-3xl font-black uppercase tracking-[0.1em] text-[#111] dark:text-white mb-4">Transaction Approved</h1>
            {orderNumber && (
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">
                    Order <span className="text-[#111] dark:text-white">#{orderNumber}</span>
                </p>
            )}
            <p className="text-sm text-gray-500 leading-relaxed mb-12">
                Thank you for your purchase. Your digital receipt and shipping updates will be dispatched to your email.
                {orderNumber && ' Keep your order number to track your delivery.'}
            </p>
            {isSignedIn ? (
                <button onClick={() => onNavigate('orders')} className={`w-full py-4 ${btnPrimary}`}>Back to Orders</button>
            ) : (
                <button onClick={() => onNavigate('track')} className={`w-full py-4 ${btnPrimary}`}>Track Your Order</button>
            )}
            <button onClick={() => onNavigate('shop')} className={`mt-8 ${linkUnderline}`}>Continue Shopping</button>
        </CenteredCard>
    );
};

export default OrderConfirmationPage;
