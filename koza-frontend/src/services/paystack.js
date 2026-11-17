import { PAYSTACK_PUBLIC_KEY, PAYSTACK_SCRIPT_URL } from '../config/constants';

let scriptPromise = null;

/** Loads the Paystack inline script once and resolves when it is ready. */
const loadPaystack = () => {
    if (typeof window.PaystackPop !== 'undefined') return Promise.resolve();
    if (!scriptPromise) {
        scriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = PAYSTACK_SCRIPT_URL;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => {
                scriptPromise = null;
                reject(new Error('Could not load payment gateway.'));
            };
            document.body.appendChild(script);
        });
    }
    return scriptPromise;
};

/**
 * Opens the Paystack payment popup.
 * @param {{ email: string, amount: number, metadata?: object, onSuccess: Function, onClose: Function }} options
 *        `amount` is in Naira; it is converted to kobo here.
 */
export const openPaystackPopup = async ({ email, amount, metadata, onSuccess, onClose }) => {
    await loadPaystack();
    const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount: Math.round(amount * 100),
        ref: Date.now().toString(),
        metadata,
        onClose,
        callback: (response) => onSuccess(response.reference),
    });
    handler.openIframe();
};
