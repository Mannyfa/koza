import React, { useMemo, useState } from 'react';
import { api } from '../api/client';
import { useFeedback } from '../components/Feedback';
import Modal from '../components/Modal';
import { EyeIcon, SearchIcon } from '../components/Icons';
import { canManage, ORDER_STATUSES, STATUS_STYLES } from '../config';
import useCachedResource from '../hooks/useCachedResource';
import { downloadCsv, getImageUrl } from '../utils/helpers';

const loadOrders = async () => (await api('/orders')).data.orders;
const orderNumber = (order) => (order.id ? String(order.id).slice(-6).toUpperCase() : 'N/A');

const OrdersPage = ({ adminRole }) => {
    const { notify, confirm } = useFeedback();
    const { data, setData: setOrders, loading, refreshing, error } = useCachedResource('orders', loadOrders);
    const orders = useMemo(() => data || [], [data]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');
    const [search, setSearch] = useState('');

    const counts = useMemo(() => orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {}), [orders]);

    const visibleOrders = useMemo(() => {
        const q = search.trim().toLowerCase().replace(/^#/, '');
        return orders.filter((o) =>
            (statusFilter === 'All' || o.status === statusFilter) &&
            (!q || [orderNumber(o), o.customer?.name, o.customer?.email, o.customer?.phone, o.reference]
                .some((field) => String(field || '').toLowerCase().includes(q)))
        );
    }, [orders, statusFilter, search]);

    const updateStatus = async (order, status) => {
        if (status === order.status) return;
        if (status === 'Cancelled') {
            const ok = await confirm({
                title: `Cancel order #${orderNumber(order)}?`,
                message: 'The customer will be emailed and the items will be added back to stock.',
                confirmLabel: 'Cancel order',
                cancelLabel: 'Keep order',
                tone: 'danger',
            });
            if (!ok) return;
        }

        const previous = order.status;
        // Show the new status straight away; put it back if the server refuses
        setOrders((list) => (list || []).map((o) => (o.id === order.id ? { ...o, status } : o)));
        setUpdatingId(order.id);
        try {
            await api(`/orders/${order.id}/status`, { method: 'PATCH', body: { status } });
            const stockNote = status === 'Cancelled' ? ' Stock returned to the shelf.' : '';
            notify(`Order #${orderNumber(order)} marked ${status}. Customer emailed.${stockNote}`);
        } catch (err) {
            setOrders((list) => (list || []).map((o) => (o.id === order.id ? { ...o, status: previous } : o)));
            notify(err.message, 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const exportOrders = () => {
        const header = ['Order #', 'Date', 'Status', 'Customer', 'Email', 'Phone', 'Address', 'City', 'State', 'Items', 'Total (NGN)', 'Paystack reference'];
        const rows = visibleOrders.map((o) => [
            orderNumber(o),
            o.date ? new Date(o.date).toLocaleString('en-NG') : '',
            o.status,
            o.customer?.name, o.customer?.email, o.customer?.phone,
            o.customer?.address, o.customer?.city, o.customer?.state,
            (o.cart || []).map((item) => `${item.quantity}x ${item.name}`).join('; '),
            o.total,
            o.reference,
        ]);
        downloadCsv(`opevicky-orders-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
        notify(`Exported ${rows.length} order${rows.length === 1 ? '' : 's'}`, 'info');
    };

    if (loading) return <div className="p-4 sm:p-8 text-center mt-10">Loading Orders...</div>;
    if (error && orders.length === 0) return <div className="p-4 sm:p-8"><div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div></div>;

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    Manage Orders
                    {refreshing && <span className="text-xs font-normal text-slate-400">Refreshing…</span>}
                </h1>
                <button onClick={exportOrders} disabled={visibleOrders.length === 0} className="bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 disabled:opacity-50 text-sm font-medium transition">
                    Export to spreadsheet (CSV)
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
                    {['All', ...ORDER_STATUSES].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)} aria-pressed={statusFilter === s}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${statusFilter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-300 hover:border-slate-500'}`}>
                            {s} <span className="opacity-60">{s === 'All' ? orders.length : counts[s] || 0}</span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                    <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Order #, name, email or phone"
                        aria-label="Search orders"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Order ID</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Customer</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Total</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Status</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Details</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Update Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {visibleOrders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 transition">
                                    <td className="p-3 sm:p-4 text-sm sm:text-base">#{orderNumber(order)}</td>
                                    <td className="p-3 sm:p-4">
                                        <div className="font-medium text-sm sm:text-base">{order.customer.name}</div>
                                        <div className="text-xs text-slate-500">{order.customer.email}</div>
                                    </td>
                                    <td className="p-3 sm:p-4 text-sm sm:text-base font-medium">₦{order.total.toLocaleString()}</td>
                                    <td className="p-3 sm:p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${STATUS_STYLES[order.status] || STATUS_STYLES.Processing}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-3 sm:p-4">
                                        <button 
                                            onClick={() => setSelectedOrder(order)} 
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center bg-blue-50 px-2 py-1 rounded-md transition"
                                        >
                                            <EyeIcon /> View
                                        </button>
                                    </td>
                                    <td className="p-3 sm:p-4">
                                        {canManage(adminRole) ? (
                                            <select value={order.status} disabled={updatingId === order.id} onChange={(e) => updateStatus(order, e.target.value)} aria-label={`Status for order ${orderNumber(order)}`} className="border rounded p-1 sm:p-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px] disabled:opacity-60">
                                                {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                                            </select>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">View Only</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {visibleOrders.length === 0 && (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">{orders.length ? 'No orders match these filters.' : 'No orders yet.'}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Details Modal */}
            <Modal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
                {selectedOrder && (
                    <div className="text-left">
                        <h2 className="text-lg sm:text-xl font-bold mb-4 pb-3 border-b text-slate-800 flex justify-between items-center">
                            Order Details
                            <span className="text-sm font-normal text-slate-500">#{selectedOrder.id ? selectedOrder.id.slice(-6).toUpperCase() : ''}</span>
                        </h2>
                        
                        <div className="space-y-5">
                            <div className="bg-slate-50 p-3 rounded-lg border">
                                <h3 className="font-semibold text-sm text-slate-800 mb-2 uppercase tracking-wide">Customer Info</h3>
                                <div className="text-sm space-y-1 text-slate-600">
                                    <p><strong className="text-slate-800">Name:</strong> {selectedOrder.customer.name}</p>
                                    <p><strong className="text-slate-800">Email:</strong> <a href={`mailto:${selectedOrder.customer.email}`} className="text-blue-600 hover:underline">{selectedOrder.customer.email}</a></p>
                                    <p><strong className="text-slate-800">Phone:</strong> <a href={`tel:${selectedOrder.customer.phone}`} className="text-blue-600 hover:underline">{selectedOrder.customer.phone}</a></p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 rounded-lg border">
                                <h3 className="font-semibold text-sm text-slate-800 mb-2 uppercase tracking-wide">Delivery Address</h3>
                                <div className="text-sm text-slate-600">
                                    <p>{selectedOrder.customer.address}</p>
                                    <p>{selectedOrder.customer.city}, {selectedOrder.customer.state}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-sm text-slate-800 mb-2 uppercase tracking-wide">Items Ordered</h3>
                                <ul className="divide-y border rounded-lg bg-white overflow-hidden">
                                    {selectedOrder.cart && selectedOrder.cart.length > 0 ? (
                                        selectedOrder.cart.map((item, index) => {
                                            // Handle mapping array images back down to cart preview securely
                                            const imgUrl = item.images && item.images.length > 0 ? item.images[0] : item.image;
                                            return (
                                                <li key={index} className="p-3 flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-xs shrink-0">x{item.quantity}</span>
                                                        <img 
                                                            src={getImageUrl(imgUrl)} 
                                                            alt={item.name} 
                                                            className="w-10 h-10 object-cover rounded-md border border-gray-200 shrink-0" 
                                                        />
                                                        <span className="font-medium text-slate-700">
                                                            {item.name} {item.bottleSize ? <span className="text-slate-400 font-normal">({item.bottleSize})</span> : ''}
                                                        </span>
                                                    </div>
                                                    <span className="font-semibold text-slate-800 shrink-0 ml-2">
                                                        ₦{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </li>
                                            )
                                        })
                                    ) : (
                                        <li className="p-3 text-sm text-gray-500 italic text-center">
                                            No items details found for this older order.
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-4 border-t flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Grand Total</span>
                            <span className="text-xl font-bold text-slate-900">₦{selectedOrder.total.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};


export default OrdersPage;
