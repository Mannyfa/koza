import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import * as api from '../services/api';
import { btnPrimary, card, inputBox, linkMuted } from '../styles/classNames';

const VIEWS = { LOGIN: 'login', REGISTER: 'register', FORGOT: 'forgot', RESET: 'reset' };

const submitBtn = `w-full py-4 ${btnPrimary}`;

const AuthHeading = ({ title, subtitle }) => (
    <div className="mb-10 text-center border-b border-gray-200 dark:border-gray-800 pb-8">
        <h2 className={`text-2xl font-black uppercase tracking-[0.2em] text-[#111] dark:text-white ${subtitle ? 'mb-2' : ''}`}>{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 tracking-widest uppercase">{subtitle}</p>}
    </div>
);

const AuthPage = ({ onLogin, onNavigate }) => {
    const [authView, setAuthView] = useState(VIEWS.LOGIN);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [resetEmail, setResetEmail] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const isLogin = authView === VIEWS.LOGIN;

    const withLoading = async (fn) => {
        setLoading(true);
        try {
            await fn();
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        withLoading(async () => {
            try {
                const data = isLogin ? await api.login(email, password) : await api.register(email, password);
                onLogin(data.token, data.user ? data.user : data);
                onNavigate('home');
            } catch (error) {
                alert(error.message);
            }
        });
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        withLoading(async () => {
            try {
                await api.forgotPassword(resetEmail);
                setAuthView(VIEWS.RESET);
            } catch (error) {
                alert(error.message || 'Failed to send reset code.');
            }
        });
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        withLoading(async () => {
            try {
                await api.resetPassword(resetEmail, resetCode, newPassword);
                alert('Password successfully reset.');
                setAuthView(VIEWS.LOGIN);
            } catch (error) {
                alert(error.message || 'Failed to reset password.');
            }
        });
    };

    const cancelButton = (
        <div className="text-center">
            <button type="button" onClick={() => setAuthView(VIEWS.LOGIN)} className={linkMuted}>Cancel</button>
        </div>
    );

    return (
        <motion.div {...pageMotionProps} className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A] py-32 px-4 sm:px-6">
            <div className={`max-w-md w-full p-10 ${card}`}>

                {(authView === VIEWS.LOGIN || authView === VIEWS.REGISTER) && (
                    <>
                        <AuthHeading title={isLogin ? 'Sign In' : 'Create Account'} />
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="auth-email" className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                                    <input id="auth-email" type="email" autoComplete="email" required className={inputBox} value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="auth-password" className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Password</label>
                                    <input id="auth-password" type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} required minLength="6" className={inputBox} value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>

                            {isLogin && (
                                <div className="text-right">
                                    <button type="button" onClick={() => { setAuthView(VIEWS.FORGOT); setResetEmail(email); }} className="text-[10px] uppercase tracking-widest font-bold text-gray-500 hover:text-[#111] dark:hover:text-white transition-colors">
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <div className="pt-4">
                                <button disabled={loading} type="submit" className={submitBtn}>
                                    {loading ? 'Processing...' : (isLogin ? 'Authenticate' : 'Register')}
                                </button>
                            </div>
                            <div className="text-center mt-6">
                                <button type="button" onClick={() => setAuthView(isLogin ? VIEWS.REGISTER : VIEWS.LOGIN)} className={linkMuted}>
                                    {isLogin ? 'Create an account' : 'Return to sign in'}
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {authView === VIEWS.FORGOT && (
                    <form className="space-y-6" onSubmit={handleForgotPassword}>
                        <AuthHeading title="Reset Password" subtitle="Enter email for recovery code" />
                        <input type="email" required placeholder="EMAIL ADDRESS" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} className={`${inputBox} text-xs tracking-widest uppercase`} />
                        <button disabled={loading} type="submit" className={submitBtn}>
                            {loading ? 'Sending...' : 'Send Code'}
                        </button>
                        {cancelButton}
                    </form>
                )}

                {authView === VIEWS.RESET && (
                    <form className="space-y-6" onSubmit={handleResetPassword}>
                        <AuthHeading title="Enter Code" subtitle={`Sent to ${resetEmail}`} />
                        <div className="space-y-4">
                            <input type="text" inputMode="numeric" autoComplete="one-time-code" required placeholder="6-DIGIT CODE" value={resetCode} onChange={(e) => setResetCode(e.target.value)} maxLength={6} className={`${inputBox} text-center text-xl tracking-[0.5em] font-bold`} />
                            <input type="password" autoComplete="new-password" required minLength="6" placeholder="NEW PASSWORD" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={`${inputBox} text-xs tracking-widest uppercase`} />
                        </div>
                        <button disabled={loading} type="submit" className={submitBtn}>
                            {loading ? 'Verifying...' : 'Update Password'}
                        </button>
                        {cancelButton}
                    </form>
                )}
            </div>
        </motion.div>
    );
};

export default AuthPage;
