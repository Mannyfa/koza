import React, { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../api/client';
import { STATUS_STYLES } from '../config';
import useCachedResource from '../hooks/useCachedResource';
import { getImageUrl } from '../utils/helpers';

const EMPTY = {
    totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, chartData: [],
    statusCounts: {}, topProducts: [], lowStock: [], lowStockThreshold: 3, categoryRevenue: [],
};
const loadAnalytics = async () => ({ ...EMPTY, ...(await api('/analytics')) });

const StatCard = ({ label, value, tone = 'text-slate-900', hint }) => (
    <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className={`text-2xl sm:text-3xl font-black mt-2 ${tone}`}>{value}</p>
        {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
);

const AnalyticsPage = ({ setPage }) => {
    const { data: cached, loading, refreshing, error: loadError } = useCachedResource('analytics', loadAnalytics);
    const data = cached || EMPTY;
    const error = !cached && loadError
        ? (/permission/i.test(loadError) ? 'Your role does not have access to analytics.' : loadError)
        : '';
    const [selectedMonth, setSelectedMonth] = useState('All Time');

    let displayRevenue = data.totalRevenue;
    let displayOrders = data.totalOrders;

    if (selectedMonth !== 'All Time') {
        const monthData = data.chartData.find(d => d.date === selectedMonth);
        displayRevenue = monthData ? monthData.revenue : 0;
        displayOrders = monthData ? monthData.ordersCount : 0;
    }
    const displayAverage = displayOrders ? Math.round(displayRevenue / displayOrders) : 0;
    const openOrders = (data.statusCounts.Processing || 0) + (data.statusCounts.Shipped || 0);
    const maxTopRevenue = Math.max(1, ...data.topProducts.map((p) => p.revenue));
    const totalCategoryRevenue = data.categoryRevenue.reduce((sum, c) => sum + c.revenue, 0) || 1;

    if (loading) return <div className="p-4 sm:p-8 text-center mt-10">Loading Analytics...</div>;
    if (error) return <div className="p-4 sm:p-8"><div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div></div>;

    return (
        <div className="p-4 sm:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    Store Analytics
                    {refreshing && <span className="text-xs font-normal text-slate-400">Refreshing…</span>}
                </h1>
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white border border-gray-200 text-[#191970] font-bold py-2 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
                >
                    <option value="All Time">All Time</option>
                    {data.chartData.map((item, index) => (
                        <option key={index} value={item.date}>{item.date}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard label={selectedMonth === 'All Time' ? 'Total Revenue' : `Revenue (${selectedMonth})`} value={`₦${displayRevenue.toLocaleString()}`} tone="text-green-600" />
                <StatCard label={selectedMonth === 'All Time' ? 'Total Orders' : `Orders (${selectedMonth})`} value={displayOrders} tone="text-blue-600" hint="Cancelled orders excluded" />
                <StatCard label="Average Order" value={`₦${displayAverage.toLocaleString()}`} />
                <StatCard label="Open Orders" value={openOrders} tone={openOrders ? 'text-amber-600' : 'text-slate-900'} hint="Processing + shipped" />
            </div>

            {/* Orders by status */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4">Orders by Status</h3>
                <div className="flex flex-wrap gap-3">
                    {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                        <button key={status} onClick={() => setPage && setPage('orders')} className={`px-3 py-2 rounded-lg text-sm font-bold ${STATUS_STYLES[status]}`}>
                            {status}: {data.statusCounts[status] || 0}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96">
                <h3 className="font-bold text-gray-700 mb-4">Revenue Over Time</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `₦${value/1000}k`} />
                        <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Best sellers */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-1">Best Sellers</h3>
                    <p className="text-xs text-gray-400 mb-4">All time, by revenue. Cancelled orders excluded.</p>
                    {data.topProducts.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No sales yet.</p>
                    ) : (
                        <ol className="space-y-3">
                            {data.topProducts.map((p, i) => (
                                <li key={p.id}>
                                    <div className="flex justify-between text-sm mb-1 gap-3">
                                        <span className="font-medium text-slate-700 truncate">{i + 1}. {p.name}</span>
                                        <span className="text-slate-500 whitespace-nowrap">{p.quantity} sold · <strong className="text-slate-800">₦{Math.round(p.revenue).toLocaleString()}</strong></span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(p.revenue / maxTopRevenue) * 100}%` }} />
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                {/* Low stock */}
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-4 gap-3">
                        <div>
                            <h3 className="font-bold text-gray-700 mb-1">Low Stock</h3>
                            <p className="text-xs text-gray-400">Active products with {data.lowStockThreshold} or fewer left, or switched to out of stock.</p>
                        </div>
                        {setPage && <button onClick={() => setPage('products')} className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap">Manage →</button>}
                    </div>
                    {data.lowStock.length === 0 ? (
                        <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">Everything is well stocked.</p>
                    ) : (
                        <ul className="divide-y max-h-80 overflow-y-auto">
                            {data.lowStock.map((p) => (
                                <li key={p.id} className="py-2 flex items-center gap-3 text-sm">
                                    <img src={getImageUrl(p.image)} alt="" className="w-9 h-9 object-cover rounded-md border shrink-0" />
                                    <span className="flex-1 font-medium text-slate-700 truncate">{p.name}</span>
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap ${p.isOutOfStock || p.stockAmount === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {p.isOutOfStock ? 'Switched off' : p.stockAmount === 0 ? 'Sold out' : `${p.stockAmount} left`}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Revenue by category */}
            {data.categoryRevenue.length > 0 && (
                <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-4">Revenue by Category</h3>
                    <ul className="space-y-3">
                        {data.categoryRevenue.map((c) => {
                            const share = Math.round((c.revenue / totalCategoryRevenue) * 100);
                            return (
                                <li key={c.category}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-slate-700">{c.category}</span>
                                        <span className="text-slate-500">₦{Math.round(c.revenue).toLocaleString()} · {share}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#D4AF37] rounded-full" style={{ width: `${share}%` }} />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};


export default AnalyticsPage;
