import React, { useEffect, useState } from 'react';
import { useChart } from '../context/ChartContext';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Sparkles, ArrowLeft, Compass, Heart, Briefcase, Coins, Home, Star } from 'lucide-react';
import { API_BASE_URL } from '../api/config';

const horoscopes = {
    Aries: "Today is a day for action. Your energy is high, and obstacles seem smaller than usual.",
    Taurus: "Focus on stability and comfort. A good meal or a walk in nature will ground you.",
    Gemini: "Communication is key. Reach out to an old friend or clarify a misunderstanding.",
    Cancer: "Your intuition is heightened. Trust your gut feelings regarding family matters.",
    Leo: "Shine bright! Your charisma is drawing positive attention from those around you.",
    Virgo: "Details matter today. A small error caught now saves time later.",
    Libra: "Balance is within reach. You find it easier to see both sides of an argument.",
    Scorpio: "Intensity can be productive. Channel your passion into a creative project.",
    Sagittarius: "Adventure calls. Even a small detour on your way home can bring inspiration.",
    Capricorn: "Hard work pays off. You are closer to your goal than you think.",
    Aquarius: "Innovation strikes. Don't be afraid to propose an unconventional solution.",
    Pisces: "Dream big, but keep one foot on the ground. artistic pursuits are favored."
};

