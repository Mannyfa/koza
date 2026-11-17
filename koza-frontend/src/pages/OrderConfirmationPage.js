import React from 'react';
import { motion } from 'framer-motion';
import { EASE } from '../animations/variants';
import CenteredCard from '../components/common/CenteredCard';
import { CheckCircleIcon } from '../components/icons';
import { btnPrimary } from '../styles/classNames';

const OrderConfirmationPage = ({ onNavigate }) => (
    <CenteredCard className="max-w-xl p-16 !border-[#111] dark:!border-gray-800">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8, ease: EASE }} className="mb-10">
            <CheckCircleIcon />
        </motion.div>
        <h1 className="text-3xl font-black uppercase tracking-[0.1em] text-[#111] dark:text-white mb-4">Transaction Approved</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-12">Thank you for your purchase. Your digital receipt and shipping updates will be dispatched to your email.</p>
        <button onClick={() => onNavigate('orders')} className={`w-full py-4 ${btnPrimary}`}>
            Back to Orders
        </button>
    </CenteredCard>
);

export default OrderConfirmationPage;
