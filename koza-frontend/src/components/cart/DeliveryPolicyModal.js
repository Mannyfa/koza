import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { btnPrimary } from '../../styles/classNames';

const DeliveryPolicyModal = ({ open, onDecline, onAccept }) => (
    <AnimatePresence>
        {open && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/80 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="delivery-policy-title">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-[#0A0A0A] p-12 max-w-lg w-full border border-gray-200 dark:border-gray-800 rounded-none">
                    <h3 id="delivery-policy-title" className="text-lg font-black uppercase tracking-widest text-[#111] dark:text-white mb-6 text-center border-b border-gray-200 dark:border-gray-800 pb-4">Delivery Policy</h3>
                    <p className="text-gray-500 text-sm leading-relaxed text-center mb-10">
                        Delivery within Lagos takes 24 to 48 hours, while delivery outside Lagos takes 3-5 business days. Delivery pricing varies by location; our concierge team will reach out to confirm precise logistics. Thank you for choosing Opevicky.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={onDecline} className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-gray-500 border border-gray-300 dark:border-gray-700 hover:border-[#111] dark:hover:border-white hover:text-[#111] dark:hover:text-white transition-colors rounded-none">Decline</button>
                        <button onClick={onAccept} className={`flex-1 py-4 ${btnPrimary}`}>Acknowledge</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default DeliveryPolicyModal;
