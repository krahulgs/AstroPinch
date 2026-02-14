import React, { useEffect, useState } from 'react';
import { useChart } from '../context/ChartContext';
import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Sparkles, ArrowLeft, Compass, Heart, Briefcase, Coins, Home, Star, ShieldAlert, Wallet, XCircle, AlertTriangle, Activity, Users, Map } from 'lucide-react';
import { API_BASE_URL } from '../api/config';
import SEO from '../components/SEO';

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

const zodiacData = {
    Aries: {
        lucky_color: "Red", lucky_number: "9", lucky_time: "7:00 AM - 9:00 AM", lucky_direction: "East", gemstone: "Red Coral",
        risk_level: "Medium", financial_caution: "Avoid impulsive spending on sports gear.", conflict_probability: 25, avoid_list: ["Hasty Arguments", "Speeding", "Red Meat"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: High", "Workplace Tension: Low", "Business Deals: Favorable", "Investment Mood: Aggressive"] },
            finance: { title: "Finance", points: ["Spending Alert: Moderate", "Investment Timing: Morning", "Loan/Recovery: Neutral"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Passionate", "Conflict Warning: Avoid ego clashes", "Proposal Timing: Evening", "Family Harmony: Good"] },
            health: { title: "Health", points: ["Physical Health: Strong", "Mental Stress: Low", "Diet Advice: Hydrate well", "Energy Level: High"] },
            family: { title: "Family & Social", points: ["Family Bonding: Active", "Travel Indication: Short trips likely", "Guest Arrival: Unexpected friend"] },
            travel: { title: "Travel", points: ["Commute Outlook: Smooth", "Traffic Alert: Low", "Best Mode: Car", "Trip Purpose: Leisure"] }
        }
    },
    Taurus: {
        lucky_color: "Pink", lucky_number: "6", lucky_time: "10:00 AM - 12:00 PM", lucky_direction: "South", gemstone: "Diamond",
        risk_level: "Low", financial_caution: "Reassess long-term investments.", conflict_probability: 10, avoid_list: ["Stubbornness", "Overeating", "Laziness"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Steady", "Workplace Tension: None", "Business Deals: Slow but sure", "Investment Mood: Conservative"] },
            finance: { title: "Finance", points: ["Spending Alert: Low", "Investment Timing: Afternoon", "Loan/Recovery: Good"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Sensual", "Conflict Warning: None", "Proposal Timing: Dinner", "Family Harmony: Excellent"] },
            health: { title: "Health", points: ["Physical Health: Stable", "Mental Stress: Low", "Diet Advice: Light meals", "Energy Level: Moderate"] },
            family: { title: "Family & Social", points: ["Family Bonding: Strong", "Travel Indication: None", "Guest Arrival: Family members"] },
            travel: { title: "Travel", points: ["Commute Outlook: Delays likely", "Traffic Alert: Moderate", "Best Mode: Public Transit", "Trip Purpose: Work"] }
        }
    },
    Gemini: {
        lucky_color: "Green", lucky_number: "5", lucky_time: "9:00 AM - 11:00 AM", lucky_direction: "West", gemstone: "Emerald",
        risk_level: "Medium", financial_caution: "Double-check travel bookings.", conflict_probability: 20, avoid_list: ["Gossip", "Distraction", "Multitasking"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Moderate", "Workplace Tension: Miscommunication likely", "Business Deals: Negotiate well", "Investment Mood: Speculative"] },
            finance: { title: "Finance", points: ["Spending Alert: High", "Investment Timing: Mid-day", "Loan/Recovery: Delayed"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Flirty", "Conflict Warning: Watch your words", "Proposal Timing: Not today", "Family Harmony: Mixed"] },
            health: { title: "Health", points: ["Physical Health: Variable", "Mental Stress: High", "Diet Advice: Avoid caffeine", "Energy Level: Fluctuating"] },
            family: { title: "Family & Social", points: ["Family Bonding: Chatty", "Travel Indication: Likely", "Guest Arrival: Neighbors"] },
            travel: { title: "Travel", points: ["Commute Outlook: Fast", "Traffic Alert: Low", "Best Mode: Bike/Walk", "Trip Purpose: Connection"] }
        }
    },
    Cancer: {
        lucky_color: "Silver", lucky_number: "2", lucky_time: "4:00 PM - 6:00 PM", lucky_direction: "North", gemstone: "Pearl",
        risk_level: "High", financial_caution: "Avoid emotional shopping.", conflict_probability: 30, avoid_list: ["Mood Swings", "Past Grudges", "Late Nights"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Low", "Workplace Tension: Emotional", "Business Deals: Trust intuition", "Investment Mood: Defensive"] },
            finance: { title: "Finance", points: ["Spending Alert: Emotional spending", "Investment Timing: Avoid today", "Loan/Recovery: Pending"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Deep", "Conflict Warning: High sensitivity", "Proposal Timing: Night", "Family Harmony: Needs care"] },
            health: { title: "Health", points: ["Physical Health: Sensitive digestion", "Mental Stress: Moderate", "Diet Advice: Comfort food (healthy)", "Energy Level: Low"] },
            family: { title: "Family & Social", points: ["Family Bonding: Intense", "Travel Indication: Homebound", "Guest Arrival: None"] },
            travel: { title: "Travel", points: ["Commute Outlook: Stressful", "Traffic Alert: High", "Best Mode: Avoid driving", "Trip Purpose: Mandatory"] }
        }
    },
    Leo: {
        lucky_color: "Gold", lucky_number: "1", lucky_time: "8:00 AM - 10:00 AM", lucky_direction: "East", gemstone: "Ruby",
        risk_level: "Low", financial_caution: "Watch out for luxury splurges.", conflict_probability: 15, avoid_list: ["Arrogance", "Seeking Approval", "Gambling"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Very High", "Workplace Tension: Leadership clashes", "Business Deals: Close it now", "Investment Mood: Bold"] },
            finance: { title: "Finance", points: ["Spending Alert: Very High", "Investment Timing: Morning", "Loan/Recovery: Excellent"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Theatrical", "Conflict Warning: Ego battles", "Proposal Timing: Sunset", "Family Harmony: Joyful"] },
            health: { title: "Health", points: ["Physical Health: Robust", "Mental Stress: Low", "Diet Advice: Heart-healthy", "Energy Level: High"] },
            family: { title: "Family & Social", points: ["Family Bonding: Celebratory", "Travel Indication: Valid", "Guest Arrival: Party likely"] },
            travel: { title: "Travel", points: ["Commute Outlook: Enjoyable", "Traffic Alert: Low", "Best Mode: Luxury Car", "Trip Purpose: Fun"] }
        }
    },
    Virgo: {
        lucky_color: "Grey", lucky_number: "5", lucky_time: "3:00 PM - 5:00 PM", lucky_direction: "South", gemstone: "Emerald",
        risk_level: "Medium", financial_caution: "Don't overanalyze small expenses.", conflict_probability: 18, avoid_list: ["Perfectionism", "Criticism", "Worry"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Through merit", "Workplace Tension: Detail-oriented", "Business Deals: Read fine print", "Investment Mood: Analytical"] },
            finance: { title: "Finance", points: ["Spending Alert: Low", "Investment Timing: Afternoon", "Loan/Recovery: Stable"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Practical", "Conflict Warning: Critical nature", "Proposal Timing: Weekend", "Family Harmony: Functional"] },
            health: { title: "Health", points: ["Physical Health: Good", "Mental Stress: High (Worry)", "Diet Advice: High fiber", "Energy Level: Nervous"] },
            family: { title: "Family & Social", points: ["Family Bonding: Helpful", "Travel Indication: Work trip", "Guest Arrival: None"] },
            travel: { title: "Travel", points: ["Commute Outlook: Routine", "Traffic Alert: Moderate", "Best Mode: Train", "Trip Purpose: Service"] }
        }
    },
    Libra: {
        lucky_color: "Blue", lucky_number: "6", lucky_time: "11:00 AM - 1:00 PM", lucky_direction: "West", gemstone: "Opal",
        risk_level: "Low", financial_caution: "Balance your budget carefully.", conflict_probability: 12, avoid_list: ["Indecision", "Conflict Avoidance", "Sweets"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Fair", "Workplace Tension: None (Mediator)", "Business Deals: Collaborative", "Investment Mood: Balanced"] },
            finance: { title: "Finance", points: ["Spending Alert: Aesthetic", "Investment Timing: Noon", "Loan/Recovery: Fair"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Harmonious", "Conflict Warning: Indecision", "Proposal Timing: Best day", "Family Harmony: Peaceful"] },
            health: { title: "Health", points: ["Physical Health: Kidney focus", "Mental Stress: Low", "Diet Advice: Balance sugar", "Energy Level: Balanced"] },
            family: { title: "Family & Social", points: ["Family Bonding: Social", "Travel Indication: Maybe", "Guest Arrival: Partner"] },
            travel: { title: "Travel", points: ["Commute Outlook: Pleasant", "Traffic Alert: Low", "Best Mode: Shared Ride", "Trip Purpose: Visit"] }
        }
    },
    Scorpio: {
        lucky_color: "Maroon", lucky_number: "9", lucky_time: "9:00 PM - 11:00 PM", lucky_direction: "North", gemstone: "Jasper",
        risk_level: "High", financial_caution: "Resist risky ventures.", conflict_probability: 40, avoid_list: ["Jealousy", "Secrets", "Revenge"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Secretive", "Workplace Tension: High", "Business Deals: Intense", "Investment Mood: Risky"] },
            finance: { title: "Finance", points: ["Spending Alert: Low", "Investment Timing: Night", "Loan/Recovery: Difficult"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Intense", "Conflict Warning: Power struggles", "Proposal Timing: Wait", "Family Harmony: Complex"] },
            health: { title: "Health", points: ["Physical Health: Reproductive", "Mental Stress: High", "Diet Advice: Detox", "Energy Level: Intense"] },
            family: { title: "Family & Social", points: ["Family Bonding: Private", "Travel Indication: None", "Guest Arrival: Unwanted"] },
            travel: { title: "Travel", points: ["Commute Outlook: Risky", "Traffic Alert: High", "Best Mode: Solo Drive", "Trip Purpose: Secret"] }
        }
    },
    Sagittarius: {
        lucky_color: "Yellow", lucky_number: "3", lucky_time: "6:00 AM - 8:00 AM", lucky_direction: "East", gemstone: "Topaz",
        risk_level: "Medium", financial_caution: "Don't lend money today.", conflict_probability: 22, avoid_list: ["Blunt Speech", "Overpromising", "Restlessness"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Good", "Workplace Tension: Low (Freedom)", "Business Deals: International", "Investment Mood: Optimistic"] },
            finance: { title: "Finance", points: ["Spending Alert: High (Travel)", "Investment Timing: Morning", "Loan/Recovery: Lucky"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Adventurous", "Conflict Warning: Commitment phobia", "Proposal Timing: Anytime", "Family Harmony: Fun"] },
            health: { title: "Health", points: ["Physical Health: Hips/Thighs", "Mental Stress: Low", "Diet Advice: Liver care", "Energy Level: High"] },
            family: { title: "Family & Social", points: ["Family Bonding: Outdoor", "Travel Indication: Very High", "Guest Arrival: Foreigners"] },
            travel: { title: "Travel", points: ["Commute Outlook: Extended", "Traffic Alert: Low", "Best Mode: Plane/Train", "Trip Purpose: Adventure"] }
        }
    },
    Capricorn: {
        lucky_color: "Black", lucky_number: "8", lucky_time: "1:00 PM - 3:00 PM", lucky_direction: "South", gemstone: "Blue Sapphire",
        risk_level: "Low", financial_caution: "Stick to your savings plan.", conflict_probability: 14, avoid_list: ["Pessimism", "Overworking", "Rigidity"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: High (Long term)", "Workplace Tension: Authority figures", "Business Deals: Solid", "Investment Mood: Prudent"] },
            finance: { title: "Finance", points: ["Spending Alert: Very Low", "Investment Timing: Afternoon", "Loan/Recovery: Slow"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Serious", "Conflict Warning: Coldness", "Proposal Timing: Formal", "Family Harmony: Respectful"] },
            health: { title: "Health", points: ["Physical Health: Bones/Joints", "Mental Stress: Moderate", "Diet Advice: Calcium rich", "Energy Level: Steady"] },
            family: { title: "Family & Social", points: ["Family Bonding: Dutiful", "Travel Indication: Business only", "Guest Arrival: Elders"] },
            travel: { title: "Travel", points: ["Commute Outlook: Delays", "Traffic Alert: High", "Best Mode: Corporate Car", "Trip Purpose: Duty"] }
        }
    },
    Aquarius: {
        lucky_color: "Electric Blue", lucky_number: "11", lucky_time: "2:00 PM - 4:00 PM", lucky_direction: "West", gemstone: "Amethyst",
        risk_level: "Medium", financial_caution: "Avoid investing in fads.", conflict_probability: 18, avoid_list: ["Detachment", "Rebellion", "Extremes"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Unexpected", "Workplace Tension: Ideological", "Business Deals: Innovative", "Investment Mood: Tech"] },
            finance: { title: "Finance", points: ["Spending Alert: Gadgets", "Investment Timing: Evening", "Loan/Recovery: Variable"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Intellectual", "Conflict Warning: Detachment", "Proposal Timing: Surprise", "Family Harmony: Unconventional"] },
            health: { title: "Health", points: ["Physical Health: Circulation", "Mental Stress: Nervous", "Diet Advice: Berries/Nuts", "Energy Level: Erratic"] },
            family: { title: "Family & Social", points: ["Family Bonding: Group activities", "Travel Indication: Sudden", "Guest Arrival: Friends"] },
            travel: { title: "Travel", points: ["Commute Outlook: Unpredictable", "Traffic Alert: Moderate", "Best Mode: Electric Vehicle", "Trip Purpose: Discovery"] }
        }
    },
    Pisces: {
        lucky_color: "Sea Green", lucky_number: "7", lucky_time: "5:00 PM - 7:00 PM", lucky_direction: "North", gemstone: "Yellow Sapphire",
        risk_level: "Low", financial_caution: "Be careful with charity scams.", conflict_probability: 10, avoid_list: ["Escapism", "Self-Pity", "Boundaries"],
        detailed_categories: {
            career: { title: "Career & Business", points: ["Promotion Chances: Creative", "Workplace Tension: Overwhelmed", "Business Deals: Vague", "Investment Mood: Intuitive"] },
            finance: { title: "Finance", points: ["Spending Alert: Artistic", "Investment Timing: Dusk", "Loan/Recovery: Charity"] },
            love: { title: "Love & Relationships", points: ["Romantic Mood: Dreamy", "Conflict Warning: Misunderstanding", "Proposal Timing: Perfect", "Family Harmony: Empathetic"] },
            health: { title: "Health", points: ["Physical Health: Feet/Lymph", "Mental Stress: Sensitive", "Diet Advice: Water heavy", "Energy Level: Gentle"] },
            family: { title: "Family & Social", points: ["Family Bonding: Spiritual", "Travel Indication: Retreat", "Guest Arrival: In need"] }
        }
    }
};

const defaultAspects = [
    { p1: "Sun", symbol: "☌", p2: "Mercury", type: "Conjunction", impact: "Heightened mental clarity and communication." },
    { p1: "Moon", symbol: "△", p2: "Venus", type: "Trine", impact: "Emotional harmony and romantic opportunities." },
    { p1: "Mars", symbol: "□", p2: "Pluto", type: "Square", impact: "Intense drive, potential for power struggles." },
    { p1: "Jupiter", symbol: "⚹", p2: "Saturn", type: "Sextile", impact: "Balanced growth through disciplined effort." },
    { p1: "Uranus", symbol: "☍", p2: "Neptune", type: "Opposition", impact: "Tension between innovation and idealism." }
];

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
        { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19' }, { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20' },
        { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20' }, { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' },
        { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22' }, { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' },
        { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22' }, { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' },
        { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' }, { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' },
        { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' }, { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' }
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
    const currentZodiacData = {
        ...zodiacData[currentSign],
        ...dynamicData // API data overrides static defaults if available
    };

    return (
        <div className="min-h-screen max-w-7xl mx-auto py-10 px-6">
            <SEO
                title={`${currentSign} Daily Horoscope`}
                description={`Get your real-time ${currentSign} horoscope. Insights on love, career, and personal energy for ${new Date().toLocaleDateString()}.`}
                url={`/horoscope/${currentSign.toLowerCase()}`}
            />
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
                            className={`flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all duration-200 shrink-0 ${currentSign === z.name
                                ? 'bg-indigo-900 border-indigo-900 text-white shadow-lg scale-110 z-10'
                                : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'
                                }`}
                        >
                            <span className="text-2xl mb-1">{z.symbol}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wide mb-1">{z.name.slice(0, 3)}</span>
                            <span className="text-[8px] opacity-70 leading-tight block max-w-[60px] text-center">{z.dates}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 2. Main Hero Section */}
            <div className="text-center space-y-4 mb-12">
                <span className="inline-block py-1 px-4 rounded-full bg-amber-50 text-amber-600 font-bold uppercase text-[10px] tracking-widest border border-amber-100">
                    Daily Guidance
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">
                    {t('horoscope.title', { sign: currentSign })}
                </h1>
                <p className="text-slate-400 font-serif italic text-lg mb-4">
                    {zodiacSigns.find(z => z.name === currentSign)?.dates}
                </p>
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

                {/* 3.1. Lucky Elements Section (Highly Engaging) */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[2.5rem] p-8 md:p-12 border border-indigo-100">
                    <div className="flex items-center gap-3 mb-8">
                        <Sparkles className="w-6 h-6 text-indigo-600" />
                        <h3 className="text-2xl font-serif italic text-slate-800">Lucky Elements</h3>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {[
                            {
                                label: "Lucky Color",
                                value: currentZodiacData?.lucky_color || "Royal Blue",
                                sub: "Wear for confidence",
                                icon: <div className="w-4 h-4 rounded-full bg-blue-600 shadow-sm border border-white"></div>,
                                bg: "bg-blue-100/50 text-blue-700"
                            },
                            {
                                label: "Lucky Number",
                                value: currentZodiacData?.lucky_number || "7",
                                sub: "Your power digit",
                                icon: <span className="text-lg font-black">#</span>,
                                bg: "bg-amber-100/50 text-amber-700"
                            },
                            {
                                label: "Lucky Time",
                                value: currentZodiacData?.lucky_time || "4:20 PM - 6:00 PM",
                                sub: "Golden window",
                                icon: <Moon className="w-4 h-4" />,
                                bg: "bg-purple-100/50 text-purple-700"
                            },
                            {
                                label: "Lucky Direction",
                                value: currentZodiacData?.lucky_direction || "North-East",
                                sub: "Face for success",
                                icon: <Compass className="w-4 h-4" />,
                                bg: "bg-emerald-100/50 text-emerald-700"
                            },
                            {
                                label: "Gemstone",
                                value: currentZodiacData?.gemstone || "Sapphire",
                                sub: "Energy amplifier",
                                icon: <div className="w-4 h-4 rotate-45 bg-indigo-500 rounded-sm shadow-sm"></div>,
                                bg: "bg-indigo-100/50 text-indigo-700"
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group">
                                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">{item.label}</span>
                                <h4 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{item.value}</h4>
                                <span className="text-[10px] text-slate-500 font-medium">{item.sub}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Category-Wise Daily Predictions (Detailed) */}
                {currentZodiacData?.detailed_categories && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(currentZodiacData.detailed_categories).map(([key, cat]) => {
                            const icons = {
                                love: <Heart className="w-5 h-5 text-rose-500" />,
                                career: <Briefcase className="w-5 h-5 text-indigo-500" />,
                                finance: <Coins className="w-5 h-5 text-emerald-500" />,
                                health: <Activity className="w-5 h-5 text-teal-500" />,
                                family: <Users className="w-5 h-5 text-amber-500" />,
                                travel: <Map className="w-5 h-5 text-sky-500" />
                            };

                            const headers = {
                                love: "bg-rose-50 border-rose-100 text-rose-800",
                                career: "bg-indigo-50 border-indigo-100 text-indigo-800",
                                finance: "bg-emerald-50 border-emerald-100 text-emerald-800",
                                health: "bg-teal-50 border-teal-100 text-teal-800",
                                family: "bg-amber-50 border-amber-100 text-amber-800",
                                travel: "bg-sky-50 border-sky-100 text-sky-800"
                            };

                            return (
                                <div key={key} className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 ${key === 'career' || key === 'family' ? 'md:col-span-1' : ''}`}> {/* Adjusted spans if needed, keeping simple for now */}
                                    <div className={`px-6 py-4 border-b flex items-center gap-3 ${headers[key]}`}>
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            {icons[key] || <Star className="w-4 h-4" />}
                                        </div>
                                        <h4 className="font-bold text-sm tracking-wide uppercase">{cat.title}</h4>
                                    </div>
                                    <div className="p-6">
                                        <ul className="space-y-3">
                                            {cat.points?.map((point, idx) => {
                                                const [label, value] = point.split(':');
                                                return (
                                                    <li key={idx} className="flex justify-between items-start text-sm border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                                        <span className="text-slate-500 font-medium">{label}:</span>
                                                        <span className="text-slate-800 font-bold text-right ml-4">{value}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 4.5. Caution & Alert Section */}
                <div className="bg-red-50/30 rounded-[2.5rem] p-8 md:p-12 border border-red-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                            <h3 className="text-2xl font-serif italic text-slate-800">Caution & Cosmic Alerts</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Col */}
                            <div className="space-y-6">
                                {/* Risk Score */}
                                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-700">Risk Level Score</h4>
                                        <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">General Daily Score</p>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-widest ${(currentZodiacData?.risk_level || 'Low') === 'High' ? 'bg-red-100 text-red-600' :
                                        (currentZodiacData?.risk_level || 'Low') === 'Medium' ? 'bg-orange-100 text-orange-600' :
                                            'bg-emerald-100 text-emerald-600'
                                        }`}>
                                        {currentZodiacData?.risk_level || 'Low'}
                                    </span>
                                </div>

                                {/* Financial Alert */}
                                <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Wallet className="w-4 h-4 text-orange-500" />
                                        <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Financial Caution Alert</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                        {currentZodiacData?.financial_caution || "Avoid impulsive big-ticket purchases today. Review contracts carefully."}
                                    </p>
                                </div>
                            </div>

                            {/* Right Col */}
                            <div className="space-y-6">
                                {/* Conflict Prob */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-end mb-3">
                                        <h4 className="font-bold text-slate-700">Conflict Probability</h4>
                                        <span className="text-xl font-black text-slate-900">{currentZodiacData?.conflict_probability || '12'}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-400 to-red-500"
                                            style={{ width: `${currentZodiacData?.conflict_probability || 12}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Things to Avoid */}
                                <div>
                                    <h4 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                                        <XCircle className="w-4 h-4 text-red-400" />
                                        Things to Avoid Today
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {(currentZodiacData?.avoid_list || ['Hasty Decisions', 'Ego Clashes', 'Oversleeping']).map((item, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-white border border-red-50 text-[10px] font-bold text-slate-500 uppercase tracking-widest shadow-sm">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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

                    {showTechnical && (
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-in slide-in-from-top-4 fade-in duration-300 text-left">
                            {(dynamicData?.aspects || defaultAspects).map((aspect, idx) => (
                                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
                                    <div className="flex items-center justify-between w-full">
                                        <span className="text-xs font-bold text-slate-700">
                                            {aspect.p1} {aspect.symbol} {aspect.p2}
                                        </span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{aspect.type}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-snug font-medium">
                                        {aspect.impact || "Cosmic energies aligning to influence your path."}
                                    </p>
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
