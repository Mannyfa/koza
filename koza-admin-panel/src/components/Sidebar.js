import React from 'react';
import { ChartIcon, OrdersIcon, ProductsIcon, SettingsIcon, XIcon } from './Icons';

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


export default Sidebar;
