import React, { useState } from 'react';
import { X, Bell, Save, Phone, Calendar, Clock } from 'lucide-react';
import { API_BASE_URL } from '../api/config';

const AlertConfigModal = ({ profile, onClose, token, onUpdate }) => {
    const [phoneNumber, setPhoneNumber] = useState(profile.phone_number || '');
    const [alertDaily, setAlertDaily] = useState(!!profile.alert_daily);
    const [alertWeekly, setAlertWeekly] = useState(!!profile.alert_weekly);
    const [alertMonthly, setAlertMonthly] = useState(!!profile.alert_monthly);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/api/profiles/${profile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    alert_daily: alertDaily,
                    alert_weekly: alertWeekly,
                    alert_monthly: alertMonthly,
                    alert_active: true // Always activate if saving settings
                })
            });

            if (res.ok) {
                const updatedProfile = await res.json();
                onUpdate(updatedProfile);

                // Alert if phone changed (only if valid phone)
                if (phoneNumber && phoneNumber !== profile.phone_number) {
                    alert(`Preferences saved! A confirmation alert has been sent to ${phoneNumber}.`);
                }

                onClose();
            } else {
                const data = await res.json();
                setError(data.detail || 'Failed to update settings');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <h3 className="font-bold text-base">Alert Settings</h3>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="p-4 space-y-4 max-h-[85vh] overflow-y-auto">
                    <div className="text-xs text-slate-500 text-center">
                        Configure alerts for <span className="font-bold text-slate-700">{profile.name}</span>
                    </div>

                    {error && (
                        <div className="text-red-600 bg-red-50 p-2.5 rounded-lg text-xs">{error}</div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-500" /> Mobile Number
                        </label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="Enter mobile number"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-300"
                        />
                        <p className="text-[10px] text-slate-400">Number where alerts will be sent.</p>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-500" /> Frequency
                        </h4>

                        <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-full transition-colors ${alertDaily ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 group-hover:bg-white'}`}>
                                    <Clock className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-slate-900">Daily Insights</div>
                                    <div className="text-[10px] text-slate-500">Daily horoscope & guidance</div>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={alertDaily}
                                onChange={(e) => setAlertDaily(e.target.checked)}
                                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                            />
                        </label>

                        <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-full transition-colors ${alertWeekly ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400 group-hover:bg-white'}`}>
                                    <Calendar className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-slate-900">Weekly Forecast</div>
                                    <div className="text-[10px] text-slate-500">Major transits & predictions</div>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={alertWeekly}
                                onChange={(e) => setAlertWeekly(e.target.checked)}
                                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                            />
                        </label>

                        <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors group">
                            <div className="flex items-center gap-2.5">
                                <div className={`p-1.5 rounded-full transition-colors ${alertMonthly ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400 group-hover:bg-white'}`}>
                                    <Calendar className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <div className="font-medium text-sm text-slate-900">Monthly Overview</div>
                                    <div className="text-[10px] text-slate-500">Deep dive into the month ahead</div>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={alertMonthly}
                                onChange={(e) => setAlertMonthly(e.target.checked)}
                                className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-gray-300"
                            />
                        </label>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                        >
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Preferences
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlertConfigModal;
