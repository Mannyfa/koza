import React from 'react';
import { card, linkUnderline } from '../../styles/classNames';

/** Bordered placeholder for empty lists (bag, wishlist, orders). */
const EmptyState = ({ icon, iconClassName = 'text-gray-300', title, actionLabel, onAction, className = 'mt-8' }) => (
    <div className={`${card} p-24 text-center ${className}`}>
        {icon && <div className={`mx-auto w-12 h-12 flex justify-center items-center mb-6 ${iconClassName}`}>{icon}</div>}
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-4">{title}</h2>
        {actionLabel && <button onClick={onAction} className={linkUnderline}>{actionLabel}</button>}
    </div>
);

export default EmptyState;
