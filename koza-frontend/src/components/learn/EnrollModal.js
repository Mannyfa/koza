import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchCoursePrice, verifyEnrollment } from '../../services/api';
import { openPaystackPopup } from '../../services/paystack';
import { btnPrimary, inputBox, linkUnderline } from '../../styles/classNames';
import { formatPrice } from '../../utils/formatters';
import { CheckCircleIcon } from '../icons';

const EMPTY_STUDENT = { name: '', email: '', phone: '' };

/**
 * Enroll-and-pay dialog for one course. Collects the student's details, charges the
 * server's price through Paystack, then asks the server to verify and record the enrollment.
 * `selection` is { course, format } or null when closed.
 */
const EnrollModal = ({ selection, defaultEmail = '', onClose }) => {
    const [format, setFormat] = useState('online');
    const [student, setStudent] = useState(EMPTY_STUDENT);
    const [step, setStep] = useState('form'); // form | paying | verifying | done | pending
    const [error, setError] = useState('');
    const [result, setResult] = useState(null); // { reference, message }

    const course = selection && selection.course;

    // Fresh form each time a course is opened
    useEffect(() => {
        if (!selection) return;
        setFormat(selection.format);
        setStudent({ ...EMPTY_STUDENT, email: defaultEmail });
        setStep('form');
        setError('');
        setResult(null);
    }, [selection, defaultEmail]);

    const busy = step === 'paying' || step === 'verifying';
    const close = () => { if (!busy) onClose(); };

    useEffect(() => {
        if (!selection) return undefined;
        const onKey = (e) => { if (e.key === 'Escape' && !busy) onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selection, busy, onClose]);

    if (!course) return <AnimatePresence />;

    const price = course.prices.find((p) => p.format === format) || course.prices[0];
    const handleChange = (e) => setStudent((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const isValid = student.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email.trim()) && student.phone.trim();

    const confirmPayment = async (reference, details) => {
        setStep('verifying');
        try {
            await verifyEnrollment(reference, course.id, format, details);
            setResult({ reference });
            setStep('done');
        } catch (e) {
            // Paystack has taken the money, so never ask the student to pay again
            setResult({
                reference,
                message: (e.data && e.data.paymentReceived && e.message)
                    || `Your payment was received (reference ${reference}). We could not confirm your enrollment automatically, but our team has been notified and will contact you shortly. Please do not pay again.`,
            });
            setStep('pending');
        }
    };

    const handlePay = async (e) => {
        e.preventDefault();
        if (!isValid || busy) return;
        setError('');
        setStep('paying');
        const details = { name: student.name.trim(), email: student.email.trim(), phone: student.phone.trim() };
        try {
            const amount = await fetchCoursePrice(course.id, format);
            await openPaystackPopup({
                email: details.email,
                amount,
                // Read back by the server (and its Paystack webhook) to record the enrollment
                metadata: {
                    type: 'enrollment',
                    courseId: course.id,
                    format,
                    student: details,
                    custom_fields: [
                        { display_name: 'Course', variable_name: 'course', value: `${course.title} (${price.label})` },
                        { display_name: 'Phone', variable_name: 'phone', value: details.phone },
                    ],
                },
                onClose: () => setStep('form'),
                onSuccess: (reference) => confirmPayment(reference, details),
            });
        } catch (err) {
            setError(err.message || 'Could not start the payment. Please try again.');
            setStep('form');
        }
    };

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/80 backdrop-blur-sm overflow-y-auto"
                role="dialog" aria-modal="true" aria-labelledby="enroll-title">
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white dark:bg-[#0A0A0A] p-8 sm:p-12 max-w-lg w-full border border-gray-200 dark:border-gray-800 rounded-none my-8">
                    {!busy && (
                        <button onClick={close} aria-label="Close" className="absolute top-4 right-4 text-gray-400 hover:text-[#111] dark:hover:text-white text-2xl leading-none p-2">×</button>
                    )}

                    {step === 'done' || step === 'pending' ? (
                        <div className="text-center" role="status">
                            <div className="mb-6 flex justify-center"><CheckCircleIcon /></div>
                            <h3 id="enroll-title" className="text-xl font-black uppercase tracking-widest text-[#111] dark:text-white mb-4">
                                {step === 'done' ? "You're Enrolled" : 'Payment Received'}
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6">
                                {step === 'done'
                                    ? `Thank you, ${student.name.trim()}. Your place on ${course.title} (${price.label}) is reserved. A confirmation has been sent to ${student.email.trim()} and our team will contact you with your class schedule.`
                                    : result.message}
                            </p>
                            <div className="border border-gray-200 dark:border-gray-800 p-4 mb-8 text-left">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Payment reference</p>
                                <p className="text-sm font-mono text-[#111] dark:text-white break-all select-all">{result.reference}</p>
                            </div>
                            <button onClick={onClose} className={`w-full py-4 ${btnPrimary}`}>Done</button>
                        </div>
                    ) : (
                        <form onSubmit={handlePay} noValidate>
                            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-2">Enroll & Pay</p>
                            <h3 id="enroll-title" className="text-xl font-medium text-[#111] dark:text-white mb-8 leading-tight pr-8">{course.title}</h3>

                            <fieldset className="mb-8">
                                <legend className="text-[10px] font-bold tracking-widest uppercase text-[#111] dark:text-white mb-3">Class type</legend>
                                <div className="grid grid-cols-2 gap-3">
                                    {course.prices.map((option) => (
                                        <label key={option.format} className={`cursor-pointer border p-4 transition-colors ${format === option.format ? 'border-[#111] dark:border-white' : 'border-gray-200 dark:border-gray-800 hover:border-gray-400'}`}>
                                            <input type="radio" name="format" value={option.format} checked={format === option.format}
                                                onChange={() => setFormat(option.format)} disabled={busy} className="sr-only" />
                                            <span className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">{option.label}</span>
                                            <span className="block text-base font-medium text-[#111] dark:text-white">{formatPrice(option.amount)}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <div className="space-y-4 mb-8">
                                <input name="name" value={student.name} onChange={handleChange} placeholder="Full name" aria-label="Full name" autoComplete="name" disabled={busy} className={inputBox} required />
                                <input name="email" type="email" value={student.email} onChange={handleChange} placeholder="Email address" aria-label="Email address" autoComplete="email" disabled={busy} className={inputBox} required />
                                <input name="phone" type="tel" value={student.phone} onChange={handleChange} placeholder="Phone / WhatsApp number" aria-label="Phone number" autoComplete="tel" disabled={busy} className={inputBox} required />
                            </div>

                            {error && <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>}

                            <button type="submit" disabled={!isValid || busy} className={`w-full py-4 ${btnPrimary}`}>
                                {step === 'verifying' ? 'Confirming payment…' : step === 'paying' ? 'Processing…' : `Pay ${formatPrice(price.amount)}`}
                            </button>
                            <p className="text-[10px] text-gray-400 text-center mt-4 tracking-wide">Secure payment by Paystack. We'll contact you with your class schedule.</p>
                            {!busy && (
                                <div className="text-center mt-6">
                                    <button type="button" onClick={close} className={linkUnderline}>Cancel</button>
                                </div>
                            )}
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default EnrollModal;
