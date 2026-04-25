import React, { useEffect, useState, useMemo } from 'react';
import { useChart } from '../context/ChartContext';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Sparkles, ArrowLeft, Compass, Heart, Briefcase, Coins, Home, Star, ShieldAlert, Wallet, XCircle, AlertTriangle, Activity, Users, Map, Bell, BellOff, Calendar, MapPin, Share2, Download, ChevronRight, Info, Clock, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../api/config';
import SEO from '../components/SEO';
import NotificationService from '../services/NotificationService';

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
    const { sign: paramSign } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { consolidatedReport } = useChart();
    
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        localStorage.getItem('transit_alerts_enabled') === 'true'
    );

    const handleEnableNotifications = async () => {
        const success = await NotificationService.enableDailyAlerts();
        if (success) {
            setNotificationsEnabled(true);
            alert("Success! You will now receive transit alerts.");
        } else {
            alert("Notification permission denied. Please enable it in your browser settings.");
        }
    };

    const [selectedSign, setSelectedSign] = useState(null);
    const [period, setPeriod] = useState('daily');
    const [activeTab, setActiveTab] = useState('love');
    const [dynamicData, setDynamicData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTechnical, setShowTechnical] = useState(false);

    const zodiacSigns = [
        { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19' }, { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20' },
        { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20' }, { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22' },
        { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22' }, { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22' },
        { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22' }, { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21' },
        { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21' }, { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19' },
        { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18' }, { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20' }
    ];

    // Personalized Moon Sign Detection
    const moonSign = useMemo(() => {
        if (consolidatedReport?.vedic_astrology?.planets) {
            const moon = consolidatedReport.vedic_astrology.planets.find(p => p.name === 'Moon');
            return moon?.sign;
        }
        return null;
    }, [consolidatedReport]);

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        navigate(`/rashifal/${newPeriod}/${currentSign.toLowerCase()}`);
    };

    const fetchDynamicHoroscope = async (sign, currentPeriod) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/horoscope/${sign}?lang=${i18n.language}&period=${currentPeriod}`);
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
        let periodParam = searchParams.get('period');
        
        if (!periodParam) {
            const path = window.location.pathname;
            if (path.includes('/daily')) periodParam = 'daily';
            else if (path.includes('/weekly')) periodParam = 'weekly';
            else if (path.includes('/monthly')) periodParam = 'monthly';
            else periodParam = 'daily';
        }

        // Priority for Sign: URL Param > Moon Sign (Vedic) > Sun Sign (Western) > Aries
        let sign = signParam || moonSign || chartData?.sun_sign || 'Aries';

        if (sign) {
            sign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
            if (horoscopes[sign]) {
                const needsFetch = selectedSign !== sign || period !== periodParam;
                setSelectedSign(sign);
                setPeriod(periodParam);
                if (needsFetch) {
                    fetchDynamicHoroscope(sign, periodParam);
                }
            }
        }
    }, [searchParams, chartData, routeSign, i18n.language, moonSign]);

    const currentSign = selectedSign || moonSign || chartData?.sun_sign || 'Aries';
    const displayPrediction = dynamicData?.prediction || horoscopes[currentSign] || "The stars are currently recalibrating for your journey.";
    const currentZodiacData = {
        ...zodiacData[currentSign],
        ...dynamicData 
    };

    const panchang = consolidatedReport?.vedic_astrology?.panchang;

    return (
        <div className="min-h-screen max-w-7xl mx-auto py-10 px-6">
            <SEO
                title={`${currentSign} ${period.charAt(0).toUpperCase() + period.slice(1)} Horoscope`}
                description={`Get your real-time ${currentSign} ${period} horoscope based on your ${moonSign ? 'Moon' : 'Sun'} sign. Insights on love, career, and finance.`}
                url={`/rashifal/${period}/${currentSign.toLowerCase()}`}
            />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold uppercase text-xs tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> {t('common.back_to_universe')}
                </Link>

                {/* Push Notification Toggle */}
                <button 
                    onClick={handleEnableNotifications}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border ${
                        notificationsEnabled 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100'
                    }`}
                >
                    {notificationsEnabled ? <ShieldCheck className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                    {notificationsEnabled ? 'Transit Alerts Active' : 'Enable Transit Alerts'}
                </button>
            </div>

            {/* 1. Sign Selector Bar */}
            <div className="mb-12 overflow-x-auto pb-4 no-scrollbar">
                <div className="flex gap-3 justify-start md:justify-center min-w-max px-2">
                    {zodiacSigns.map((z) => (
                        <Link
                            key={z.name}
                            to={`/rashifal/${period}/${z.name.toLowerCase()}`}
                            className={`flex flex-col items-center justify-center w-20 h-24 rounded-2xl border transition-all duration-300 shrink-0 ${currentSign === z.name
                                ? 'bg-indigo-950 border-indigo-950 text-white shadow-xl scale-110 z-10'
                                : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:text-indigo-600'
                                }`}
                        >
                            <span className="text-2xl mb-1">{z.symbol}</span>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{t(`zodiac.signs.${z.name}`).slice(0, 5)}</span>
                            {moonSign === z.name && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                                    <Moon className="w-3 h-3 text-white fill-current" />
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 2. Main Hero Section */}
            <div className="text-center space-y-4 mb-12">
                <div className="flex justify-center mb-6">
                    <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50 shadow-inner">
                        {['daily', 'weekly', 'monthly'].map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePeriodChange(p)}
                                className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                                    period === p 
                                    ? 'bg-white text-indigo-600 shadow-md scale-105' 
                                    : 'text-slate-500 hover:text-indigo-500'
                                }`}
                            >
                                {t(`rashifal.index.${p}`)}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                    <span className="inline-block py-1 px-4 rounded-full bg-amber-50 text-amber-600 font-black uppercase text-[10px] tracking-[0.2em] border border-amber-100">
                        {moonSign === currentSign ? "Personalized Moon Sign Guide" : "Zodiac Forecast"}
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase mb-2">
                        {currentSign}
                    </h1>
                    <p className="text-slate-500 font-black tracking-widest uppercase text-xs">
                        {period === 'daily' 
                            ? new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                            : period === 'weekly' ? "Week of " + new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
                        }
                    </p>
                </div>
            </div>

            {/* 3. Daily Panchang Alerts (Rahu Kaal / Shubh Muhurat) */}
            {period === 'daily' && panchang && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                    <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-red-600 uppercase tracking-widest">Rahu Kaal (Avoid Major Tasks)</div>
                            <div className="text-xl font-black text-slate-900">{panchang.rahu_kaal || "1:30 PM - 3:00 PM"}</div>
                        </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                            <Sparkles className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Abhijit Muhurat (Auspicious)</div>
                            <div className="text-xl font-black text-slate-900">{panchang.abhijit_muhurat || "11:45 AM - 12:35 PM"}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className={`space-y-12 transition-all duration-500 ${loading ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
                
                {/* 4. The Prediction Card */}
                <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-indigo-900/5 border border-slate-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700"></div>
                    
                    <div className="relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <Moon className="w-8 h-8 text-indigo-200 mx-auto mb-8 animate-pulse" />
                            <h3 className="text-2xl md:text-5xl text-slate-800 leading-[1.2] font-serif italic mb-12">
                                "{displayPrediction}"
                            </h3>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Energy', value: `${(dynamicData?.energy_level || 4) * 20}%`, color: "bg-amber-400" },
                                    { label: 'Lucky #', value: dynamicData?.lucky_number || '27', color: "bg-indigo-400" },
                                    { label: 'Power Color', value: dynamicData?.lucky_color || 'Indigo', color: "bg-fuchsia-400" },
                                    { label: 'Mood', value: dynamicData?.mood || 'Radiant', color: "bg-emerald-400" },
                                ].map((stat, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                                        <div className={`w-8 h-1 ${stat.color} rounded-full mx-auto mb-4`}></div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                        <div className="text-xl font-black text-slate-900">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Tabbed Category Section */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                    <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'love', label: 'Love', icon: <Heart className="w-4 h-4" /> },
                            { id: 'career', label: 'Career', icon: <Briefcase className="w-4 h-4" /> },
                            { id: 'health', label: 'Health', icon: <Activity className="w-4 h-4" /> },
                            { id: 'finance', label: 'Finance', icon: <Wallet className="w-4 h-4" /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[120px] flex items-center justify-center gap-3 py-6 px-4 transition-all duration-300 border-b-4 ${
                                    activeTab === tab.id 
                                    ? 'bg-indigo-50/50 border-indigo-600 text-indigo-600' 
                                    : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                                }`}
                            >
                                {tab.icon}
                                <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="p-8 md:p-12">
                        {currentZodiacData?.detailed_categories?.[activeTab] ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-6">
                                    <div className="inline-flex p-3 bg-indigo-50 rounded-2xl">
                                        <Sparkles className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                                        {activeTab} <span className="text-indigo-600">Focus</span>
                                    </h4>
                                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                        {currentZodiacData.detailed_categories[activeTab].summary || `Insights for your ${activeTab} and overall growth.`}
                                    </p>
                                    <ul className="space-y-4">
                                        {currentZodiacData.detailed_categories[activeTab].points?.map((point, idx) => (
                                            <li key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                                                <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-150 transition-transform"></div>
                                                <span className="text-sm font-bold text-slate-700">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="hidden lg:block relative">
                                    <div className="aspect-square bg-gradient-to-br from-indigo-100 to-fuchsia-50 rounded-[3rem] rotate-3 shadow-inner flex items-center justify-center p-12 overflow-hidden">
                                        {activeTab === 'love' && <Heart className="w-48 h-48 text-indigo-200/50 -rotate-3" />}
                                        {activeTab === 'career' && <Briefcase className="w-48 h-48 text-indigo-200/50 -rotate-3" />}
                                        {activeTab === 'health' && <Activity className="w-48 h-48 text-indigo-200/50 -rotate-3" />}
                                        {activeTab === 'finance' && <Wallet className="w-48 h-48 text-indigo-200/50 -rotate-3" />}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-20 text-center space-y-4">
                                <AlertTriangle className="w-12 h-12 text-slate-200 mx-auto" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest">Detail insights coming soon for this period.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 6. Caution & Power Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-red-50/50 border border-red-100 p-8 rounded-[3rem] space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-red-500" />
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Cosmic Caution</h3>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-red-100 flex justify-between items-center">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Risk Level</span>
                            <span className="px-4 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest">{currentZodiacData.risk_level || 'Moderate'}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            {currentZodiacData.financial_caution || "Exercise patience today. Avoid major financial commitments."}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {(currentZodiacData.avoid_list || ['Impulse', 'Conflict']).map((item, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white border border-red-100 rounded-lg text-[9px] font-black text-red-500 uppercase tracking-widest">{item}</span>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-950 p-8 rounded-[3rem] space-y-6 text-white overflow-hidden relative">
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <Sparkles className="w-6 h-6 text-amber-400" />
                            <h3 className="text-xl font-black uppercase tracking-tight">Power Actions</h3>
                        </div>
                        <div className="space-y-4 relative z-10">
                            {[
                                { t: 'Physical', b: dynamicData?.categories?.remedies?.solution?.physical || 'Gentle stretching or yoga' },
                                { t: 'Mental', b: dynamicData?.categories?.remedies?.solution?.meditative || '5-minute silent reflection' }
                            ].map((a, i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{a.t}</div>
                                    <div className="text-sm font-bold text-slate-200">{a.b}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer / More Signs */}
                <div className="text-center pb-12">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Explore Other Signs</h5>
                    <div className="flex flex-wrap justify-center gap-2">
                        {zodiacSigns.map(z => (
                            <Link 
                                key={z.name} 
                                to={`/rashifal/${period}/${z.name.toLowerCase()}`}
                                className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 hover:bg-white hover:border-indigo-200 transition-all uppercase tracking-widest"
                            >
                                {z.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Horoscope;
