import React, { useState, useEffect } from 'react';

// --- (Icons and Helper data are the same) ---
const adminNavLinks = [ { name: 'Dashboard', page: 'dashboard' }, { name: 'Products', page: 'products' }, { name: 'Orders', page: 'orders' }, { name: 'Customers', page: 'customers' }, { name: 'Settings', page: 'settings' }, ];
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ProductsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const CustomersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const icons = { DashboardIcon, ProductsIcon, OrdersIcon, CustomersIcon, SettingsIcon };
const API_BASE_URL = 'http://localhost:5001';
const API_URL = `${API_BASE_URL}/api`;

const Modal = ({ children, isOpen, onClose }) => { if (!isOpen) return null; return (<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"><div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"><button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"><XIcon /></button>{children}</div></div>); };
const Sidebar = ({ currentPage, onNavigate }) => ( <div className="w-64 bg-gray-800 text-white flex flex-col flex-shrink-0"> <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">KOZA ADMIN</div> <nav className="flex-1 px-2 py-4 space-y-2"> {adminNavLinks.map(link => { const IconComponent = icons[`${link.name}Icon`]; return ( <button key={link.name} onClick={() => onNavigate(link.page)} className={`w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors duration-200 ${currentPage === link.page ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}> <IconComponent /> <span className="ml-3">{link.name}</span> </button> ); })} </nav> </div> );
const DashboardPage = () => ( <div> <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1> <p className="mt-2 text-gray-600">Welcome back, Admin!</p> </div> );

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/products`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setProducts(data.data.products);
        } catch (e) { setError(e.message); } finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAddClick = () => { setEditingProduct(null); setIsModalOpen(true); };
    const handleEditClick = (product) => { setEditingProduct(product); setIsModalOpen(true); };
    const handleDelete = async (productId) => { if (window.confirm('Are you sure?')) { try { const response = await fetch(`${API_URL}/products/${productId}`, { method: 'DELETE' }); if (!response.ok && response.status !== 204) throw new Error('Failed to delete'); fetchProducts(); } catch (err) { alert(err.message); } } };

    const handleFormSubmit = async (formData) => {
        const url = editingProduct ? `${API_URL}/products/${editingProduct.id}` : `${API_URL}/products`;
        const method = editingProduct ? 'PUT' : 'POST';

        try {
            // We no longer set Content-Type header, the browser does it for FormData
            const response = await fetch(url, { method, body: formData });
            if (!response.ok) throw new Error(`Failed to ${editingProduct ? 'update' : 'create'} product`);
            setIsModalOpen(false);
            fetchProducts();
        } catch (err) { alert(err.message); }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}. Is backend running?</p>;

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <button onClick={handleAddClick} className="bg-gray-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700">+ Add Product</button>
            </div>
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-4">Image</th><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr></thead>
                    <tbody>
                        {products.map(product => {
                            const imageUrl = product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`;
                            return (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2"><img src={imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md"/></td>
                                    <td className="p-4 font-medium">{product.name}</td>
                                    <td className="p-4">₦{product.price.toLocaleString()}</td>
                                    <td className="p-4">{product.stock}</td>
                                    <td className="p-4">
                                        <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:underline mr-4">Edit</button>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ProductForm product={editingProduct} onSubmit={handleFormSubmit} />
            </Modal>
        </div>
    );
};

const ProductForm = ({ product, onSubmit }) => {
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price || '');
    const [stock, setStock] = useState(product?.stock || '');
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('stock', stock);
        if (imageFile) {
            formData.append('image', imageFile);
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h2>
            <div className="space-y-4">
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" className="w-full p-2 border rounded" required />
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" className="w-full p-2 border rounded" required />
                <input type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock Quantity" className="w-full p-2 border rounded" />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Product Image</label>
                    <input type="file" name="image" onChange={e => setImageFile(e.target.files[0])} className="w-full p-2 border rounded mt-1" />
                </div>
            </div>
            <button type="submit" className="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700">{product ? 'Update Product' : 'Save Product'}</button>
        </form>
    );
};

const OrdersPage = () => <h1 className="text-3xl font-bold text-gray-800">Orders (Coming Soon)</h1>;
const CustomersPage = () => <h1 className="text-3xl font-bold text-gray-800">Customers (Coming Soon)</h1>;
const SettingsPage = () => <h1 className="text-3xl font-bold text-gray-800">Settings (Coming Soon)</h1>;

export default function App() {
    const [currentPage, setCurrentPage] = useState('dashboard');
    const handleNavigate = (page) => setCurrentPage(page);
    const renderPage = () => { switch (currentPage) { case 'dashboard': return <DashboardPage />; case 'products': return <ProductsPage />; case 'orders': return <OrdersPage />; case 'customers': return <CustomersPage />; case 'settings': return <SettingsPage />; default: return <DashboardPage />; } };
    return ( <div className="flex h-screen bg-gray-100 font-sans"> <Sidebar currentPage={currentPage} onNavigate={handleNavigate} /> <main className="flex-1 p-8 overflow-y-auto">{renderPage()}</main> </div> );
}
