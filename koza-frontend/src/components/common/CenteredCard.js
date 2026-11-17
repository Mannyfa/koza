import React from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../../animations/variants';
import { card } from '../../styles/classNames';

/** Full-height page with a single centred card (sign-in prompts, confirmations). */
const CenteredCard = ({ children, className = 'max-w-md p-12' }) => (
    <motion.div {...pageMotionProps} className="bg-[#FAFAFA] dark:bg-[#0A0A0A] min-h-screen py-32 flex items-center justify-center px-6">
        <div className={`w-full text-center ${card} ${className}`}>
            {children}
        </div>
    </motion.div>
);

export default CenteredCard;
