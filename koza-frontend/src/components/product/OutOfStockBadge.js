import React from 'react';

/** Stark "Out of Stock" label laid over a product image. */
const OutOfStockBadge = ({ className = 'top-4 left-4' }) => (
    <div className={`absolute ${className} z-10 bg-[#111] dark:bg-white text-white dark:text-[#111] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5`}>
        Out of Stock
    </div>
);

export default OutOfStockBadge;
