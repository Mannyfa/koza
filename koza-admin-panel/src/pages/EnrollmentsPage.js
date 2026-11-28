import React, { useMemo, useState } from 'react';
import { api } from '../api/client';
import { useFeedback } from '../components/Feedback';
import { SearchIcon } from '../components/Icons';
import { canManage, ENROLLMENT_STATUSES, ENROLLMENT_STATUS_STYLES } from '../config';
import useCachedResource from '../hooks/useCachedResource';
import { downloadCsv } from '../utils/helpers';

const loadEnrollments = async () => (await api('/admin/enrollments')).enrollments || [];
const FORMAT_LABELS = { online: 'Online', physical: 'Physical' };
const formatDate = (date) => (date ? new Date(date).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' }) : '');

/** Paid places on the "Learn with Opevicky" courses, paid through Paystack on the storefront. */
const EnrollmentsPage = ({ adminRole }) => {
    const { notify } = useFeedback();
    const { data, setData, loading, refreshing, error } = useCachedResource('enrollments', loadEnrollments);
    const enrollments = useMemo(() => data || [], [data]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const counts = useMemo(() => enrollments.reduce((acc, e) => {
        acc[e.status] = (acc[e.status] || 0) + 1;
        return acc;
    }, {}), [enrollments]);

    const revenue = useMemo(() => enrollments
        .filter((e) => e.status !== 'Refunded')
        .reduce((sum, e) => sum + (e.amount || 0), 0), [enrollments]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return enrollments.filter((e) =>
            (statusFilter === 'All' || e.status === statusFilter) &&
            (!q || [e.student?.name, e.student?.email, e.student?.phone, e.courseTitle, e.reference]
                .some((field) => String(field || '').toLowerCase().includes(q)))
        );
    }, [enrollments, statusFilter, search]);

    const updateStatus = async (enrollment, status) => {
        if (status === enrollment.status) return;
        const previous = enrollment.status;
        const swap = (value) => setData((list) => (list || []).map((e) => (e._id === enrollment._id ? { ...e, status: value } : e)));
        swap(status);
        setUpdatingId(enrollment._id);
        try {
            await api(`/admin/enrollments/${enrollment._id}/status`, { method: 'PATCH', body: { status } });
            notify(`${enrollment.student?.name || 'Student'} marked ${status}.`);
        } catch (err) {
            swap(previous);
            notify(err.message, 'error');
        } finally {
            setUpdatingId(null);
        }
    };

    const exportCsv = () => {
        const header = ['Date', 'Status', 'Course', 'Class', 'Amount (NGN)', 'Student', 'Email', 'Phone', 'Paystack reference'];
        const rows = visible.map((e) => [
            formatDate(e.date), e.status, e.courseTitle, FORMAT_LABELS[e.format] || e.format, e.amount,
            e.student?.name, e.student?.email, e.student?.phone, e.reference,
        ]);
        downloadCsv(`opevicky-enrollments-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
        notify(`Exported ${rows.length} enrollment${rows.length === 1 ? '' : 's'}`, 'info');
    };

    if (loading) return <div className="p-4 sm:p-8 text-center mt-10">Loading Enrollments...</div>;
    if (error && enrollments.length === 0) return <div className="p-4 sm:p-8"><div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div></div>;

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                        Course Enrollments
                        {refreshing && <span className="text-xs font-normal text-slate-400">Refreshing…</span>}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Paid through the Learn page · {enrollments.length} student{enrollments.length === 1 ? '' : 's'} · ₦{revenue.toLocaleString()} received
                    </p>
                </div>
                <button onClick={exportCsv} disabled={visible.length === 0} className="bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-50 disabled:opacity-50 text-sm font-medium transition">
                    Export to spreadsheet (CSV)
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
                    {['All', ...ENROLLMENT_STATUSES].map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)} aria-pressed={statusFilter === s}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${statusFilter === s ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-gray-300 hover:border-slate-500'}`}>
                            {s} <span className="opacity-60">{s === 'All' ? enrollments.length : counts[s] || 0}</span>
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                    <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, phone or course"
                        aria-label="Search enrollments"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm" />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[860px]">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-3 sm:p-4 font-semibold text-sm">Date</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm">Student</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm">Course</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm">Paid</th>
                                <th className="p-3 sm:p-4 font-semibold text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {visible.map((e) => (
                                <tr key={e._id} className="hover:bg-slate-50 transition align-top">
                                    <td className="p-3 sm:p-4 text-sm text-slate-600 whitespace-nowrap">{formatDate(e.date)}</td>
                                    <td className="p-3 sm:p-4">
                                        <div className="font-medium text-sm">{e.student?.name}</div>
                                        <a href={`mailto:${e.student?.email}`} className="block text-xs text-blue-600 hover:underline">{e.student?.email}</a>
                                        <a href={`tel:${e.student?.phone}`} className="block text-xs text-blue-600 hover:underline">{e.student?.phone}</a>
                                    </td>
                                    <td className="p-3 sm:p-4">
                                        <div className="text-sm font-medium">{e.courseTitle}</div>
                                        <div className="text-xs text-slate-500">{FORMAT_LABELS[e.format] || e.format} class</div>
                                    </td>
                                    <td className="p-3 sm:p-4">
                                        <div className="text-sm font-medium">₦{Number(e.amount || 0).toLocaleString()}</div>
                                        <div className="text-[11px] text-slate-400 font-mono break-all">{e.reference}</div>
                                    </td>
                                    <td className="p-3 sm:p-4">
                                        {canManage(adminRole) ? (
                                            <select value={e.status} disabled={updatingId === e._id} onChange={(ev) => updateStatus(e, ev.target.value)}
                                                aria-label={`Status for ${e.student?.name}`}
                                                className="border rounded p-1 sm:p-2 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px] disabled:opacity-60">
                                                {ENROLLMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${ENROLLMENT_STATUS_STYLES[e.status] || ''}`}>{e.status}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {visible.length === 0 && (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">{enrollments.length ? 'No enrollments match these filters.' : 'No course enrollments yet.'}</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Refunds are made in the Paystack dashboard; mark the student Refunded here afterwards.</p>
        </div>
    );
};

export default EnrollmentsPage;
