import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Helper Data & Icons ---
const adminNavLinks = [
    { name: 'Dashboard', page: 'dashboard' },
    { name: 'Products', page: 'products' },
    { name: 'Orders', page: 'orders' },
    { name: 'Blog', page: 'blog' },
    { name: 'Customers', page: 'customers' },
    { name: 'Settings', page: 'settings' },
];

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ProductsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const CustomersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const BlogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

const icons = { DashboardIcon, ProductsIcon, OrdersIcon, BlogIcon, CustomersIcon, SettingsIcon };
const API_URL = 'http://localhost:5001/api';

// --- Reusable Components ---
const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                    <XIcon />
                </button>
                {children}
            </div>
        </div>
    );
};

// --- Main Layout Components ---
const Sidebar = ({ currentPage, onNavigate }) => (
    <div className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">KOZA ADMIN</div>
        <nav className="flex-1 px-2 py-4 space-y-2">
            {adminNavLinks.map(link => {
                const IconComponent = icons[`${link.name}Icon`];
                return (
                    <button key={link.name} onClick={() => onNavigate(link.page)} className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors duration-200 ${currentPage === link.page ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
                        <IconComponent />
                        <span className="ml-3">{link.name}</span>
                    </button>
                );
            })}
        </nav>
    </div>
);

// --- Page Components ---
const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${API_URL}/dashboard/stats`);
                if (!response.ok) throw new Error('Failed to fetch stats');
                const data = await response.json();
                setStats(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p className="text-center text-gray-500">Loading dashboard...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500">Total Revenue</h3>
                    <p className="text-3xl font-bold text-gray-800">₦{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500">Total Sales</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.totalSales}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500">New Customers</h3>
                    <p className="text-3xl font-bold text-gray-800">0</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500">Pending Orders</h3>
                    <p className="text-3xl font-bold text-gray-800">0</p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-semibold mb-4">Weekly Sales</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => `₦${value.toLocaleString()}`} />
                            <Legend />
                            <Bar dataKey="sales" fill="#4a5568" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="font-semibold mb-4">Best-Selling Products</h3>
                     <ul className="space-y-2">
                        {stats.bestSellers.map(item => (
                            <li key={item.name} className="flex justify-between text-sm">
                                <span>{item.name}</span>
                                <span className="font-bold">{item.count} sold</span>
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </div>
    );
};

const ProductForm = ({ product, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        stock: product?.stock || '0',
    });
    const [imageFile, setImageFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const submissionData = new FormData();
        submissionData.append('name', formData.name);
        submissionData.append('price', formData.price);
        submissionData.append('stock', formData.stock);
        if (imageFile) {
            submissionData.append('image', imageFile);
        }

        try {
            await onSubmit(submissionData, product?.id);
            onClose();
        } catch (error) {
            alert(`Failed to save product: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (₦)</label>
                <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
                <input type="file" name="image" id="image" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"/>
                {product?.image && !imageFile && <img src={`${API_URL}/${product.image}`} alt={product.name} className="mt-2 h-20 w-20 object-cover rounded-md"/>}
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">{isSubmitting ? 'Saving...' : 'Save Product'}</button>
            </div>
        </form>
    );
};

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const API_BASE_URL = 'http://localhost:5001';

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            // Prepend base URL to image paths
            const productsWithFullImagePaths = data.data.products.map(p => ({
                ...p,
                image: p.image.startsWith('http') ? p.image : `${API_BASE_URL}/${p.image.replace(/\\/g, '/')}`
            }));
            setProducts(productsWithFullImagePaths);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleOpenModal = (product = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleFormSubmit = async (formData, productId) => {
        const url = productId ? `${API_URL}/products/${productId}` : `${API_URL}/products`;
        const method = productId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { method, body: formData });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to save product.');
            }
            await fetchProducts(); // Refresh list
        } catch (err) {
            console.error("Submission error:", err);
            throw err;
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${API_URL}/products/${productId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete product.');
                fetchProducts(); // Refresh list
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error: {error}. Is your backend server running?</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    + Add New Product
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">
                                    <img src={product.image} alt={product.name} className="h-16 w-16 object-cover rounded-md"/>
                                </td>
                                <td className="p-4 font-medium">{product.name}</td>
                                <td className="p-4">₦{product.price.toLocaleString()}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4 space-x-2">
                                    <button onClick={() => handleOpenModal(product)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Edit</button>
                                    <button onClick={() => handleDelete(product.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <ProductForm product={editingProduct} onSubmit={handleFormSubmit} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/orders`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setOrders(data.data.orders);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewDetails = async (orderId) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}`);
            if (!response.ok) throw new Error('Failed to fetch order details');
            const data = await response.json();
            setSelectedOrder(data.data.order);
            setIsModalOpen(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (!response.ok) throw new Error('Failed to update status');
            fetchOrders(); // Refresh the list
        } catch (err) {
            alert(err.message);
        }
    };
    
    const getStatusColor = (status) => {
        switch (status) {
            case 'Shipped': return 'bg-blue-100 text-blue-800';
            case 'Processing': return 'bg-yellow-100 text-yellow-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error: {error}. Is your backend server running?</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">Order ID</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">#{order.id}</td>
                                <td className="p-4">{order.customer.name}</td>
                                <td className="p-4">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="p-4">₦{order.total.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleViewDetails(order.id)} className="text-indigo-600 hover:underline">View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} size="lg">
                {selectedOrder && <OrderDetailModal order={selectedOrder} onStatusChange={handleStatusChange} />}
            </Modal>
        </div>
    );
};

const OrderDetailModal = ({ order, onStatusChange }) => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800">Order Details #{order.id}</h2>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                    <h3 className="font-semibold text-gray-600">Customer Details</h3>
                    <p>{order.customer.name}</p>
                    <p>{order.customer.email}</p>
                    <p>{order.customer.phone}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-600">Shipping Address</h3>
                    <p>{order.shippingAddress}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-600">Order Info</h3>
                    <p>Date: {new Date(order.date).toLocaleString()}</p>
                    <p>Transaction Ref: {order.transactionRef}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-600">Status</h3>
                    <select 
                        value={order.status} 
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        className="p-2 border rounded-md w-full"
                    >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="font-semibold text-gray-600">Items Ordered</h3>
                <table className="w-full text-left mt-2">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Product</th>
                            <th className="p-2">Quantity</th>
                            <th className="p-2 text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">{item.quantity}</td>
                                <td className="p-2 text-right">₦{item.price.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold">
                            <td colSpan="2" className="p-2 text-right">Total</td>
                            <td className="p-2 text-right">₦{order.total.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

const BlogPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/blog`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setPosts(data.data.posts);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleOpenModal = (post = null) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPost(null);
    };

    const handleFormSubmit = async (formData, postId) => {
        const url = postId ? `${API_URL}/blog/${postId}` : `${API_URL}/blog`;
        const method = postId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Failed to save post.');
            }
            await fetchPosts(); // Refresh list
            handleCloseModal();
        } catch (err) {
            console.error("Submission error:", err);
            alert(`Failed to save post: ${err.message}`);
        }
    };

    const handleDelete = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`${API_URL}/blog/${postId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete post.');
                fetchPosts(); // Refresh list
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p>Error: {error}. Is your backend server running?</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Blog Posts</h1>
                <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    + Add New Post
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">Title</th>
                            <th className="p-4">Summary</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{post.title}</td>
                                <td className="p-4">{post.summary}</td>
                                <td className="p-4">{new Date(post.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 space-x-2">
                                    <button onClick={() => handleOpenModal(post)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Edit</button>
                                    <button onClick={() => handleDelete(post.id)} className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                <BlogPostForm post={editingPost} onSubmit={(formData) => handleFormSubmit(formData, editingPost?.id)} onClose={handleCloseModal} />
            </Modal>
        </div>
    );
};

const BlogPostForm = ({ post, onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        title: post?.title || '',
        summary: post?.summary || '',
        imageUrl: post?.imageUrl || '',
        content: post?.content || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await onSubmit(formData);
        setIsSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">{post ? 'Edit Post' : 'Add New Post'}</h2>
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Post Title</label>
                <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
            </div>
            <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
                <textarea name="summary" id="summary" value={formData.summary} onChange={handleChange} required rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Full Content</label>
                <textarea name="content" id="content" value={formData.content} onChange={handleChange} required rows="6" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">{isSubmitting ? 'Saving...' : 'Save Post'}</button>
            </div>
        </form>
    );
};





const CustomersPage = () => <h1 className="text-3xl font-bold text-gray-800">Customers (Coming Soon)</h1>;
const SettingsPage = () => <h1 className="text-3xl font-bold text-gray-800">Settings (Coming Soon)</h1>;

// --- Main App Component ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const handleNavigate = (page) => setCurrentPage(page);

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard': return <DashboardPage />;
            case 'products': return <ProductsPage />;
            case 'orders': return <OrdersPage />;
            case 'blog': return <BlogPage />;
            case 'customers': return <CustomersPage />;
            case 'settings': return <SettingsPage />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
            <main className="flex-1 p-8 overflow-y-auto">{renderPage()}</main>
        </div>
    );
}


