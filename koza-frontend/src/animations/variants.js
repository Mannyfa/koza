// --- Elegant Animation Variants (framer-motion) ---
export const EASE = [0.25, 0.1, 0.25, 1];

export const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
    out: { opacity: 0, transition: { duration: 0.5, ease: EASE } },
};

export const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Spread onto a motion.div to get the standard page enter/exit transition. */
export const pageMotionProps = {
    variants: pageVariants,
    initial: 'initial',
    animate: 'in',
    exit: 'out',
};
