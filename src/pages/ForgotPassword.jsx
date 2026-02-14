
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { API_BASE_URL } from '../api/config';
import SEO from '../components/SEO';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                setStatus('success');
                setMessage('If an account confirms to this email, a reset link has been sent. Please check your inbox (or console in dev).');
            } else {
                throw new Error('Request failed');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <SEO title="Forgot Password" description="Reset your AstroPinch password" url="/forgot-password" />

            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                            <Mail className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                        <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
                    </div>

                    {status === 'success' ? (
                        <div className="text-center space-y-6">
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm">
                                {message}
                            </div>
                            <Link
                                to="/login"
                                className="inline-flex items-center text-primary font-medium hover:underline"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="text-red-500 text-sm text-center">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === 'loading' ? (
                                    'Sending...'
                                ) : (
                                    <>
                                        Send Reset Link <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <Link to="/login" className="text-sm text-gray-500 hover:text-primary transition-colors inline-flex items-center">
                                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
