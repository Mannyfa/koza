import React, { useState } from 'react';
import { api } from '../api/client';
import { useFeedback } from './Feedback';
import useCachedResource from '../hooks/useCachedResource';

const loadStatus = () => api('/admin/payments-status');

/** Shows whether the backend can talk to Paystack, and the webhook address to paste into Paystack. */
const PaymentsStatus = () => {
    const { notify } = useFeedback();
    const { data, loading, refreshing, reload, error } = useCachedResource('payments-status', loadStatus);
    const [copied, setCopied] = useState(false);

    const copyWebhook = async () => {
        try {
            await navigator.clipboard.writeText(data.webhookUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            notify('Could not copy. Select the address and copy it manually.', 'error');
        }
    };

    const tone = !data ? 'border-gray-200' : data.ok ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50';

    return (
        <div className={`p-6 rounded-xl shadow-sm border ${tone}`}>
            <div className="flex justify-between items-start gap-3 mb-3">
                <h3 className="font-bold text-lg">Payments (Paystack)</h3>
                <button onClick={reload} disabled={refreshing} className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50">
                    {refreshing ? 'Checking…' : 'Check again'}
                </button>
            </div>

            {loading ? (
                <p className="text-sm text-gray-500">Checking the connection to Paystack…</p>
            ) : error && !data ? (
                <p className="text-sm text-red-700">{error}</p>
            ) : data && (
                <>
                    <p className={`text-sm font-bold mb-1 ${data.ok ? 'text-green-700' : 'text-red-700'}`} role="status">
                        {data.ok ? '✓ Payments can be confirmed' : '✕ Payments cannot be confirmed'}
                    </p>
                    <p className="text-sm text-slate-700 mb-4">{data.message}</p>

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Webhook address</p>
                    <p className="text-xs text-slate-500 mb-2">
                        Paste this into Paystack → Settings → API Keys &amp; Webhooks → <strong>Live Webhook URL</strong>.
                        Paystack then tells the store about every successful payment, so orders are created even if a customer closes the page.
                    </p>
                    <div className="flex gap-2">
                        <input readOnly value={data.webhookUrl} onFocus={(e) => e.target.select()} aria-label="Webhook address"
                            className="flex-1 min-w-0 p-2 border rounded-md bg-white text-xs font-mono" />
                        <button onClick={copyWebhook} className="px-3 py-2 rounded-md bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 whitespace-nowrap">
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentsStatus;
