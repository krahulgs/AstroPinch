import React, { useEffect, useState } from 'react';
import { useChart } from '../context/ChartContext';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Sparkles, ArrowLeft, Compass, Heart, Briefcase, Coins, Home } from 'lucide-react';

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
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const signParam = routeSign || searchParams.get('sign');
        let sign = signParam || chartData?.sun_sign;

        if (sign) {
            // Standardize casing (e.g. "aries" -> "Aries")
            sign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
            if (horoscopes[sign]) {
                setSelectedSign(sign);
                fetchDynamicHoroscope(sign);
            }
        }
    }, [searchParams, chartData, routeSign, i18n.language]);

    const fetchDynamicHoroscope = async (sign) => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/horoscope/${sign}?lang=${i18n.language}`);
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

    if (!selectedSign && (!userData || !chartData)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in">
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                    <Sun className="w-20 h-20 text-amber-400 animate-spin-slow relative z-10" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-5xl font-black text-indigo-950 tracking-tighter uppercase italic">{t('horoscope.empty_state.title')}</h2>
                    <p className="text-slate-600 max-w-lg mx-auto font-medium">
                        {t('horoscope.empty_state.description')}
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link to="/" className="px-8 py-4 bg-indigo-900 text-white rounded-full font-black uppercase text-sm hover:scale-105 transition-transform shadow-lg">
                        Browse Signs
                    </Link>
                    <Link to="/chart" className="px-8 py-4 bg-white text-black rounded-full font-black uppercase text-sm hover:scale-105 transition-transform">
                        Enter Details
                    </Link>
                </div>
            </div>
        );
    }

    const currentSign = selectedSign || chartData?.sun_sign;
    const displayPrediction = dynamicData?.prediction || horoscopes[currentSign] || "The stars are currently recalibrating for your journey. Check back shortly.";

    return (
        <div className="min-h-screen flex flex-col justify-center max-w-7xl mx-auto space-y-12 py-10 px-6">
            <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors font-black uppercase text-xs tracking-widest group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to universe
            </Link>

            <div className="text-center space-y-4 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/5 blur-[100px] -z-10"></div>
                <span className="text-amber-500 font-black tracking-[0.4em] uppercase text-xs">{t('common.daily_guidance')}</span>
                <h2 className="text-6xl sm:text-7xl font-black text-primary tracking-tighter leading-none uppercase italic">
                    {t('horoscope.title', { sign: currentSign })}
                </h2>
                <div className="flex items-center justify-center gap-3 text-secondary font-bold uppercase text-xs tracking-widest">
                    <Sparkles className="w-4 h-4" />
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    <Sparkles className="w-4 h-4" />
                </div>
            </div>

            <div className={`relative p-12 md:p-16 rounded-3xl overflow-hidden group transition-opacity duration-500 bg-white border border-indigo-100 shadow-2xl ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50"></div>

                {/* Decorative sun icon */}
                <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 group-hover:rotate-12 transition-all duration-1000">
                    <Sun className="w-40 h-40 text-amber-500" />
                </div>

                <div className="relative z-10 space-y-12">
                    {/* Main prediction text */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-indigo-100 rounded-full border border-violet-200">
                            <Sparkles className="w-4 h-4 text-violet-700" />
                            <span className="text-xs font-bold text-violet-900 uppercase tracking-wider font-serif">{t('common.todays_insight')}</span>
                        </div>

                        <p className="text-2xl md:text-3xl text-indigo-950 leading-relaxed font-serif italic">
                            "{displayPrediction.split(' ').map((word, i) => {
                                const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
                                const aspects = ['Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile'];
                                const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

                                const cleanWord = word.replace(/[.,!?]/g, '');
                                if (planets.includes(cleanWord)) {
                                    return <span key={i} className="text-amber-600 font-bold">{word} </span>;
                                } else if (aspects.includes(cleanWord)) {
                                    return <span key={i} className="text-purple-600 font-bold">{word} </span>;
                                } else if (signs.includes(cleanWord)) {
                                    return <span key={i} className="text-blue-600 font-bold">{word} </span>;
                                }
                                return word + ' ';
                            })}"
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Energy Level */}
                        <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest font-serif">{t('horoscope.stats.energy')}</p>
                            <div className="flex gap-1.5">
                                {Array.from({ length: dynamicData?.energy_level || 4 }).map((_, i) => <div key={i} className="w-full h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>)}
                                {Array.from({ length: 5 - (dynamicData?.energy_level || 4) }).map((_, i) => <div key={i} className="w-full h-2 bg-amber-100 rounded-full"></div>)}
                            </div>
                        </div>

                        {/* Lucky Number */}
                        <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100">
                            <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest font-serif">{t('horoscope.stats.lucky_number')}</p>
                            <p className="text-3xl font-serif font-bold text-indigo-700">{dynamicData?.lucky_number || '27'}</p>
                        </div>

                        {/* Lucky Color */}
                        <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 border border-violet-100">
                            <p className="text-[10px] font-bold text-violet-800 uppercase tracking-widest font-serif">{t('horoscope.stats.lucky_color')}</p>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: dynamicData?.lucky_color?.replace(' ', '').toLowerCase() || '#fbbf24' }}></div>
                                <p className="text-sm font-bold text-violet-900 uppercase font-serif">{dynamicData?.lucky_color || 'Indigo'}</p>
                            </div>
                        </div>

                        {/* Mood */}
                        <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest font-serif">{t('horoscope.stats.mood')}</p>
                            <p className="text-sm font-bold text-emerald-900 uppercase tracking-wide font-serif">{dynamicData?.mood || 'Neutral'}</p>
                        </div>
                    </div>

                    {dynamicData?.categories && (
                        <div className="space-y-8 pt-10 border-t border-indigo-100">
                            <h3 className="text-3xl font-serif text-indigo-950 flex items-center gap-3 italic">
                                <Moon className="w-6 h-6 text-violet-600" />
                                {t('horoscope.categories.title')}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.entries(dynamicData.categories).map(([key, cat]) => {
                                    if (key === 'remedies') return null;

                                    const categoryStyles = {
                                        love: {
                                            borderColor: "border-rose-100",
                                            bgColor: "bg-rose-50/30",
                                            badgeColor: "bg-rose-100 text-rose-700",
                                            iconColor: "text-rose-500",
                                            titleColor: "text-rose-950",
                                            summaryColor: "text-rose-900",
                                            detailColor: "text-rose-700 border-rose-200"
                                        },
                                        career: {
                                            borderColor: "border-sky-100",
                                            bgColor: "bg-sky-50/30",
                                            badgeColor: "bg-sky-100 text-sky-700",
                                            iconColor: "text-sky-500",
                                            titleColor: "text-sky-950",
                                            summaryColor: "text-sky-900",
                                            detailColor: "text-sky-700 border-sky-200"
                                        },
                                        finance: {
                                            borderColor: "border-emerald-100",
                                            bgColor: "bg-emerald-50/30",
                                            badgeColor: "bg-emerald-100 text-emerald-700",
                                            iconColor: "text-emerald-500",
                                            titleColor: "text-emerald-950",
                                            summaryColor: "text-emerald-900",
                                            detailColor: "text-emerald-700 border-emerald-200"
                                        },
                                        family: {
                                            borderColor: "border-amber-100",
                                            bgColor: "bg-amber-50/30",
                                            badgeColor: "bg-amber-100 text-amber-700",
                                            iconColor: "text-amber-500",
                                            titleColor: "text-amber-950",
                                            summaryColor: "text-amber-900",
                                            detailColor: "text-amber-700 border-amber-200"
                                        }
                                    };

                                    const style = categoryStyles[key] || categoryStyles.love;

                                    return (
                                        <div key={key} className={`p-8 rounded-2xl border ${style.borderColor} ${style.bgColor} hover:shadow-xl hover:-translate-y-1 transition-all duration-500`}>
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 ${style.badgeColor} rounded-full flex items-center justify-center`}>
                                                        {key === 'love' && <Heart className="w-5 h-5" />}
                                                        {key === 'career' && <Briefcase className="w-5 h-5" />}
                                                        {key === 'finance' && <Coins className="w-5 h-5" />}
                                                        {key === 'family' && <Home className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className={`text-lg font-serif font-bold capitalize ${style.titleColor}`}>{cat.title}</h4>
                                                        <p className="text-xs text-slate-500 font-medium tracking-wider uppercase">{cat.status}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="space-y-4">
                                                <p className={`text-lg leading-relaxed font-serif ${style.summaryColor}`}>
                                                    {cat.summary}
                                                </p>
                                                <div className="space-y-3 pt-2">
                                                    {cat.details?.map((detail, i) => (
                                                        <p key={i} className={`text-sm leading-relaxed pl-4 border-l-2 italic ${style.detailColor}`}>
                                                            {detail}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {dynamicData.categories.remedies && (
                                <div className="mt-12">
                                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 to-indigo-900 p-8 md:p-12 text-white shadow-2xl">
                                        <div className="absolute top-0 right-0 p-12 opacity-10">
                                            <Sparkles className="w-64 h-64" />
                                        </div>

                                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                                            <div className="space-y-6">
                                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                                    <Sparkles className="w-8 h-8 text-amber-300" />
                                                </div>
                                                <div>
                                                    <h4 className="text-3xl font-serif italic mb-2">Cosmic Remedy</h4>
                                                    <p className="text-indigo-200 text-sm font-medium tracking-wider uppercase">Priority Solution</p>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8">
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-amber-300 uppercase tracking-widest">Physical</p>
                                                    <p className="text-indigo-100 text-sm leading-relaxed">{dynamicData.categories.remedies.solution?.physical}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-violet-300 uppercase tracking-widest">Meditative</p>
                                                    <p className="text-indigo-100 text-sm leading-relaxed">{dynamicData.categories.remedies.solution?.meditative}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-sky-300 uppercase tracking-widest">Behavioral</p>
                                                    <p className="text-indigo-100 text-sm leading-relaxed">{dynamicData.categories.remedies.solution?.behavioral}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {dynamicData?.aspects && dynamicData.aspects.length > 0 && (
                        <div className="space-y-8 pt-10 border-t border-indigo-100">
                            <div>
                                <h4 className="text-2xl font-serif text-indigo-950 flex items-center gap-3 italic">
                                    <Sparkles className="w-6 h-6 text-indigo-500" />
                                    {t('horoscope.cosmic_alignment')}
                                </h4>
                                <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-2xl">
                                    {t('horoscope.alignment_desc')}
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {dynamicData.aspects.map((aspect, idx) => (
                                    <div key={idx} className="p-6 rounded-2xl flex items-center justify-between group bg-white border border-indigo-50 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-indigo-50 rounded-full text-indigo-600">
                                                {aspect.symbol}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-indigo-900 font-serif">
                                                    {aspect.p1} {t(`horoscope.aspects.${aspect.type}`)} {aspect.p2}
                                                </p>
                                                <p className="text-xs text-slate-500 font-medium tracking-wide">
                                                    Orb: {aspect.orb}°
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${aspect.type === 'Trine' || aspect.type === 'Sextile' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {aspect.type === 'Trine' || aspect.type === 'Sextile' ? t('horoscope.aspects.harmonious') : t('horoscope.aspects.challenging')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-8 border-t border-indigo-100">
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                <Compass className="w-4 h-4" /> {t('horoscope.transit_status')}
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                                {t('horoscope.transit_desc')}
                            </p>
                        </div>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
                            {dynamicData?.transits && Object.entries(dynamicData.transits).map(([planet, sign]) => (
                                <span key={planet} className="text-xs bg-white px-3 py-1.5 rounded-full text-indigo-900 border border-indigo-100 whitespace-nowrap shadow-sm font-medium">
                                    <span className="font-bold text-indigo-600 uppercase">{planet}</span> in {sign}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="text-slate-400 italic text-[10px] uppercase tracking-[0.2em] pt-4 text-center">
                        {userData?.name ? `Personalized for ${userData.name}. ` : ""}
                        Generated by unified cosmic engine.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 rounded-3xl bg-indigo-900 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <h4 className="text-xl font-serif italic text-indigo-200">{t('horoscope.spiritual_focus')}</h4>
                        <p className="text-indigo-50 leading-relaxed font-light">
                            {t('horoscope.spiritual_focus_desc')}
                        </p>
                    </div>
                </div>
                <div className="p-8 rounded-3xl bg-white border border-amber-100 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sun className="w-32 h-32 text-amber-500" />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <h4 className="text-xl font-serif italic text-amber-600">{t('horoscope.cosmic_note')}</h4>
                        <p className="text-slate-600 leading-relaxed">
                            {t('horoscope.cosmic_note_desc', { moon: dynamicData?.transits?.moon || 'Moon' })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Horoscope;
