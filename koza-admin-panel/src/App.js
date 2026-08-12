import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'https://koza-2fkh.onrender.com';
const API_URL = `${API_BASE_URL}/api`;

// --- Helper Functions ---
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Authorization': `Bearer ${token}` };
};

const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x400/cccccc/333333?text=No+Image';
    return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}/${imagePath}`;
};

// --- Icons ---
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ProductsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>;
const ChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ReceiptIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

// --- Components ---
const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 bg-white rounded-full p-1">
                    <XIcon />
                </button>
                {children}
            </div>
        </div>
    );
};

const Sidebar = ({ current, setPage, isOpen, setIsOpen, adminRole }) => (
    <>
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
                onClick={() => setIsOpen(false)}
            />
        )}
        
        <div className={`w-64 bg-slate-900 text-white h-full fixed left-0 top-0 p-4 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-center w-full">OPS ADMIN</h2>
                <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white absolute right-4">
                    <XIcon />
                </button>
            </div>
            <nav className="space-y-2">
                <button 
                    onClick={() => { setPage('analytics'); setIsOpen(false); }} 
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${current === 'analytics' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
                >
                    <ChartIcon /><span>Analytics</span>
                </button>
                <button 
                    onClick={() => { setPage('orders'); setIsOpen(false); }} 
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${current === 'orders' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
                >
                    <OrdersIcon /><span>Orders</span>
                </button>
                <button 
                    onClick={() => { setPage('products'); setIsOpen(false); }} 
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${current === 'products' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
                >
                    <ProductsIcon /><span>Products</span>
                </button>
                {adminRole === 'superadmin' && (
                    <button 
                        onClick={() => { setPage('settings'); setIsOpen(false); }} 
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition ${current === 'settings' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}
                    >
                        <SettingsIcon /><span>Settings</span>
                    </button>
                )}
            </nav>
        </div>
    </>
);

// --- LoginPage ---
const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminRole', data.role);
                localStorage.setItem('adminName', data.name);
                onLoginSuccess(data.role, data.name);
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            setError('Server error. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h1>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 sm:py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition">
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- Analytics Page ---
const AnalyticsPage = ({ onLogout }) => {
    const [data, setData] = useState({ totalRevenue: 0, totalOrders: 0, chartData: [] });
    const [selectedMonth, setSelectedMonth] = useState('All Time');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch(`${API_URL}/analytics`, { headers: getAuthHeaders() });
                if (res.status === 401) return onLogout();
                const json = await res.json();
                setData(json);
            } catch (err) { console.error(err); }
        };
        fetchAnalytics();
    }, [onLogout]);

    let displayRevenue = data.totalRevenue;
    let displayOrders = data.totalOrders;

    if (selectedMonth !== 'All Time') {
        const monthData = data.chartData.find(d => d.date === selectedMonth);
        displayRevenue = monthData ? monthData.revenue : 0;
        displayOrders = monthData ? monthData.ordersCount : 0;
    }

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Store Analytics</h1>
                
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {selectedMonth === 'All Time' ? 'Total Revenue' : `Revenue (${selectedMonth})`}
                    </p>
                    <p className="text-3xl font-black text-green-600 mt-2">₦{displayRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {selectedMonth === 'All Time' ? 'Total Orders' : `Orders (${selectedMonth})`}
                    </p>
                    <p className="text-3xl font-black text-blue-600 mt-2">{displayOrders}</p>
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
        </div>
    );
};

