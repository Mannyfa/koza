import React, { useCallback, useEffect, useState } from 'react';

import { setUnauthorizedHandler } from './api/client';
import { FeedbackProvider } from './components/Feedback';
import { LogoutIcon, MenuIcon } from './components/Icons';
import Sidebar from './components/Sidebar';
import { clearResourceCache } from './hooks/useCachedResource';
import AnalyticsPage from './pages/AnalyticsPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import ProductsPage from './pages/ProductsPage';
import SettingsPage from './pages/SettingsPage';

const PAGES = ['analytics', 'orders', 'products', 'enrollments', 'settings'];

// Remember the open page in the address (#orders) so a refresh stays put
const pageFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    return PAGES.includes(hash) ? hash : 'analytics';
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
    const [adminRole, setAdminRole] = useState(localStorage.getItem('adminRole') || '');
    const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || '');
    const [page, setPageState] = useState(pageFromHash);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const setPage = useCallback((next) => {
        setPageState(next);
        if (window.location.hash !== `#${next}`) window.history.replaceState(null, '', `#${next}`);
    }, []);

    useEffect(() => {
        const onHash = () => setPageState(pageFromHash());
        window.addEventListener('hashchange', onHash);
        return () => window.removeEventListener('hashchange', onHash);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminName');
        clearResourceCache();
        setIsAuthenticated(false);
        setAdminRole('');
        setAdminName('');
    }, []);

    // Any request that comes back 401 (expired session) signs the admin out
    useEffect(() => { setUnauthorizedHandler(handleLogout); }, [handleLogout]);

    if (!isAuthenticated) {
        return <LoginPage onLoginSuccess={(role, name) => {
            setAdminRole(role);
            setAdminName(name);
            setIsAuthenticated(true);
        }} />;
    }

    return (
        <FeedbackProvider>
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
                            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-slate-600 hover:text-slate-900 p-1" aria-label="Open menu">
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
                        {page === 'analytics' && <AnalyticsPage setPage={setPage} />}
                        {page === 'orders' && <OrdersPage adminRole={adminRole} />}
                        {page === 'products' && <ProductsPage adminRole={adminRole} />}
                        {page === 'enrollments' && <EnrollmentsPage adminRole={adminRole} />}
                        {page === 'settings' && (adminRole === 'superadmin' ? <SettingsPage /> : <AnalyticsPage setPage={setPage} />)}
                    </main>
                </div>
            </div>
        </FeedbackProvider>
    );
}
