import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon } from '../icons';

const Notification = ({ message, show }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
                className="fixed top-24 right-5 z-50"
                role="status"
                aria-live="polite"
            >
                <div className="bg-[#111] dark:bg-white text-white dark:text-[#111] font-medium text-xs tracking-widest uppercase p-4 flex items-center gap-4 shadow-lg border border-gray-800 dark:border-gray-200">
                    <SparklesIcon />
                    <p>{message}</p>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default Notification;
