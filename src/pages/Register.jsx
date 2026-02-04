import React, { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Calendar, Clock, MapPin, Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const Register = () => {
    const { register } = useProfile();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        preferred_lang: 'en'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const success = await register(formData);
            if (success) {
                // Registration successful, token is set in context
                // Now we can either redirect to profile creation or finish
                navigate('/profiles');
            } else {
                setError('Registration failed. Email might already be in use.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepNumbers = () => (
        <div className="flex items-center justify-center gap-3 mb-12">
            {[1, 2].map((num) => (
                <div key={num} className="flex items-center">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all duration-500 ${step >= num ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-gray-200 text-gray-500'}`}>
                        {step > num ? <CheckCircle2 className="w-4 h-4" /> : num}
                    </div>
                    {num < 2 && <div className={`w-12 h-0.5 mx-1 rounded-full transition-all duration-1000 ${step > num ? 'bg-primary' : 'bg-gray-200'}`} />}
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex shadow-inner relative overflow-hidden">
            {/* Split Screen Design */}
            <div className="hidden lg:flex w-1/2 bg-primary/5 relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-primary/10 blur-[150px] rounded-full" />

                <div className="relative z-10 text-center max-w-lg">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-[2rem] mx-auto mb-10 flex items-center justify-center shadow-2xl rotate-6 animate-pulse">
                        <Sparkles className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-5xl font-black text-primary leading-tight mb-6">Your cosmic journey begins here.</h2>
                    <p className="text-secondary text-lg leading-relaxed">Join 10,000+ users discovering their true path through authentic Vedic & Western insights.</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md">
                    {renderStepNumbers()}

                    <div className="glass-panel p-10 rounded-[3rem] bg-white border border-primary/10 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-xs text-center font-bold">
                                    {error}
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-primary mb-1">Create Account</h3>
                                        <p className="text-secondary text-sm mb-6">Enter your details to secure your soul's data.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-primary text-sm focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-gray-400"
                                                placeholder="Full Name"
                                                value={formData.full_name}
                                                onChange={(e) => {
                                                    const filteredValue = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                                    setFormData({ ...formData, full_name: filteredValue });
                                                }}
                                            />
                                        </div>

                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-primary text-sm focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-gray-400"
                                                placeholder="Email Address"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="w-full py-4 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs tracking-widest uppercase"
                                    >
                                        Next Step
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right duration-500">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold text-primary mb-1">Set Password</h3>
                                        <p className="text-secondary text-sm mb-6">Finalize your credentials for Astropinch.</p>
                                    </div>

                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-primary text-sm focus:outline-none focus:border-primary/50 transition-all font-medium placeholder:text-gray-400"
                                            placeholder="Secure Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleBack}
                                            className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-secondary font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs tracking-widest uppercase"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-[2] py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-xs tracking-widest uppercase"
                                        >
                                            {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Complete Setup'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    <p className="text-center mt-8 text-secondary text-sm">
                        Existing User?{' '}
                        <Link to="/login" className="text-primary font-bold hover:text-blue-600 transition-colors">
                            Sign in to your soul
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
