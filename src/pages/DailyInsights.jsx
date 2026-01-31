import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../api/config';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    Star, Heart, Briefcase, DollarSign, Activity,
    AlertTriangle, Calendar as CalendarIcon,
    ArrowLeft, Bell, Sparkles, Moon
} from 'lucide-react';

const DailyInsights = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const profile = location.state?.profile;

    // Derived from profile or defaults
    const sign = profile?.western_sign || 'Aries'; // Fallback if not computed yet, or passed from backend

    const [activeTab, setActiveTab] = useState('love');
    const [loading, setLoading] = useState(true);
    const [insights, setInsights] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        if (!profile) return;

        const fetchDailyData = async () => {
            setLoading(true);
            try {
                // Post to /api/insights/daily with profile details and language
                const payload = { ...profile, lang: i18n.language };
                const response = await fetch(`${API_BASE_URL}/api/insights/daily`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    setInsights(data.horoscope);
                    setAlerts(data.alerts);
                }
            } catch (err) {
                console.error("Failed to fetch daily insights", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDailyData();
    }, [profile, i18n.language]);

    if (!profile) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <p className="text-slate-400">No profile selected.</p>
                <div className="mt-4">
                    <Link to="/profiles" className="text-purple-400 hover:text-purple-300">Back to Profiles</Link>
                </div>
            </div>
        );
    }

    const categories = {
        love: { icon: Heart, label: t('daily.categories.love'), color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
        career: { icon: Briefcase, label: t('daily.categories.career'), color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        finance: { icon: DollarSign, label: t('daily.categories.finance'), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
        health: { icon: Activity, label: t('daily.categories.health'), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/profiles')} className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm">
                    <ArrowLeft className="w-5 h-5 text-primary" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
                        {t('daily.title')} <span className="text-purple-600 text-lg font-normal">{t('daily.for')} {profile.name}</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-secondary text-sm">
                            {new Date().toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        {insights?.source && (
                            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-white text-slate-500 border border-gray-200 shadow-sm">
                                {t('daily.powered_by')} {insights.source}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Alerts & Calendar Link */}
                <div className="space-y-6">

                    {/* Cosmic Alerts */}
                    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden bg-white border border-gray-100 shadow-xl">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Bell className="w-24 h-24 text-primary" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <Bell className="w-5 h-5 text-amber-500" />
                            <h3 className="text-lg font-bold text-primary">{t('daily.alerts.title')}</h3>
                        </div>

                        {loading ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-10 bg-gray-100 rounded"></div>
                                <div className="h-10 bg-gray-100 rounded"></div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alerts.length > 0 ? alerts.map((alert, idx) => (
                                    <div key={idx} className={`p-3 rounded-xl border flex items-start gap-3
                                        ${alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                                            alert.severity === 'medium' ? 'bg-orange-50 border-orange-200' :
                                                'bg-blue-50 border-blue-200'}
                                    `}>
                                        <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 
                                            ${alert.severity === 'high' ? 'text-red-500' :
                                                alert.severity === 'medium' ? 'text-orange-500' : 'text-blue-500'}
                                        `} />
                                        <div>
                                            <h4 className={`text-sm font-bold 
                                                 ${alert.severity === 'high' ? 'text-red-700' :
                                                    alert.severity === 'medium' ? 'text-orange-700' : 'text-blue-700'}
                                            `}>{alert.title}</h4>
                                            <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-4 text-secondary text-sm">
                                        {t('daily.alerts.no_warnings')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Calendar Link Card */}
                    <Link to="/calendar" className="block group">
                        <div className="glass-panel p-6 rounded-3xl hover:bg-gray-50 transition-colors border border-gray-100 hover:border-purple-200 shadow-xl relative overflow-hidden bg-white">
                            <div className="absolute top-0 right-0 p-4 opacity-5 transform group-hover:scale-110 transition-transform">
                                <CalendarIcon className="w-24 h-24 text-primary" />
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="w-5 h-5 text-purple-600" />
                                    <h3 className="text-lg font-bold text-primary">{t('daily.calendar.title')}</h3>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-slate-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </div>
                            <p className="text-sm text-secondary">{t('daily.calendar.desc')}</p>
                        </div>
                    </Link>

                    {/* Quick Stats */}
                    {!loading && insights && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="glass-panel p-4 rounded-2xl text-center bg-white border border-gray-100 shadow-xl">
                                <div className="text-xs text-secondary uppercase font-bold">{t('daily.stats.lucky_color')}</div>
                                <div className="text-lg font-bold text-primary mt-1" style={{ color: insights.lucky_color === 'Gold' ? '#fbbf24' : insights.lucky_color }}>
                                    {insights.lucky_color}
                                </div>
                            </div>
                            <div className="glass-panel p-4 rounded-2xl text-center bg-white border border-gray-100 shadow-xl">
                                <div className="text-xs text-secondary uppercase font-bold">{t('daily.stats.lucky_number')}</div>
                                <div className="text-2xl font-black text-primary mt-1">{insights.lucky_number}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Daily Horoscope Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-1 rounded-2xl flex flex-wrap gap-1 bg-white border border-gray-100 shadow-lg">
                        {Object.entries(categories).map(([key, cat]) => {
                            const Icon = cat.icon;
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all
                                        ${isActive
                                            ? `${cat.bg} ${cat.color} ${cat.border} border shadow-md`
                                            : 'text-slate-400 hover:text-primary hover:bg-gray-50'}
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="glass-panel p-8 rounded-3xl min-h-[400px] bg-white border border-gray-100 shadow-xl">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center space-y-4">
                                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
                                    <p className="text-secondary animate-pulse">{t('daily.reading_stars')}</p>
                                </div>
                            </div>
                        ) : insights && insights.categories[activeTab] ? (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className={`text-2xl font-bold mb-2 ${categories[activeTab].color}`}>
                                            {insights.categories[activeTab].title}
                                        </h2>
                                        <div className="text-lg text-primary font-medium">
                                            {insights.categories[activeTab].summary}
                                        </div>
                                    </div>
                                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${categories[activeTab].border} ${categories[activeTab].color} ${categories[activeTab].bg}`}>
                                        {insights.categories[activeTab].status}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {insights.categories[activeTab].details.map((detail, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="mt-1">
                                                <Sparkles className={`w-4 h-4 ${categories[activeTab].color} opacity-70`} />
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">{detail}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-primary font-bold mb-4 flex items-center gap-2">
                                        <Moon className="w-4 h-4 text-purple-600" />
                                        {t('daily.advice.title')}
                                    </h3>
                                    <p className="text-secondary text-sm italic">
                                        "{insights.prediction}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 py-12">
                                {t('daily.error_load')}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DailyInsights;
