import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import PageHeader from '../components/common/PageHeader';
import { trackOrder } from '../services/api';
import { btnPrimary, card, inputUnderline, linkUnderline, pageShell } from '../styles/classNames';
import { formatDate, formatPrice, getImageUrl } from '../utils/formatters';

const STEPS = ['Processing', 'Shipped', 'Delivered'];
const STEP_TEXT = {
    Processing: 'We have received your order and are preparing it.',
    Shipped: 'Your order is on its way to you.',
    Delivered: 'Your order has been delivered. Enjoy!',
    Cancelled: 'This order was cancelled. If you paid, our team will contact you about a refund.',
};

const StatusTimeline = ({ status }) => {
    if (status === 'Cancelled') {
        return <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 border border-red-300 p-4">Cancelled</p>;
    }
    const current = Math.max(0, STEPS.indexOf(status));
    return (
        <ol className="grid grid-cols-3 gap-2" aria-label="Order progress">
            {STEPS.map((step, i) => {
                const done = i <= current;
                return (
                    <li key={step} aria-current={i === current ? 'step' : undefined}>
                        <div className={`h-1 mb-3 ${done ? 'bg-[#111] dark:bg-white' : 'bg-gray-200 dark:bg-gray-800'}`} />
                        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${done ? 'text-[#111] dark:text-white' : 'text-gray-400'}`}>{step}</p>
                    </li>
                );
            })}
        </ol>
    );
};

const TrackOrderPage = ({ onNavigate, initialEmail = '', initialOrderNumber = '' }) => {
    const [email, setEmail] = useState(initialEmail);
    const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);
        try {
            const data = await trackOrder(email.trim(), orderNumber.trim());
            setOrder(data.order);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div {...pageMotionProps} className={pageShell}>
            <div className="max-w-screen-md mx-auto px-6 lg:px-12">
                <PageHeader title="Track Your Order" subtitle="No account needed." size="lg" />

                <form onSubmit={handleSubmit} className={`${card} p-8 sm:p-10 mb-12`}>
                    <p className="text-sm text-gray-500 leading-relaxed mb-8">
                        Enter the email you used at checkout and the order number from your confirmation email (for example <span className="font-bold text-[#111] dark:text-white">#A1B2C3</span>).
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                        <input type="email" required placeholder="EMAIL ADDRESS" aria-label="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputUnderline} />
                        <input required minLength={6} placeholder="ORDER NUMBER" aria-label="Order number" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} className={`${inputUnderline} uppercase`} />
                    </div>
                    {error && <p role="alert" className="text-xs tracking-widest uppercase text-red-500 border border-red-300 p-4 mb-6">{error}</p>}
                    <button type="submit" disabled={loading} className={`w-full sm:w-auto px-12 py-4 ${btnPrimary}`}>
                        {loading ? 'Searching...' : 'Track Order'}
                    </button>
                </form>

                {order && (
                    <section className={`${card} p-8 sm:p-10`} aria-live="polite">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-gray-200 dark:border-gray-800 pb-6 mb-8">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2">Order #{order.orderNumber}</p>
                                <p className="text-sm text-[#111] dark:text-white">Placed {formatDate(order.date)}</p>
                                {(order.city || order.state) && <p className="text-xs text-gray-500 mt-1">Delivering to {[order.city, order.state].filter(Boolean).join(', ')}</p>}
                            </div>
                            <p className="text-2xl font-medium text-[#111] dark:text-white">{formatPrice(order.total)}</p>
                        </div>

                        <StatusTimeline status={order.status} />
                        <p className="text-sm text-gray-500 mt-6 mb-10">{STEP_TEXT[order.status] || STEP_TEXT.Processing}</p>

                        <ul className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-gray-100 dark:border-gray-800">
                            {order.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-4 py-4">
                                    <img src={getImageUrl(item.image)} alt={item.name} loading="lazy" className="w-14 h-16 object-cover border border-gray-200 dark:border-gray-800" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[#111] dark:text-white">{item.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Qty {item.quantity}{item.bottleSize ? ` · ${item.bottleSize}` : ''}</p>
                                    </div>
                                    <p className="text-sm text-[#111] dark:text-white">{formatPrice((item.price || 0) * item.quantity)}</p>
                                </li>
                            ))}
                        </ul>

                        <p className="text-xs text-gray-500 mt-8">
                            Questions about this order? <button onClick={() => onNavigate('contact')} className={linkUnderline}>Contact us</button>
                        </p>
                    </section>
                )}
            </div>
        </motion.div>
    );
};

export default TrackOrderPage;
