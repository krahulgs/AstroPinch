import React from 'react';
import { API_BASE_URL } from '../api/config';
import { useTranslation } from 'react-i18next';
import { useChart } from '../context/ChartContext';
import { Navigate, Link } from 'react-router-dom';
import { Hash, Sparkles, Brain, Heart, User as UserIcon, Calendar, TrendingUp, AlertTriangle, Target } from 'lucide-react';
import SEO from '../components/SEO';

const Numerology = () => {
    const { t, i18n } = useTranslation();
    const { userData, numerologyData: contextNumerologyData, consolidatedReport } = useChart();
    const [numerologyData, setNumerologyData] = React.useState(contextNumerologyData);
    const [loading, setLoading] = React.useState(false);

    // Sync with context initially or when it updates
    React.useEffect(() => {
        if (contextNumerologyData) {
            setNumerologyData(contextNumerologyData);
        }
    }, [contextNumerologyData]);

    // Re-fetch when language changes
    React.useEffect(() => {
        if (!userData || !i18n.language) return;

        const fetchLocalizedNumerology = async () => {
            setLoading(true);
            try {
                // Construct payload similar to ChartContext
                const [year, month, day] = userData.date.split('-').map(Number);
                const [hour, minute] = userData.time.split(':').map(Number);

                const payload = {
                    name: userData.name,
                    year,
                    month,
                    day,
                    hour,
                    minute,
                    city: userData.place,
                    lat: userData.lat,
                    lng: userData.lng,
                    timezone: userData.timezone || "UTC",
                    profession: userData.profession,
                    marital_status: userData.marital_status,
                    lang: i18n.language
                };

                const response = await fetch(`${API_BASE_URL}/api/numerology`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const data = await response.json();
                    setNumerologyData(data);
                }
            } catch (err) {
                console.error("Failed to fetch localized numerology", err);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if context data language (assumed en if missing) differs?
        // Actually context data doesn't explicitly store lang usually.
        // We just always fetch on lang change if we can.
        // To avoid double fetch on initial load (if context loads then this fires), we can debounce or just let it happen.
        // Simplest: Just fetch.
        fetchLocalizedNumerology();

    }, [i18n.language, userData]);


    if (!userData || !numerologyData) {
        return <Navigate to="/chart" replace />;
    }

    const getNumberColor = (type) => {
        const colors = {
            life_path: 'from-purple-500 to-indigo-600',
            expression: 'from-amber-500 to-orange-600',
            soul_urge: 'from-pink-500 to-rose-600',
            personality: 'from-blue-500 to-cyan-600',
            birthday: 'from-emerald-500 to-teal-600'
        };
        return colors[type] || 'from-gray-500 to-gray-600';
    };

    const getNumberIcon = (type) => {
        const icons = {
            life_path: Hash,
            expression: Sparkles,
            soul_urge: Heart,
            personality: UserIcon,
            birthday: Calendar
        };
        return icons[type] || Hash;
    };

    const getNumberTitle = (type) => {
        const titles = {
            life_path: t('numerology_page.core_numbers_title'), // Using generic title? No, specific keys needed.
            // Actually the keys are mapped in en.json under numerology. But let's use the new keys I added.
            // Wait, I added specific descriptions but titles?
            // "life_path": "Life Path Number" in en.json under "report.numerology"
            // Let's use `numerology_page.descriptions` for descriptions.
            // For titles, I can rely on report.numerology or add them to numerology_page.
            // en.json has report.numerology.life_path_number
        };
        // Let's map dynamically
        const keyMap = {
            life_path: 'life_path_number',
            expression: 'destiny_number', // Expression matches Destiny in some systems, check en.json
            soul_urge: 'soul_urge_number',
            personality: 'personality_number',
            birthday: 'birthday_number' // Need to check if this key exists
        }
        // Actually I added specific descriptions in `numerology_page.descriptions`.
        // Titles in `report.numerology` seem sufficient for headers.
        // Let's look at `en.json` again.
        // report.numerology.life_path_number = "Life Path Number"
        // report.numerology.destiny_number = "Destiny Number"
        // report.numerology.soul_urge_number = "Soul Urge Number"
        // report.numerology.personality_number = "Personality Number"

        // My code uses 'expression' which maps to 'expression number' usually.
        // I'll stick to hardcoded mapping to t keys.

        if (type === 'life_path') return t('report.numerology.life_path_number');
        if (type === 'expression') return t('report.numerology.destiny_number'); // Expression ~ Destiny
        if (type === 'soul_urge') return t('report.numerology.soul_urge_number');
        if (type === 'personality') return t('report.numerology.personality_number');
        if (type === 'birthday') return t('numerology_page.descriptions.birthday'); // Wait, birthday description is there, title?

        return type.replace('_', ' ').toUpperCase();
    };

    // Better strategy for titles: Use direct mapping with fallbacks
    const getTitle = (type) => {
        switch (type) {
            case 'life_path': return t('report.numerology.life_path_number');
            case 'expression': return t('report.numerology.destiny_number');
            case 'soul_urge': return t('report.numerology.soul_urge_number');
            case 'personality': return t('report.numerology.personality_number');
            case 'birthday': return t('numerology_page.birth_date'); // "Birth Date" is close enough or add "Birthday Number"
            default: return type;
        }
    }

    const getNumberDescription = (type) => {
        return t(`numerology_page.descriptions.${type}`);
    };

    const numbers = [
        { type: 'life_path', value: numerologyData.life_path },
        { type: 'expression', value: numerologyData.expression },
        { type: 'soul_urge', value: numerologyData.soul_urge },
        { type: 'personality', value: numerologyData.personality },
        { type: 'birthday', value: numerologyData.birthday }
    ];

    // Add Maturity Number if available
    if (numerologyData.maturity) {
        numbers.push({ type: 'maturity', value: numerologyData.maturity });
    }

    // Check if Phillips profile is available
    const phillipsProfile = numerologyData.phillips_profile;
    const hasPhillipsData = phillipsProfile && phillipsProfile.core_numbers;

    return (
        <div className="space-y-12 pb-20">
            <SEO
                title="Numerology Analysis"
                description="Discover your destiny with personalized numerology analysis. Insights on your Life Path, Destiny, and Soul numbers."
                url="/numerology"
            />
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-sm">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                </div>
            )}

            <div className="text-center space-y-4 pt-10 px-4">
                <span className="text-primary font-medium tracking-widest uppercase text-sm">{t('numerology_page.title')}</span>
                <h2 className="text-5xl font-black text-primary uppercase tracking-tighter italic">
                    {t('numerology_page.subtitle')}
                </h2>

                {/* User Info Card */}
                <div className="max-w-4xl mx-auto mt-10 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-[3rem] blur-2xl opacity-50"></div>
                    <div className="relative glass-panel p-8 md:p-10 rounded-[3rem] bg-white border border-primary/10 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Brain className="w-24 h-24 text-primary" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center relative z-10">
                            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-8 text-center md:text-left">
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{t('numerology_page.seeker')}</p>
                                <h3 className="text-2xl font-black text-primary truncate">{userData.name}</h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full mt-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{t('numerology_page.profile_label')}</span>
                                </div>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{t('numerology_page.birth_date')}</p>
                                    <p className="text-primary font-bold">
                                        {new Date(userData.date).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">{t('numerology_page.analysis_type')}</p>
                                    <p className="text-primary font-bold">
                                        {numerologyData.source === 'phillips' ? 'Phillips Pythagorean' :
                                            numerologyData.source === 'roxy' ? 'Roxy API' :
                                                numerologyData.source === 'rapidapi' ? 'RapidAPI' : 'Pythagorean System'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Numbers Grid */}
            <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                    <Hash className="w-8 h-8 text-primary" />
                    {t('numerology_page.core_numbers_title')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {numbers.map((num) => {
                        const Icon = getNumberIcon(num.type);
                        return (
                            <div key={num.type} className="relative group">
                                <div className={`absolute -inset-1 bg-gradient-to-r ${getNumberColor(num.type)} rounded-[2rem] blur-xl opacity-10 group-hover:opacity-20 transition duration-500`}></div>
                                <div className="relative glass-panel p-8 rounded-[2rem] bg-white border border-gray-100 hover:border-primary/20 transition-all duration-500 shadow-lg">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${getNumberColor(num.type)} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className={`text-5xl font-black bg-gradient-to-r ${getNumberColor(num.type)} bg-clip-text text-transparent`}>
                                            {num.value}
                                        </div>
                                    </div>
                                    <h4 className="text-lg font-black text-primary uppercase tracking-tight mb-2">
                                        {getTitle(num.type)}
                                    </h4>
                                    <p className="text-sm text-secondary leading-relaxed">
                                        {getNumberDescription(num.type)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Hilary Gerard's Science of Success Report */}
            {numerologyData.science_of_success && (
                <div className="max-w-6xl mx-auto px-4">
                    <h3 className="text-3xl font-black text-primary uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-amber-500" />
                        {t('numerology_page.science_success')}
                    </h3>

                    {/* Fadic Profile Card */}
                    <div className="relative group mb-12">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 rounded-[2.5rem] blur-2xl opacity-50"></div>
                        <div className="relative glass-panel p-8 md:p-12 rounded-[2.5rem] bg-white border border-amber-500/20 shadow-xl">
                            <div className="flex flex-col md:flex-row gap-10 items-center">
                                {/* Fadic Number Display */}
                                <div className="flex-shrink-0 text-center">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-amber-500/20 flex items-center justify-center bg-amber-50 relative">
                                        <span className="text-6xl md:text-7xl font-black text-amber-500">
                                            {numerologyData.science_of_success.fadic_number}
                                        </span>
                                        <div className="absolute -bottom-4 bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                                            {t('numerology_page.fadic_number')}
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Details */}
                                <div className="flex-grow text-center md:text-left space-y-4">
                                    <h4 className="text-2xl md:text-3xl font-black text-primary uppercase">
                                        {numerologyData.science_of_success.fadic_type}
                                    </h4>
                                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                        <span className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-secondary uppercase tracking-wider border border-gray-100">
                                            {t('numerology_page.symbol')}: {numerologyData.science_of_success.symbol}
                                        </span>
                                        {numerologyData.science_of_success.guidance?.lucky_colors?.map((c, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-secondary uppercase tracking-wider border border-gray-100">
                                                {t('numerology_page.color')}: {c}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-secondary leading-relaxed text-lg">
                                        {numerologyData.science_of_success.description}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                            <h5 className="text-green-600 font-bold uppercase text-xs mb-2 tracking-widest">{t('numerology_page.positive')}</h5>
                                            <p className="text-green-800 text-sm leading-relaxed">
                                                {numerologyData.science_of_success.qualities?.positive}
                                            </p>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                            <h5 className="text-red-500 font-bold uppercase text-xs mb-2 tracking-widest">{t('numerology_page.challenges')}</h5>
                                            <p className="text-red-800 text-sm leading-relaxed">
                                                {numerologyData.science_of_success.qualities?.negative}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Occupations */}
                        <div className="glass-panel p-8 rounded-[2rem] bg-white border border-gray-100 shadow-lg">
                            <h4 className="text-xl font-black text-blue-500 uppercase tracking-tight mb-6 flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                {t('numerology_page.occupations')}
                            </h4>
                            <div className="flex flex-wrap gap-3">
                                {numerologyData.science_of_success.guidance?.occupations?.map((job, idx) => (
                                    <span key={idx} className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-sm font-bold hover:bg-blue-100 transition-colors">
                                        {job}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Harmonies & Luck */}
                        <div className="glass-panel p-8 rounded-[2rem] bg-white border border-gray-100 shadow-lg">
                            <h4 className="text-xl font-black text-purple-500 uppercase tracking-tight mb-6 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                {t('numerology_page.harmonies')}
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <span className="text-secondary text-sm font-bold uppercase">{t('numerology_page.lucky_gems')}</span>
                                    <span className="text-primary font-medium text-right">
                                        {numerologyData.science_of_success.guidance?.lucky_gems?.join(", ")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <span className="text-secondary text-sm font-bold uppercase">{t('numerology_page.harmonious_numbers')}</span>
                                    <div className="flex gap-2">
                                        {numerologyData.science_of_success.guidance?.best_harmonies?.map((num) => (
                                            <span key={num} className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-xs font-bold text-purple-600 border border-purple-100">
                                                {num}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                                    <span className="text-secondary text-sm font-bold uppercase">{t('numerology_page.lucky_days')}</span>
                                    <span className="text-primary font-medium text-right">
                                        {numerologyData.science_of_success.guidance?.lucky_days?.join(", ")}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-secondary text-sm font-bold uppercase">{t('numerology_page.next_destiny')}</span>
                                    <span className="text-amber-500 font-black text-lg">
                                        {numerologyData.science_of_success.next_destiny_year}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Insights */}
            {numerologyData.ai_insights && (
                <div className="max-w-6xl mx-auto px-4">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                        <div className="relative glass-panel p-10 md:p-14 rounded-[3rem] bg-white border border-purple-500/20 overflow-hidden shadow-xl">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/5 blur-3xl rounded-full"></div>

                            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                                <div className="flex-shrink-0 space-y-4">
                                    <div className="w-16 h-16 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center">
                                        <Brain className="w-8 h-8 text-purple-500 animate-pulse" />
                                    </div>
                                    <div>
                                        <h4 className="text-2xl font-black text-primary uppercase italic tracking-tighter">{t('numerology_page.ai_insights.title')}</h4>
                                        <h4 className="text-2xl font-black text-purple-500 uppercase italic tracking-tighter">{t('numerology_page.ai_insights.subtitle')}</h4>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest">
                                            {numerologyData.source === 'groq-ai' ? `${t('numerology_page.ai_insights.generated_by')} Groq AI` :
                                                numerologyData.source === 'gemini-ai' ? `${t('numerology_page.ai_insights.generated_by')} Gemini AI` :
                                                    'Numerology Analysis'}
                                        </p>
                                        {numerologyData.ai_model && (
                                            <p className="text-[9px] font-bold text-secondary uppercase tracking-widest bg-gray-50 py-1 px-2 rounded inline-block border border-gray-100">
                                                {t('numerology_page.ai_insights.model')}: {numerologyData.ai_model}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-grow space-y-6">
                                    <div className="prose prose-slate max-w-none">
                                        <div className="text-secondary leading-relaxed whitespace-pre-line">
                                            {numerologyData.ai_insights}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium CTA Section */}
            <div className="max-w-5xl mx-auto px-4">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    <div className="relative glass-panel p-10 md:p-16 rounded-[3rem] text-center space-y-8 bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-500/5 blur-3xl rounded-full"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full"></div>

                        <div className="relative z-10 space-y-4">
                            <h3 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-tight italic">
                                {t('numerology_page.cta.title')}
                            </h3>
                            <p className="text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
                                {t('numerology_page.cta.desc')}
                            </p>
                        </div>

                        <div className="flex justify-center pt-4 relative z-10">
                            <Link
                                to="/report/consolidated"
                                state={{
                                    userData: userData,
                                    preFetchedReport: contextNumerologyData ? consolidatedReport : null
                                }}
                                className="group/btn relative px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-black uppercase text-sm tracking-[0.2em] transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_-15px_rgba(124,58,237,0.4)] flex items-center gap-3 overflow-hidden shadow-xl"
                            >
                                <span className="relative z-10">{t('numerology_page.cta.detail_analysis')}</span>
                                <Sparkles className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                            </Link>
                        </div>

                        {/* Floating elements for modern look */}
                        <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2">
                            <Hash className="w-20 h-20 text-purple-900/5 rotate-12" />
                        </div>
                        <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2">
                            <Target className="w-20 h-20 text-indigo-900/5 -rotate-12" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Numerology;
