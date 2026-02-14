import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Chrome, Star, Sparkles, Heart } from 'lucide-react';
import SEO from '../components/SEO';

const Login = () => {
    const { login } = useProfile();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            errors.email = 'Email is required';
        } else if (!emailRegex.test(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');
        try {
            const success = await login(email, password);
            if (success) {
                navigate('/profiles');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            console.error("Login Error Details:", err);
            setError(`Login Failed: ${err.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <SEO
                    title="Login"
                    description="Access your personalized astrology dashboard. Sign in to view your saved charts, daily predictions, and premium reports."
                    url="/login"
                />
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest border border-purple-100">
                        <Heart className="w-3 h-3 fill-purple-600" />
                        Secure Access
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter">
                        Welcome <span className="text-purple-600">Back</span>
                    </h1>
                    <p className="text-secondary max-w-2xl mx-auto">
                        Connect with your cosmic path and unlock personalized astrological insights
                    </p>
                </div>

                {/* Login Form */}
                <div className="glass-panel p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center font-medium animate-in shake duration-500">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-secondary uppercase tracking-[0.2em] ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                <input
                                    type="email"
                                    className={`w-full p-4 pl-12 rounded-2xl border transition-all font-medium text-primary placeholder:text-gray-400 outline-none
                                        ${formErrors.email
                                            ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-100 bg-gray-50 focus:ring-2 focus:ring-purple-500'}
                                    `}
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (formErrors.email) setFormErrors(prev => ({ ...prev, email: '' }));
                                    }}
                                />
                            </div>
                            {formErrors.email && (
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">
                                    {formErrors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black text-secondary uppercase tracking-[0.2em]">
                                    Password
                                </label>
                                <a href="#" className="text-[10px] text-purple-600 font-bold uppercase tracking-wider hover:text-purple-700 transition-colors">
                                    Forgot?
                                </a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                                <input
                                    type="password"
                                    className={`w-full p-4 pl-12 rounded-2xl border transition-all font-medium text-primary placeholder:text-gray-400 outline-none
                                        ${formErrors.password
                                            ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-100 bg-gray-50 focus:ring-2 focus:ring-purple-500'}
                                    `}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (formErrors.password) setFormErrors(prev => ({ ...prev, password: '' }));
                                    }}
                                />
                            </div>
                            {formErrors.password && (
                                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1 mt-1">
                                    {formErrors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-full font-black uppercase text-sm tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3
                                ${loading
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-purple-500/25'}
                            `}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <LogIn className="w-5 h-5" />
                            )}
                            {loading ? 'Authenticating...' : 'Secure Login'}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                            <span className="bg-white px-4 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 hover:border-purple-200 transition-all text-primary text-xs font-bold">
                            <Chrome className="w-5 h-5 text-purple-600" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 hover:border-purple-200 transition-all text-primary text-xs font-bold">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            Apple
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-secondary text-sm">
                    New to AstroPinch?{' '}
                    <Link to="/register" className="text-purple-600 font-bold hover:text-purple-700 transition-colors underline decoration-purple-200 hover:decoration-purple-400">
                        Create your cosmic profile
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
