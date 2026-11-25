import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useFeedback } from '../components/Feedback';
import Modal from '../components/Modal';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from '../components/Icons';
import { canManage, PRODUCT_CATEGORIES } from '../config';
import useCachedResource from '../hooks/useCachedResource';
import { getImageUrl } from '../utils/helpers';

const EMPTY_FORM = {
    name: '', price: '', description: '', bottleSize: '', stockAmount: '', isActive: true, isOutOfStock: false, discountPercentage: '', category: '',
};
const productsPerPage = 10;

const loadProducts = async () => (await api('/products', { auth: false })).data.products;
const loadCategories = async () => {
    const data = await api('/products/categories', { auth: false });
    return Array.isArray(data.categories) && data.categories.length ? data.categories : PRODUCT_CATEGORIES;
};

const ProductsPage = ({ adminRole }) => {
    const { notify, confirm } = useFeedback();
    const { data: productData, setData: setProducts, loading, refreshing, error } = useCachedResource('products', loadProducts);
    const { data: categoryData } = useCachedResource('categories', loadCategories);
    const products = useMemo(() => productData || [], [productData]);
    const categories = categoryData || PRODUCT_CATEGORIES;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const [formData, setFormData] = useState(EMPTY_FORM);
    const [imageFiles, setImageFiles] = useState([]);

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
                isOutOfStock: product.isOutOfStock === true,
                category: product.category || '',
                discountPercentage: product.discountPercentage !== undefined ? product.discountPercentage : ''
            });
        } else {
            setEditingProduct(null);
            setFormData(EMPTY_FORM);
        }
        setImageFiles([]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (!saving) setIsModalOpen(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            const body = new FormData();
            Object.entries(formData).forEach(([key, value]) => body.append(key, value));
            imageFiles.forEach((file) => body.append('images', file));

            const result = editingProduct
                ? await api(`/products/${editingProduct._id}`, { method: 'PUT', body })
                : await api('/products', { method: 'POST', body });
            const saved = result.data.product;

            // Update the list in place: no reload, the table keeps its page and search
            setProducts((list) => {
                const current = list || [];
                return editingProduct
                    ? current.map((p) => (p._id === saved._id ? saved : p))
                    : [saved, ...current];
            });
            setIsModalOpen(false);
            notify(editingProduct ? `"${saved.name.trim()}" updated` : `"${saved.name.trim()}" added`);
        } catch (err) {
            notify(err.message, 'error'); // modal stays open so nothing typed is lost
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (product) => {
        const ok = await confirm({
            title: 'Delete this product?',
            message: `"${product.name.trim()}" will be removed from the store. This cannot be undone.`,
            confirmLabel: 'Delete',
            tone: 'danger',
        });
        if (!ok) return;
        setDeletingId(product._id);
        try {
            await api(`/products/${product._id}`, { method: 'DELETE' });
            setProducts((list) => (list || []).filter((p) => p._id !== product._id));
            notify(`"${product.name.trim()}" deleted`);
        } catch (err) {
            notify(err.message, 'error');
        } finally {
            setDeletingId(null);
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
    if (error && products.length === 0) return <div className="p-4 sm:p-8"><div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div></div>;

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                    Manage Products
                    {refreshing && <span className="text-xs font-normal text-slate-400">Refreshing…</span>}
                </h1>
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
                    
                    {canManage(adminRole) && (
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
                                                <div className={`text-xs font-normal mt-0.5 ${product.category ? 'text-slate-500' : 'text-amber-600'}`}>{product.category || 'No category'}</div>
                                            </td>
                                            <td className="p-3 sm:p-4 text-sm sm:text-base text-gray-600">{product.bottleSize || 'N/A'}</td>
                                            <td className="p-3 sm:p-4 text-sm sm:text-base">₦{product.price.toLocaleString()}</td>
                                            <td className="p-3 sm:p-4 text-sm sm:text-base">
                                                {product.isOutOfStock ? (
                                                    <span className="px-2 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700">Out of stock</span>
                                                ) : (
                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${product.stockAmount > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {product.stockAmount !== undefined ? product.stockAmount : 0} left
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-3 sm:p-4 text-sm sm:text-base">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.isActive !== false ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {product.isActive !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-3 sm:p-4 text-right space-x-2 sm:space-x-3 text-sm sm:text-base">
                                                {canManage(adminRole) && (
                                                    <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800 font-medium p-1">Edit</button>
                                                )}
                                                {adminRole === 'superadmin' && (
                                                    <button onClick={() => handleDelete(product)} disabled={deletingId === product._id} className="text-red-600 hover:text-red-800 font-medium p-1 disabled:opacity-50">{deletingId === product._id ? 'Deleting…' : 'Delete'}</button>
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

            <Modal isOpen={isModalOpen} onClose={closeModal}>
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

                    <div className="flex items-center justify-between p-3 border rounded-md bg-slate-50 mb-2">
                        <div>
                            <span className="block text-sm font-medium text-gray-900">Out of Stock</span>
                            <span className="block text-xs text-gray-500">Toggle on to show an "Out of Stock" badge and stop sales. The product stays visible.</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, isOutOfStock: !formData.isOutOfStock})}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 ${formData.isOutOfStock ? 'bg-red-600' : 'bg-gray-200'}`}
                            role="switch"
                            aria-checked={formData.isOutOfStock}
                            aria-label="Out of stock"
                        >
                            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isOutOfStock ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md" required />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-2 border rounded-md bg-white" required>
                            <option value="" disabled>Choose a category</option>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                            {formData.category && !categories.includes(formData.category) && <option value={formData.category}>{formData.category}</option>}
                        </select>
                        <span className="block text-xs text-gray-500 mt-1">Used for the shop filters on the website.</span>
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
                    <button type="submit" disabled={saving} className="w-full bg-slate-900 text-white font-bold py-2 sm:py-3 rounded-md hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-wait">
                        {saving ? (imageFiles.length ? 'Uploading images…' : 'Saving…') : (editingProduct ? 'Save Changes' : 'Create Product')}
                    </button>
                </form>
            </Modal>
        </div>
    );
};


export default ProductsPage;
