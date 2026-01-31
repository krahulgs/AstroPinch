import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Github, Chrome, Star, Sparkles } from 'lucide-react';

const Login = () => {
    const { login } = useProfile();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/5 blur-[120px] rounded-full" />

            <div className="w-full max-w-md relative">
                {/* Logo Area */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Welcome Back</h1>
                    <p className="text-secondary text-sm mt-2">Connect with your cosmic path</p>
                </div>

                {/* Login Form */}
                <div className="glass-panel p-8 rounded-[2.5rem] bg-white border border-primary/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-500 text-xs text-center font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-secondary uppercase tracking-widest">Password</label>
                                <a href="#" className="text-[10px] text-primary font-bold uppercase tracking-wider hover:text-blue-600 transition-colors">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-400"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
                            Secure Login
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                            <span className="bg-white px-4 text-gray-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all text-primary text-xs font-bold">
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                                <Chrome className="w-3 h-3 text-primary" />
                            </div>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all text-primary text-xs font-bold">
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                <LogIn className="w-3 h-3 text-primary" />
                            </div>
                            Apple
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-secondary text-sm">
                    New to Astropinch?{' '}
                    <Link to="/register" className="text-primary font-bold hover:text-blue-600 transition-colors">
                        Create your cosmic profile
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
