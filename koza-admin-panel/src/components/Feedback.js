import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { XIcon } from './Icons';

// In-app notices (toasts) and confirmation dialogs, replacing the browser's alert() and confirm().

const FeedbackContext = createContext(null);

const TOAST_STYLES = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-slate-800',
};

const ConfirmDialog = ({ request, onAnswer }) => {
    const confirmRef = useRef(null);
    useEffect(() => {
        if (!request) return undefined;
        confirmRef.current?.focus();
        const onKey = (e) => { if (e.key === 'Escape') onAnswer(false); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [request, onAnswer]);

    if (!request) return null;
    const danger = request.tone === 'danger';
    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" role="presentation" onClick={() => onAnswer(false)}>
            <div role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message"
                className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
                <h2 id="confirm-title" className="text-lg font-bold text-slate-900 mb-2">{request.title}</h2>
                {request.message && <p id="confirm-message" className="text-sm text-slate-600 mb-6">{request.message}</p>}
                <div className="flex justify-end gap-3">
                    <button onClick={() => onAnswer(false)} className="px-4 py-2 rounded-md border border-gray-300 text-slate-700 hover:bg-slate-50 text-sm font-medium">
                        {request.cancelLabel || 'Cancel'}
                    </button>
                    <button ref={confirmRef} onClick={() => onAnswer(true)}
                        className={`px-4 py-2 rounded-md text-white text-sm font-bold ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {request.confirmLabel || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const FeedbackProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [confirmRequest, setConfirmRequest] = useState(null);
    const resolverRef = useRef(null);
    const nextId = useRef(1);

    const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

    const notify = useCallback((message, type = 'success') => {
        const id = nextId.current++;
        setToasts((list) => [...list.slice(-3), { id, message, type }]);
        setTimeout(() => dismiss(id), type === 'error' ? 6000 : 3500);
    }, [dismiss]);

    /** Shows a confirmation dialog and resolves to true/false. */
    const confirm = useCallback((request) => new Promise((resolve) => {
        resolverRef.current = resolve;
        setConfirmRequest(request);
    }), []);

    const answer = useCallback((value) => {
        setConfirmRequest(null);
        if (resolverRef.current) resolverRef.current(value);
        resolverRef.current = null;
    }, []);

    return (
        <FeedbackContext.Provider value={{ notify, confirm }}>
            {children}
            <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[70] flex flex-col gap-2 items-stretch sm:items-end" aria-live="polite">
                {toasts.map((t) => (
                    <div key={t.id} role={t.type === 'error' ? 'alert' : 'status'}
                        className={`${TOAST_STYLES[t.type] || TOAST_STYLES.info} text-white text-sm font-medium rounded-lg shadow-lg px-4 py-3 flex items-start gap-3 sm:max-w-sm`}>
                        <span className="flex-1">{t.message}</span>
                        <button onClick={() => dismiss(t.id)} className="opacity-80 hover:opacity-100 -mr-1" aria-label="Dismiss"><XIcon /></button>
                    </div>
                ))}
            </div>
            <ConfirmDialog request={confirmRequest} onAnswer={answer} />
        </FeedbackContext.Provider>
    );
};

/** { notify(message, 'success'|'error'|'info'), confirm({ title, message, confirmLabel, tone }) => Promise<boolean> } */
export const useFeedback = () => useContext(FeedbackContext);
