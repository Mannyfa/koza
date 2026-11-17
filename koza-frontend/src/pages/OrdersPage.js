import React from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import EmptyState from '../components/common/EmptyState';
import PageHeader from '../components/common/PageHeader';
import { ReceiptIcon } from '../components/icons';
import { card, pageShell } from '../styles/classNames';
import { formatDate, formatPrice, getImageUrl } from '../utils/formatters';

const OrderCard = ({ order, onNavigate }) => {
    const orderId = (order._id || order.id || '').toString();

    return (
        <div className={`${card} p-8 lg:p-12 shadow-sm`}>
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center border-b border-gray-200 dark:border-gray-800 pb-8 mb-8">
                <div className="mb-6 md:mb-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2">Order / {orderId.slice(-8)}</p>
                    <p className="text-sm text-[#111] dark:text-white">{formatDate(order.createdAt || order.date)}</p>
                </div>
                <div className="text-left md:text-right">
                    <p className="text-2xl font-medium text-[#111] dark:text-white mb-2">{formatPrice(order.totalAmount || order.total)}</p>
                    <span className="inline-block border border-[#111] dark:border-white text-[#111] dark:text-white px-3 py-1 text-[10px] tracking-widest uppercase">
                        {order.status || 'Processing'}
                    </span>
                </div>
            </div>

            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {(order.cart || []).map((item, i) => (
                    <li key={i} className="py-6 flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="w-20 h-24 bg-[#F9F9F9] dark:bg-black border border-gray-200 dark:border-gray-800 overflow-hidden flex-shrink-0 rounded-none">
                            <img src={getImageUrl(item.image)} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 tracking-widest uppercase mb-1">QTY: {item.quantity}</p>
                            <h4 className="text-base font-medium text-[#111] dark:text-white">{item.name}</h4>
                        </div>
                        <button onClick={() => onNavigate('product', { ...item, id: item.product || item.id || item._id })} className="sm:ml-auto self-start sm:self-auto text-[10px] font-bold text-[#111] dark:text-white uppercase tracking-[0.2em] border-b border-[#111] dark:border-white pb-0.5 hover:opacity-50 transition-opacity">
                            Review Item
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const OrdersPage = ({ orders, onNavigate }) => (
    <motion.div {...pageMotionProps} className={pageShell}>
        <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
            <PageHeader title="Order History" />

            {!orders || orders.length === 0 ? (
                <EmptyState
                    icon={<ReceiptIcon className="w-8 h-8" />}
                    title="No Previous Orders"
                    actionLabel="Begin Shopping"
                    onAction={() => onNavigate('shop')}
                />
            ) : (
                <div className="space-y-12">
                    {orders.map((order, i) => (
                        <OrderCard key={order._id || order.id || i} order={order} onNavigate={onNavigate} />
                    ))}
                </div>
            )}
        </div>
    </motion.div>
);

export default OrdersPage;
