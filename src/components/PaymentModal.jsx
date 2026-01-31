import React, { useState } from 'react';
import { X, Check, Star, ShieldCheck, Loader } from 'lucide-react';
import { useProfile } from '../context/ProfileContext';
import { API_BASE_URL } from '../api/config';

const PaymentModal = ({ isOpen, onClose }) => {
    const { user, fetchUser, token } = useProfile();
    const [processing, setProcessing] = useState(false);
    const [step, setStep] = useState('OFFER'); // OFFER, PROCESSING, SUCCESS, FAILED

    if (!isOpen) return null;

    const handlePayment = async () => {
        setProcessing(true);
        try {
            // 1. Create Order
            const orderRes = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: 101, currency: 'INR' })
            });
            const orderData = await orderRes.json();

            // 2. Simulate Razorpay/Payment (Mock)
            // In real world, this opens Razorpay Modal
            await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay

            // 3. Verify Payment
            const verifyRes = await fetch(`${API_BASE_URL}/api/payments/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    order_id: orderData.id,
                    payment_id: `pay_${Math.random().toString(36).substring(7)}` // Mock Payment ID
                })
            });

            if (verifyRes.ok) {
                setStep('SUCCESS');
                await fetchUser(); // Refresh user to update limits
                setTimeout(() => {
                    onClose();
                    setStep('OFFER'); // Reset for next time
                }, 2000);
            } else {
                setStep('FAILED');
            }
        } catch (err) {
            console.error(err);
            setStep('FAILED');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white border border-gray-200 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-secondary hover:text-primary transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {step === 'OFFER' && (
                    <div className="space-y-6 text-center relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4">
                            <Star className="w-8 h-8 text-white fill-white" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-2">Unlock More Profiles</h2>
                            <p className="text-secondary">You've reached the free limit of 2 profiles. Upgrade to add family & friends!</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-3 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-1 rounded-full bg-green-100 text-green-600"><Check className="w-3 h-3" /></div>
                                <span className="text-sm text-secondary">Lifetime access to new profiles</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-1 rounded-full bg-green-100 text-green-600"><Check className="w-3 h-3" /></div>
                                <span className="text-sm text-secondary">Detailed Analytics & Reports</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-1 rounded-full bg-green-100 text-green-600"><Check className="w-3 h-3" /></div>
                                <span className="text-sm text-secondary">Support Independent Astrology</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <div className="text-3xl font-bold text-primary mb-1">₹101 <span className="text-sm font-normal text-secondary">/ profile</span></div>
                            <p className="text-xs text-slate-400 mb-6">One-time payment. No subscription.</p>

                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-bold text-white shadow-lg hover:shadow-orange-500/25 transition-all text-lg flex items-center justify-center gap-2"
                            >
                                {processing ? <Loader className="w-5 h-5 animate-spin" /> : 'Pay & Unlock'}
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-xs text-secondary">
                            <ShieldCheck className="w-3 h-3" /> Secure Payment via Razorpay
                        </div>
                    </div>
                )}

                {step === 'SUCCESS' && (
                    <div className="text-center py-8 space-y-4 relative z-10">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center mb-4">
                            <Check className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Payment Successful!</h2>
                        <p className="text-secondary">You've unlocked a new profile slot.</p>
                    </div>
                )}

                {step === 'FAILED' && (
                    <div className="text-center py-8 space-y-4 relative z-10">
                        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                            <X className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold text-primary">Payment Failed</h2>
                        <p className="text-secondary">Something went wrong. Please try again.</p>
                        <button onClick={() => setStep('OFFER')} className="text-purple-600 hover:text-purple-500 font-bold">Try Again</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
