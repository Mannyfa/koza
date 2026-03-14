import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://koza-2fkh.onrender.com';
const API_URL = `${API_BASE_URL}/api`;

// --- Helper Functions ---
const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Authorization': `Bearer ${token}` };
};

// --- Icons ---
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ProductsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;

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

const Sidebar = ({ current, setPage, isOpen, setIsOpen }) => (
    <>
        {/* Mobile backdrop overlay */}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
                onClick={() => setIsOpen(false)}
            />
        )}
        
        {/* Sidebar Panel */}
        <div className={`w-64 bg-slate-900 text-white h-full fixed left-0 top-0 p-4 z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
                <h2 className="text-xl font-bold text-center w-full">OPS ADMIN</h2>
                <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-400 hover:text-white absolute right-4">
                    <XIcon />
                </button>
            </div>
            <nav className="space-y-2">
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
                onLoginSuccess();
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

// --- Pages ---
const ProductsPage = ({ onLogout }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    
    const [formData, setFormData] = useState({ name: '', price: '', description: '' });
    const [imageFile, setImageFile] = useState(null); 

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

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ name: product.name, price: product.price, description: product.description || '' });
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', description: '' });
        }
        setImageFile(null);
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
            if (imageFile) formDataToSend.append('image', imageFile);

            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: formDataToSend
            });

            if (response.status === 401) return onLogout();

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
                if (res.status === 401) return onLogout();
                if (res.ok) fetchProducts();
            } catch (err) { alert(err.message); }
        }
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://placehold.co/400x400/cccccc/333333?text=No+Image';
        return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}/${imagePath}`;
    };

    if (loading) return <div className="p-4 sm:p-8 text-center mt-10">Loading Products...</div>;

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold">Manage Products</h1>
                <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full sm:w-auto transition">+ Add New Product</button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Image</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Product Name</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Price</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {products.map(product => (
                                <tr key={product._id} className="hover:bg-slate-50 transition">
                                    <td className="p-3 sm:p-4"><img src={getImageUrl(product.image)} alt={product.name} className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md border" /></td>
                                    <td className="p-3 sm:p-4 font-medium text-sm sm:text-base">{product.name}</td>
                                    <td className="p-3 sm:p-4 text-sm sm:text-base">₦{product.price.toLocaleString()}</td>
                                    <td className="p-3 sm:p-4 text-right space-x-2 sm:space-x-3 text-sm sm:text-base">
                                        <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800 font-medium p-1">Edit</button>
                                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:text-red-800 font-medium p-1">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-lg sm:text-xl font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
                        <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm" required={!editingProduct} />
                        {editingProduct && editingProduct.image && !imageFile && (
                            <div className="mt-2"><span className="text-xs text-gray-500">Current:</span><img src={getImageUrl(editingProduct.image)} alt="Current" className="h-16 w-16 object-cover mt-1 rounded-md border" /></div>
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

const OrdersPage = ({ onLogout }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
            if (res.status === 401) return onLogout();
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
                    <table className="w-full text-left min-w-[650px]">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Order ID</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Customer</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Total</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Status</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm sm:text-base">Update</th>
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
                                    <td className="p-3 sm:p-4 text-sm sm:text-base">₦{order.total.toLocaleString()}</td>
                                    <td className="p-3 sm:p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-3 sm:p-4">
                                        <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="border rounded p-1 sm:p-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]">
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
    const [page, setPage] = useState('orders');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
    };

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Sidebar 
                current={page} 
                setPage={setPage} 
                isOpen={isSidebarOpen} 
                setIsOpen={setIsSidebarOpen} 
            />
            
            {/* Main Content Wrapper - margins adjust automatically */}
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
                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition flex items-center space-x-1 sm:space-x-2">
                        <LogoutIcon />
                        <span className="hidden sm:inline text-sm sm:text-base">Logout</span>
                    </button>
                </header>
                <main className="flex-1 overflow-x-hidden">
                    {page === 'orders' ? <OrdersPage onLogout={handleLogout} /> : null}
                    {page === 'products' ? <ProductsPage onLogout={handleLogout} /> : null}
                </main>
            </div>
        </div>
    );
}