const Horoscope = () => {
    const { userData, chartData } = useChart();
    const [searchParams] = useSearchParams();
    const { sign: routeSign } = useParams();
    const [selectedSign, setSelectedSign] = useState(null);
    const [dynamicData, setDynamicData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTechnical, setShowTechnical] = useState(false);
    const { t, i18n } = useTranslation();

    const zodiacSigns = [
        { name: 'Aries', symbol: '♈' }, { name: 'Taurus', symbol: '♉' },
        { name: 'Gemini', symbol: '♊' }, { name: 'Cancer', symbol: '♋' },
        { name: 'Leo', symbol: '♌' }, { name: 'Virgo', symbol: '♍' },
        { name: 'Libra', symbol: '♎' }, { name: 'Scorpio', symbol: '♏' },
        { name: 'Sagittarius', symbol: '♐' }, { name: 'Capricorn', symbol: '♑' },
        { name: 'Aquarius', symbol: '♒' }, { name: 'Pisces', symbol: '♓' }
    ];

    const fetchDynamicHoroscope = async (sign) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/horoscope/${sign}?lang=${i18n.language}`);
            if (response.ok) {
                const data = await response.json();
                setDynamicData(data);
            }
        } catch (error) {
            console.error("Failed to fetch dynamic horoscope:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const signParam = routeSign || searchParams.get('sign');
        // Default to Aries if no sign is specified
        let sign = signParam || chartData?.sun_sign || 'Aries';

        if (sign) {
            // Standardize casing (e.g. "aries" -> "Aries")
            sign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
            if (horoscopes[sign]) {
                setSelectedSign(sign);
                fetchDynamicHoroscope(sign);
            }
        }
    }, [searchParams, chartData, routeSign, i18n.language]);

    // Removed blocking empty state to ensure page always renders with a default or selected sign


    const currentSign = selectedSign || chartData?.sun_sign || 'Aries';
    const displayPrediction = dynamicData?.prediction || horoscopes[currentSign] || "The stars are currently recalibrating for your journey. Check back shortly.";

    return (
        <div className="min-h-screen max-w-7xl mx-auto py-10 px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold uppercase text-xs tracking-widest mb-8">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            {/* 1. Sign Selector Bar (Professional Navigation) */}
            <div className="mb-12 overflow-x-auto pb-4 no-scrollbar">
                <div className="flex gap-3 justify-start md:justify-center min-w-max">
                    {zodiacSigns.map((z) => (
                        <Link
                            key={z.name}
                            to={`/horoscope/${z.name.toLowerCase()}`}
                            className={`flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all duration-200 ${currentSign === z.name
                                ? 'bg-indigo-900 border-indigo-900 text-white shadow-lg scale-110 z-10'
                                : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'
                                }`}
                        >
                            <span className="text-2xl mb-1">{z.symbol}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wide">{z.name.slice(0, 3)}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 2. Main Hero Section */}
            <div className="text-center space-y-4 mb-12">
                <span className="inline-block py-1 px-4 rounded-full bg-amber-50 text-amber-600 font-bold uppercase text-[10px] tracking-widest border border-amber-100">
                    Daily Guidance
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic">
                    {t('horoscope.title', { sign: currentSign })}
                </h1>
                <p className="text-slate-500 font-medium tracking-wide uppercase text-sm">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
            </div>

            <div className={`space-y-12 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>

                {/* 3. Prediction & Key Stats Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-900/5 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 space-y-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <h3 className="text-2xl md:text-4xl text-slate-800 leading-snug font-serif italic mb-8">
                                "{displayPrediction}"
                            </h3>
                            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto rounded-full opacity-50"></div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-slate-100 pt-10">
                            {[
                                { label: t('horoscope.stats.energy'), value: `${(dynamicData?.energy_level || 4) * 20}%`, icon: "⚡", color: "text-amber-500" },
                                { label: t('horoscope.stats.lucky_number'), value: dynamicData?.lucky_number || '27', icon: "#", color: "text-indigo-500" },
                                { label: t('horoscope.stats.lucky_color'), value: dynamicData?.lucky_color || 'Indigo', icon: "🎨", color: "text-fuchsia-500" },
                                { label: t('horoscope.stats.mood'), value: dynamicData?.mood || 'Neutral', icon: "☺", color: "text-emerald-500" },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center p-4 rounded-2xl bg-slate-50/50">
                                    <span className={`text-2xl mb-2 ${stat.color}`}>{stat.icon}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">{stat.label}</span>
                                    <span className="text-lg font-bold text-slate-900">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. Life Areas Grid (Clean & Professional) */}
                {dynamicData?.categories && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(dynamicData.categories).map(([key, cat]) => {
                            if (key === 'remedies') return null;

                            const icons = {
                                love: <Heart className="w-6 h-6 text-rose-500" />,
                                career: <Briefcase className="w-6 h-6 text-indigo-500" />,
                                finance: <Coins className="w-6 h-6 text-emerald-500" />,
                                family: <Home className="w-6 h-6 text-amber-500" />
                            };

                            const styles = {
                                love: "bg-rose-50/30 border-rose-100 hover:border-rose-200",
                                career: "bg-indigo-50/30 border-indigo-100 hover:border-indigo-200",
                                finance: "bg-emerald-50/30 border-emerald-100 hover:border-emerald-200",
                                family: "bg-amber-50/30 border-amber-100 hover:border-amber-200"
                            };

                            return (
                                <div key={key} className={`p-8 rounded-[2rem] border ${styles[key] || styles.love} transition-all duration-300 hover:shadow-lg`}>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                                            {icons[key] || <Star className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-900 capitalize">{cat.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={`w-2 h-2 rounded-full ${key === 'love' ? 'bg-rose-400' : 'bg-indigo-400'}`}></div>
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cat.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium mb-6">
                                        {cat.summary}
                                    </p>
                                    <ul className="space-y-3">
                                        {cat.details?.map((detail, idx) => (
                                            <li key={idx} className="flex gap-3 text-sm text-slate-500">
                                                <span className="text-slate-300 transform translate-y-1">●</span>
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 5. Daily Power Actions (Remedies) */}
                {dynamicData?.categories?.remedies?.solution && (
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-10">
                                <Sparkles className="w-8 h-8 text-amber-400" />
                                <h3 className="text-3xl font-serif italic">Daily Power Actions</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { title: "Physical", body: dynamicData.categories.remedies.solution.physical, color: "bg-amber-500" },
                                    { title: "Mental", body: dynamicData.categories.remedies.solution.meditative, color: "bg-indigo-500" },
                                    { title: "Spiritual", body: dynamicData.categories.remedies.solution.behavioral, color: "bg-rose-500" },
                                ].map((action, i) => (
                                    <div key={i} className="flex flex-col gap-4">
                                        <div className={`w-12 h-1 ${action.color} rounded-full`}></div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-2">{action.title} Focus</h4>
                                            <p className="text-slate-300 leading-relaxed text-sm">
                                                {action.body}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 6. Technical Details (Collapsible for Cleanliness) */}
                <div className="border-t border-slate-200 pt-8 text-center">
                    <button
                        onClick={() => setShowTechnical(!showTechnical)}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        {showTechnical ? "Hide Planetary Alignments" : "View Planetary Alignments"}
                        {showTechnical ? <Compass className="w-4 h-4 rotate-180" /> : <Compass className="w-4 h-4" />}
                    </button>

                    {showTechnical && dynamicData?.aspects && (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4 fade-in duration-300 text-left">
                            {dynamicData.aspects.map((aspect, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-700">
                                        {aspect.p1} {aspect.symbol} {aspect.p2}
                                    </span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">{aspect.type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Horoscope;