// --- Settings Page (Superadmin Only) ---
const SettingsPage = () => {
    const [admins, setAdmins] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'editor' });

    const fetchAdmins = async () => {
        const res = await fetch(`${API_URL}/admin/users`, { headers: getAuthHeaders() });
        if (res.ok) setAdmins(await res.json());
    };

    useEffect(() => { fetchAdmins(); }, []);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_URL}/admin/register`, {
            method: 'POST', headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert("Admin created successfully!");
            setFormData({ name: '', email: '', password: '', role: 'editor' });
            fetchAdmins();
        } else {
            const err = await res.json(); alert(err.message);
        }
    };

    const handleDeleteAdmin = async (id) => {
        if(window.confirm("Delete this admin account?")) {
            await fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
            fetchAdmins();
        }
    };

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-bold mb-6">System Settings & Permissions</h1>
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-lg mb-4">Create New Admin</h3>
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <input type="text" placeholder="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md" />
                        <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded-md" />
                        <input type="password" placeholder="Password" required minLength="6" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded-md" />
                        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded-md">
                            <option value="editor">Editor (View Only)</option>
                            <option value="manager">Manager (Manage Products & Orders)</option>
                            <option value="superadmin">Superadmin (Full Access)</option>
                        </select>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700">Create Account</button>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-lg mb-4">Active Admins</h3>
                    <ul className="divide-y">
                        {admins.map(admin => (
                            <li key={admin._id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800">{admin.name} <span className="text-xs ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase tracking-wider">{admin.role}</span></p>
                                    <p className="text-sm text-gray-500">{admin.email}</p>
                                </div>
                                <button onClick={() => handleDeleteAdmin(admin._id)} className="text-red-500 text-sm font-bold hover:text-red-700">Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

// --- Pages ---
const ProductsPage = ({ onLogout, adminRole }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;
    
    const [formData, setFormData] = useState({ 
        name: '', price: '', description: '', bottleSize: '', stockAmount: '', isActive: true, discountPercentage: ''
    });
    
    // UPDATED: Now an array to handle multiple files
    const [imageFiles, setImageFiles] = useState([]); 

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/products`);
            const data = await res.json();
            setProducts(data.data.products);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ 
                name: product.name, 
                price: product.price, 
                description: product.description || '',
                bottleSize: product.bottleSize || '',
                stockAmount: product.stockAmount !== undefined ? product.stockAmount : '',
                isActive: product.isActive !== undefined ? product.isActive : true,
                discountPercentage: product.discountPercentage !== undefined ? product.discountPercentage : ''
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', description: '', bottleSize: '', stockAmount: '', isActive: true, discountPercentage: '' });
        }
        setImageFiles([]); // Reset image array
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingProduct ? `${API_URL}/products/${editingProduct._id}` : `${API_URL}/products`;
            const method = editingProduct ? 'PUT' : 'POST';

            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('bottleSize', formData.bottleSize);
            formDataToSend.append('stockAmount', formData.stockAmount);
            formDataToSend.append('isActive', formData.isActive);
            formDataToSend.append('discountPercentage', formData.discountPercentage); 
            
            // UPDATED: Append each file inside the imageFiles array
            if (imageFiles && imageFiles.length > 0) {
                imageFiles.forEach(file => {
                    formDataToSend.append('images', file);
                });
            }

            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: formDataToSend
            });

            if (response.status === 401 || response.status === 403) return onLogout();

            if (response.ok) {
                fetchProducts();
                setIsModalOpen(false);
                alert(editingProduct ? 'Product updated!' : 'Product added!');
            } else {
                const err = await response.json();
                throw new Error(err.message);
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await fetch(`${API_URL}/products/${id}`, { 
                    method: 'DELETE',
                    headers: getAuthHeaders()
                });
                if (res.status === 401 || res.status === 403) {
                    alert("Forbidden: You do not have permission to delete products.");
                    return;
                }
                if (res.ok) fetchProducts();
            } catch (err) { alert(err.message); }
        }
    };

    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (loading) return <div className="p-4 sm:p-8 text-center mt-10">Loading Products...</div>;

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Manage Products</h1>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
                        />
                    </div>
                    
                    {(adminRole === 'superadmin' || adminRole === 'manager') && (
                        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap transition">+ Add New Product</button>
                    )}
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[850px]">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Image</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Product Name</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Size</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Price</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Stock</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Status</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {currentProducts.length > 0 ? (
                                currentProducts.map(product => {
                                    // Handle legacy single image vs new array
                                    const thumbImg = product.images && product.images.length > 0 ? product.images[0] : product.image;
                                    return (
                                        <tr key={product._id} className="hover:bg-slate-50 transition">
                                            <td className="p-3 sm:p-4"><img src={getImageUrl(thumbImg)} alt={product.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md border" /></td>
                                            <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">
                                                {product.name} 
                                                {product.discountPercentage > 0 && <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">-{product.discountPercentage}%</span>}
                                            </td>
                                            <td className="p-3 sm:p-4 text-sm sm:text-base text-gray-600">{product.bottleSize || 'N/A'}</td>
                                            <td className="p-3 sm:p-4 text-sm sm:text-base">₦{product.price.toLocaleString()}</td>
                                            <td className="p-3 sm:p-4 text-sm sm:text-base">
                                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.stockAmount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {product.stockAmount !== undefined ? product.stockAmount : 0} left
                                                </span>
                                            </td>
                                            <td className="p-3 sm:p-4 text-sm sm:text-base">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.isActive !== false ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {product.isActive !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-3 sm:p-4 text-right space-x-2 sm:space-x-3 text-sm sm:text-base">
                                                {(adminRole === 'superadmin' || adminRole === 'manager') && (
                                                    <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800 font-medium p-1">Edit</button>
                                                )}
                                                {adminRole === 'superadmin' && (
                                                    <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800 font-medium p-1">Delete</button>
                                                )}
                                                {adminRole === 'editor' && (
                                                    <span className="text-gray-400 italic text-xs">View Only</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
                                        No products found matching "{searchTerm}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {totalPages > 1 && (
                    <div className="bg-slate-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon />
                                    </button>
                                    
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage === i + 1 
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon />
                                    </button>
                                </nav>
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-lg sm:text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50 mb-2">
                        <div>
                            <span className="block text-sm font-medium text-gray-900">Active Status</span>
                            <span className="block text-xs text-gray-500">Toggle off to hide from the main store</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${formData.isActive ? 'bg-blue-600' : 'bg-gray-200'}`}
                            role="switch"
                            aria-checked={formData.isActive}
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md" required />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bottle Size</label>
                            <input type="text" value={formData.bottleSize} onChange={(e) => setFormData({...formData, bottleSize: e.target.value})} placeholder="e.g. 500ml, 1L" className="w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                            <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded-md" required />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                            <input type="number" value={formData.stockAmount} onChange={(e) => setFormData({...formData, stockAmount: e.target.value})} min="0" placeholder="0" className="w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                            <input type="number" value={formData.discountPercentage} onChange={(e) => setFormData({...formData, discountPercentage: e.target.value})} min="0" max="100" placeholder="0" className="w-full p-2 border rounded-md" />
                        </div>
                    </div>

                    <div>
                        {/* UPDATED: Multiple image upload support */}
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (Up to 5)</label>
                        <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} className="w-full p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm" required={!editingProduct} />
                        
                        {/* Preview existing images if no new ones are selected */}
                        {editingProduct && imageFiles.length === 0 && (
                            <div className="mt-2">
                                <span className="text-xs text-gray-500 block mb-1">Current Images:</span>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {editingProduct.images && editingProduct.images.length > 0 ? (
                                        editingProduct.images.map((img, idx) => (
                                            <img key={idx} src={getImageUrl(img)} alt={`Current ${idx}`} className="h-16 w-16 min-w-[4rem] object-cover rounded-md border" />
                                        ))
                                    ) : editingProduct.image ? (
                                        <img src={getImageUrl(editingProduct.image)} alt="Current" className="h-16 w-16 object-cover rounded-md border" />
                                    ) : null}
                                </div>
                            </div>
                        )}

                        {/* Inform user how many new files are selected */}
                        {imageFiles.length > 0 && (
                            <div className="mt-2 text-sm text-blue-600 font-bold">
                                {imageFiles.length} new image(s) selected to upload.
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-2 border rounded-md" rows="3"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-2 sm:py-3 rounded-md hover:bg-slate-800 transition">{editingProduct ? 'Save Changes' : 'Create Product'}</button>
                </form>
            </Modal>
        </div>
    );
};

const OrdersPage = ({ onLogout, adminRole }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); 

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/orders`, { headers: getAuthHeaders() });
            if (res.status === 401) return onLogout();
            const data = await res.json();
            setOrders(data.data.orders);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`${API_URL}/orders/${id}/status`, {
                method: 'PATCH',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            if (res.status === 401 || res.status === 403) {
                alert("Forbidden: You do not have permission to update orders.");
                return;
            }
            if (res.ok) {
                fetchOrders();
                alert(`Status updated to ${status}. Email sent to customer.`);
            }
        } catch (err) { alert("Failed to update status."); }
    };

    useEffect(() => { fetchOrders(); }, []);

    if (loading) return <div className="p-4 sm:p-8 text-center mt-10">Loading Orders...</div>;

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Manage Orders</h1>
            
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
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 transition">
                                    <td className="p-3 sm:p-4 text-sm sm:text-base">#{order.id ? order.id.slice(-6).toUpperCase() : 'N/A'}</td>
                                    <td className="p-3 sm:p-4">
                                        <div className="font-medium text-sm sm:text-base">{order.customer.name}</div>
                                        <div className="text-xs text-slate-500">{order.customer.email}</div>
                                    </td>
                                    <td className="p-3 sm:p-4 text-sm sm:text-base font-medium">₦{order.total.toLocaleString()}</td>
                                    <td className="p-3 sm:p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
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
                                        {(adminRole === 'superadmin' || adminRole === 'manager') ? (
                                            <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="border rounded p-1 sm:p-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]">
                                                <option value="Processing">Processing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        ) : (
                                            <span className="text-gray-400 text-sm italic">View Only</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
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

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
    const [adminRole, setAdminRole] = useState(localStorage.getItem('adminRole') || '');
    const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || '');
    const [page, setPage] = useState('analytics');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminName');
        setIsAuthenticated(false);
        setAdminRole('');
        setAdminName('');
    };

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={(role, name) => {
            setAdminRole(role);
            setAdminName(name);
            setIsAuthenticated(true);
        }} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Sidebar 
                current={page} 
                setPage={setPage} 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
                adminRole={adminRole}
            />
            
            <div className="flex-1 flex flex-col min-w-0 md:ml-64 w-full">
                <header className="bg-white border-b h-16 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="md:hidden text-slate-600 hover:text-slate-900 p-1"
                        >
                            <MenuIcon />
                        </button>
                        <span className="font-semibold text-slate-700 hidden sm:block">Administrator Panel</span>
                        <span className="font-semibold text-slate-700 block sm:hidden">Admin</span>
                    </div>
                    <div className="flex items-center space-x-4 sm:space-x-6">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-slate-800">{adminName}</span>
                            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{adminRole}</span>
                        </div>
                        <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition flex items-center space-x-1 sm:space-x-2 border-l pl-4 sm:pl-6">
                            <LogoutIcon />
                            <span className="hidden sm:inline text-sm sm:text-base">Logout</span>
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden">
                    {page === 'analytics' ? <AnalyticsPage onLogout={handleLogout} /> : null}
                    {page === 'orders' ? <OrdersPage onLogout={handleLogout} adminRole={adminRole} /> : null}
                    {page === 'products' ? <ProductsPage onLogout={handleLogout} adminRole={adminRole} /> : null}
                    {page === 'settings' && adminRole === 'superadmin' ? <SettingsPage /> : null}
                </main>
            </div>
        </div>
    );
}