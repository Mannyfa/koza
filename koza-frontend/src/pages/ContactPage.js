import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import PageHeader from '../components/common/PageHeader';
import { MailIcon, WhatsAppIcon } from '../components/icons';
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '../config/constants';
import { sendContactMessage } from '../services/api';
import { btnPrimary, card, inputUnderline, linkUnderline, pageShell } from '../styles/classNames';

const SUBJECTS = ['General enquiry', 'Order enquiry', 'Training & courses', 'Wholesale / bulk order', 'Other'];
const EMPTY_FORM = { name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' };

const ContactDetail = ({ icon, label, children }) => (
    <div className="flex items-start gap-4">
        <div className="w-10 h-10 flex items-center justify-center border border-gray-300 dark:border-gray-700 text-[#111] dark:text-white flex-shrink-0">{icon}</div>
        <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">{label}</p>
            <div className="text-sm text-[#111] dark:text-white">{children}</div>
        </div>
    </div>
);

const ContactPage = ({ onNavigate }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null); // { ok: boolean, message: string }

    const update = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        setResult(null);
        try {
            const data = await sendContactMessage(form);
            setResult({ ok: true, message: data.message || 'Thank you! We will get back to you shortly.' });
            setForm(EMPTY_FORM);
        } catch (error) {
            setResult({ ok: false, message: error.message });
        } finally {
            setSending(false);
        }
    };

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello Opevicky, I have a question.')}`;

    return (
        <motion.div {...pageMotionProps} className={pageShell}>
            <div className="max-w-screen-xl mx-auto px-6 lg:px-12">
                <PageHeader title="Contact Us" subtitle="We usually reply within one business day." size="lg" />

                <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                    {/* Details */}
                    <div className="lg:col-span-4 space-y-8 mb-16 lg:mb-0">
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Questions about a fragrance, an order or our training? Send us a message, or reach us directly on WhatsApp for the fastest reply.
                        </p>
                        <ContactDetail icon={<WhatsAppIcon />} label="WhatsApp">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-60 transition-opacity">+{WHATSAPP_NUMBER}</a>
                        </ContactDetail>
                        <ContactDetail icon={<MailIcon />} label="Email">
                            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:opacity-60 transition-opacity break-all">{CONTACT_EMAIL}</a>
                        </ContactDetail>
                        <div className={`${card} p-6`}>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-2">Already ordered?</p>
                            <p className="text-xs text-gray-500 leading-relaxed mb-4">Check where your order is without signing in.</p>
                            <button onClick={() => onNavigate('track')} className={linkUnderline}>Track Your Order</button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className={`${card} p-8 sm:p-12 space-y-6`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <input name="name" required maxLength={100} placeholder="FULL NAME" aria-label="Full name" value={form.name} onChange={update} className={inputUnderline} />
                                <input name="email" type="email" required maxLength={200} placeholder="EMAIL ADDRESS" aria-label="Email address" value={form.email} onChange={update} className={inputUnderline} />
                                <input name="phone" type="tel" maxLength={40} placeholder="PHONE (OPTIONAL)" aria-label="Phone number" value={form.phone} onChange={update} className={inputUnderline} />
                                <select name="subject" aria-label="Subject" value={form.subject} onChange={update} className={`${inputUnderline} uppercase`}>
                                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <textarea name="message" required rows={6} maxLength={3000} placeholder="YOUR MESSAGE" aria-label="Message" value={form.message} onChange={update} className={`${inputUnderline} resize-y`} />

                            {result && (
                                <p role="status" className={`text-xs tracking-widest uppercase p-4 border ${result.ok ? 'border-green-600 text-green-700 dark:text-green-400' : 'border-red-300 text-red-500'}`}>
                                    {result.message}
                                </p>
                            )}

                            <button type="submit" disabled={sending} className={`w-full sm:w-auto px-12 py-4 ${btnPrimary}`}>
                                {sending ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactPage;
