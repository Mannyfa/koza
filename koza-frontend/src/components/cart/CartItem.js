import React from 'react';
import { motion } from 'framer-motion';
import { formatPrice, getEffectivePrice, getImageUrl } from '../../utils/formatters';
import { XIcon } from '../icons';

const qtyBtn = 'px-3 text-[#111] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
    <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex py-8">
        <div className="flex-shrink-0 w-32 h-40 bg-[#F9F9F9] dark:bg-black border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden relative">
            <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="ml-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{item.bottleSize ? `Size: ${item.bottleSize}` : 'Standard Size'}</p>
                    <h3 className="text-lg font-medium text-[#111] dark:text-white">{item.name}</h3>
                </div>
                <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label={`Remove ${item.name}`}><XIcon /></button>
            </div>
            <div className="mt-auto flex items-end justify-between">
                <div className="flex items-center border border-[#111] dark:border-gray-600 h-10 w-28 bg-transparent rounded-none">
                    <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} className={qtyBtn} aria-label="Decrease quantity">-</button>
                    <span className="flex-1 text-center text-sm font-medium text-[#111] dark:text-white">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, Math.min(item.stockAmount || 1, item.quantity + 1))} disabled={item.quantity >= (item.stockAmount || 0)} className={qtyBtn} aria-label="Increase quantity">+</button>
                </div>
                <p className="font-medium text-lg text-[#111] dark:text-white">{formatPrice(getEffectivePrice(item) * item.quantity)}</p>
            </div>
        </div>
    </motion.li>
);

export default CartItem;
