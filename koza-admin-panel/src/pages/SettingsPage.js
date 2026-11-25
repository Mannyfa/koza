import React, { useMemo, useState } from 'react';
import { api } from '../api/client';
import { useFeedback } from '../components/Feedback';
import useCachedResource from '../hooks/useCachedResource';

const EMPTY_FORM = { name: '', email: '', password: '', role: 'editor' };
const loadAdmins = () => api('/admin/users');

// --- Settings Page (Superadmin Only) ---
const SettingsPage = () => {
    const { notify, confirm } = useFeedback();
    const { data, setData: setAdmins, loading, reload, error } = useCachedResource('admins', loadAdmins);
    const admins = useMemo(() => data || [], [data]);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [creating, setCreating] = useState(false);
    const [removingId, setRemovingId] = useState(null);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await api('/admin/register', { method: 'POST', body: formData });
            notify(`${formData.name} can now sign in as ${formData.role}`);
            setFormData(EMPTY_FORM);
            reload(); // the server does not return the new account, so refresh the list quietly
        } catch (err) {
            notify(err.message, 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteAdmin = async (admin) => {
        const ok = await confirm({
            title: 'Remove this admin?',
            message: `${admin.name} (${admin.email}) will no longer be able to sign in.`,
            confirmLabel: 'Remove',
            tone: 'danger',
        });
        if (!ok) return;
        setRemovingId(admin._id);
        try {
            await api(`/admin/users/${admin._id}`, { method: 'DELETE' });
            setAdmins((list) => (list || []).filter((a) => a._id !== admin._id));
            notify(`${admin.name} removed`);
        } catch (err) {
            notify(err.message, 'error');
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-bold mb-6">System Settings & Permissions</h1>
            <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-lg mb-4">Create New Admin</h3>
                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <input type="text" placeholder="Full Name" aria-label="Full name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border rounded-md" />
                        <input type="email" placeholder="Email Address" aria-label="Email address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border rounded-md" />
                        <input type="password" placeholder="Password" aria-label="Password" required minLength="6" autoComplete="new-password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded-md" />
                        <select value={formData.role} aria-label="Role" onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded-md">
                            <option value="editor">Editor (View Only)</option>
                            <option value="manager">Manager (Manage Products & Orders)</option>
                            <option value="superadmin">Superadmin (Full Access)</option>
                        </select>
                        <button type="submit" disabled={creating} className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 disabled:opacity-60">
                            {creating ? 'Creating…' : 'Create Account'}
                        </button>
                    </form>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h3 className="font-bold text-lg mb-4">Active Admins</h3>
                    {loading ? (
                        <p className="text-sm text-gray-500">Loading…</p>
                    ) : error && admins.length === 0 ? (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                    ) : (
                        <ul className="divide-y">
                            {admins.map(admin => (
                                <li key={admin._id} className="py-3 flex justify-between items-center gap-3">
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-800">{admin.name} <span className="text-xs ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase tracking-wider">{admin.role}</span></p>
                                        <p className="text-sm text-gray-500 truncate">{admin.email}</p>
                                    </div>
                                    <button onClick={() => handleDeleteAdmin(admin)} disabled={removingId === admin._id} className="text-red-500 text-sm font-bold hover:text-red-700 disabled:opacity-50">
                                        {removingId === admin._id ? 'Removing…' : 'Remove'}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
