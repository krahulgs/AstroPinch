import React, { useState, useRef } from 'react';
import { ArrowRight, Star, Heart, Calendar, Sparkles, Calculator, BookOpen, ChevronLeft, ChevronRight, Cpu, Database, Zap, Globe, Compass, Moon } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import ZodiacIcons from '../components/ZodiacIcons';
import { useProfile } from '../context/ProfileContext';
import SEO from '../components/SEO';

const Home = () => {
    const { token } = useProfile();
    const [selectedSign, setSelectedSign] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroBackgrounds = [
        '/app_bg.png',
        '/dark_cosmos_bg.png',
        '/lighter_cosmos_bg.png'
    ];

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroBackgrounds.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const scrollRef = useRef(null);

    const zodiacSigns = [
        { name: 'Aries', dates: 'Mar 21 - Apr 19', symbol: '♈', color: 'from-red-500 to-orange-500' },
        { name: 'Taurus', dates: 'Apr 20 - May 20', symbol: '♉', color: 'from-green-500 to-emerald-500' },
        { name: 'Gemini', dates: 'May 21 - Jun 20', symbol: '♊', color: 'from-yellow-400 to-amber-500' },
        { name: 'Cancer', dates: 'Jun 21 - Jul 22', symbol: '♋', color: 'from-blue-400 to-indigo-500' },
        { name: 'Leo', dates: 'Jul 23 - Aug 22', symbol: '♌', color: 'from-orange-500 to-red-600' },
        { name: 'Virgo', dates: 'Aug 23 - Sep 22', symbol: '♍', color: 'from-emerald-500 to-teal-600' },
        { name: 'Libra', dates: 'Sep 23 - Oct 22', symbol: '♎', color: 'from-pink-400 to-rose-500' },
        { name: 'Scorpio', dates: 'Oct 23 - Nov 21', symbol: '♏', color: 'from-purple-600 to-indigo-700' },
        { name: 'Sagittarius', dates: 'Nov 22 - Dec 21', symbol: '♐', color: 'from-amber-500 to-orange-600' },
        { name: 'Capricorn', dates: 'Dec 22 - Jan 19', symbol: '♑', color: 'from-slate-600 to-gray-700' },
        { name: 'Aquarius', dates: 'Jan 20 - Feb 18', symbol: '♒', color: 'from-cyan-500 to-blue-600' },
        { name: 'Pisces', dates: 'Feb 19 - Mar 20', symbol: '♓', color: 'from-violet-500 to-purple-600' }
    ];

    const features = [
        {
            icon: Sparkles,
            title: "Daily Horoscope",
            description: "Get personalized daily insights based on your zodiac sign and current planetary transits.",
            link: "/horoscope"
        },
        {
            icon: Calculator,
            title: "Birth Chart",
            description: "Generate your comprehensive Vedic birth chart with detailed planetary positions and analysis.",
            link: "/chart"
        },
        {
            icon: Heart,
            title: "Compatibility",
            description: "Check relationship compatibility using traditional Ashtakoot Guna Milan methodology.",
            link: "/kundali-match"
        },
        {
            icon: Cpu,
            title: "Numerology",
            description: "Discover the hidden meaning of numbers in your life with our advanced numerology calculator.",
            link: "/numerology"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <SEO
                title="Home"
                description="Unlock personalized daily horoscopes, professional birth chart analysis, and ancient vedic wisdom through AstroPinch."
            />
            {/* Hero Section - Sleek, Modern, Two-Column */}
            <section className="relative min-h-[80vh] flex items-center justify-center px-6 overflow-hidden transition-all duration-500">
                {/* Sliding Background Images */}
                <div className="absolute inset-0 z-0">
                    {heroBackgrounds.map((bg, index) => (
                        <div key={bg} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                            <img
                                src={bg}
                                alt={`Cosmic background ${index + 1}`}
                                className="w-full h-full object-cover animate-pulse-slow"
                            />
                        </div>
                    ))}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/20 to-transparent"></div>
                </div>

                <div className="w-full max-w-7xl mx-auto px-6 relative z-10 animate-in fade-in duration-1000 pt-20">
                    <div className="grid lg:grid-cols-2 gap-16 items-center text-left">
                        {/* Left Side: Information and CTA */}
                        <div className="space-y-10">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium text-[10px] uppercase tracking-[0.2em]">
                                    <Sparkles className="w-3 h-3 text-amber-400" />
                                    Your Celestial Destiny
                                </div>

                                <h1 className="text-5xl md:text-8xl font-medium text-white tracking-tight leading-[0.9] font-serif italic">
                                    Discover Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Cosmic Path</span>
                                </h1>

                                <p className="text-base md:text-xl text-white/80 max-w-xl font-light tracking-wide leading-relaxed">
                                    Unlock personalized daily horoscopes, professional birth chart analysis, and ancient vedic wisdom through our NASA-powered precision engine.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-6">
                                <Link
                                    to="/chart"
                                    className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all duration-300 shadow-xl shadow-white/5"
                                >
                                    Get Free Chart
                                </Link>
                                <div className="flex items-center gap-4 px-5 py-3 rounded-full border border-white/10 backdrop-blur-sm bg-white/5">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-primary bg-primary/20 bg-cover bg-center" style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${i + 10}')` }}></div>
                                        ))}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-2 h-2 fill-amber-400 text-amber-400" />)}
                                            <span className="text-white text-[10px] font-bold ml-1">4.9/5</span>
                                        </div>
                                        <span className="text-white/70 text-[9px] font-medium uppercase tracking-tighter">Joined by 2M+ users</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: The Orbital Engine */}
                        <div className="relative hidden lg:block h-[500px] w-full flex items-center justify-center pointer-events-none scale-90">
                            {/* Stellar Core */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="w-5 h-5 rounded-full bg-white shadow-[0_0_80px_rgba(255,255,255,1)] animate-pulse"></div>
                                <div className="absolute inset-0 w-5 h-5 rounded-full bg-blue-500/30 blur-3xl scale-[6] animate-pulse"></div>
                            </div>

                            {/* Tech Card Template Component with Counter-Rotation */}
                            {(() => {
                                const TechCard = ({ icon: Icon, title, subtitle, footer, color, iconColor, footerColor, titleColor, subtitleColor, revAnim, side = 'left' }) => {
                                    const colorMap = {
                                        blue: { title: 'text-blue-100', sub: 'text-blue-200/70', foot: 'text-cyan-200', accent: 'blue' },
                                        cyan: { title: 'text-cyan-100', sub: 'text-cyan-200/70', foot: 'text-emerald-200', accent: 'cyan' },
                                        purple: { title: 'text-purple-100', sub: 'text-purple-200/70', foot: 'text-fuchsia-200', accent: 'purple' },
                                        indigo: { title: 'text-indigo-100', sub: 'text-indigo-200/70', foot: 'text-violet-200', accent: 'indigo' },
                                        amber: { title: 'text-amber-100', sub: 'text-amber-200/70', foot: 'text-orange-200', accent: 'amber' },
                                        rose: { title: 'text-rose-100', sub: 'text-rose-200/70', foot: 'text-pink-200', accent: 'rose' }
                                    };
                                    const theme = colorMap[color] || colorMap.blue;

                                    return (
                                        <div className={`animate-${revAnim} pointer-events-auto`}>
                                            <div className={`group relative bg-slate-900/40 backdrop-blur-3xl p-6 rounded-[2.5rem] border border-white/5 hover:border-${theme.accent}-500/30 transition-all duration-700 w-72 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden group/card`}>
                                                {/* Advanced Animated Backgrounds */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 opacity-30"></div>
                                                <div className={`absolute inset-0 bg-gradient-to-tr from-${theme.accent}-500/0 via-${theme.accent}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`}></div>

                                                {/* Scanning Line Effect */}
                                                <div className="absolute inset-0 overflow-hidden opacity-20 group-hover:opacity-40 transition-opacity">
                                                    <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-${theme.accent}-400 to-transparent animate-scan`}></div>
                                                </div>

                                                {/* Inner Glow Base */}
                                                <div className={`absolute -inset-24 bg-${theme.accent}-500/10 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>

                                                <div className="relative z-10 space-y-6">
                                                    <div className={`flex items-center gap-5 ${side === 'right' ? 'flex-row-reverse text-right' : ''}`}>
                                                        {/* Premium Icon Container */}
                                                        <div className="relative">
                                                            <div className={`absolute inset-0 bg-${theme.accent}-500/40 blur-xl rounded-full scale-50 group-hover:scale-125 transition-transform duration-700`}></div>
                                                            <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border border-white/20 shadow-2xl group-hover:border-${theme.accent}-400/50 group-hover:-translate-y-1 transition-all duration-500`}>
                                                                <Icon className={`w-7 h-7 text-white group-hover:text-${theme.accent}-400 transition-colors duration-500 group-hover:rotate-[360deg] duration-[1500ms]`} />
                                                            </div>
                                                        </div>

                                                        <div className="flex-1">
                                                            <h4 className={`font-black text-[10px] tracking-[0.25em] uppercase leading-none mb-2 ${theme.title} group-hover:text-white transition-colors`}>{title}</h4>
                                                            <p className={`text-[10px] font-medium leading-relaxed ${theme.sub} group-hover:text-white transition-colors`}>{subtitle}</p>
                                                        </div>
                                                    </div>

                                                    <div className={`pt-5 border-t border-white/10 flex items-center justify-between ${side === 'right' ? 'flex-row-reverse text-right' : ''}`}>
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest mb-1">Status: Active</span>
                                                            <span className={`text-[11px] font-black ${theme.foot} tracking-[0.1em] uppercase group-hover:tracking-[0.15em] transition-all`}>{footer}</span>
                                                        </div>
                                                        <div className="relative flex items-center justify-center">
                                                            <div className={`absolute inset-0 w-full h-full bg-${theme.accent}-400 blur-md animate-pulse opacity-50`}></div>
                                                            <div className={`w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15_rgba(255,255,255,1)] z-10 animate-glow`}></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={`absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-${theme.accent}-500/20 to-transparent rotate-45 translate-x-6 translate-y-6`}></div>
                                            </div>
                                        </div>
                                    );
                                };

                                return (
                                    <>
                                        {/* Multi-Directional Orbital Engine */}

                                        {/* Ring 1: Fast & Clockwise (Inner) */}
                                        <div className="absolute border border-white/5 rounded-full w-[280px] h-[280px] animate-orbit-fast">
                                            {/* Top: VedAstro */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                                                <TechCard
                                                    icon={BookOpen}
                                                    title="VedAstro Engine"
                                                    subtitle="Ancient Vedic Traditions"
                                                    footer="Swiss Ephemeris 2.10"
                                                    color="blue"
                                                    revAnim="orbit-fast-rev"
                                                />
                                            </div>

                                            {/* Bottom: Groq */}
                                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                                                <TechCard
                                                    icon={Cpu}
                                                    title="Groq LPU"
                                                    subtitle="Ultra-Fast Inference"
                                                    footer="Real-time Prediction"
                                                    color="cyan"
                                                    revAnim="orbit-fast-rev"
                                                />
                                            </div>
                                        </div>

                                        {/* Ring 2: Slow & Counter-Clockwise (Outer) */}
                                        <div className="absolute border border-white/5 rounded-full w-[450px] h-[450px] animate-orbit-slow-rev">
                                            {/* Right: AstroAI */}
                                            <div className="absolute top-1/2 -right-10 -translate-y-1/2">
                                                <TechCard
                                                    icon={Zap}
                                                    title="AstroAI Predictor"
                                                    subtitle="Neural Core Modeling"
                                                    footer="Proprietary Analytics"
                                                    color="rose"
                                                    revAnim="orbit-slow"
                                                    side="right"
                                                />
                                            </div>

                                            {/* Left: JPL Horizons */}
                                            <div className="absolute top-1/2 -left-10 -translate-y-1/2">
                                                <TechCard
                                                    icon={Calculator}
                                                    title="JPL Horizons"
                                                    subtitle="Skyfield Precision"
                                                    footer="NASA JPL Planetary Data"
                                                    color="amber"
                                                    revAnim="orbit-slow"
                                                />
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                    </div>

                    {/* Footer / Trust Bar Integrated into Hero */}
                    <div className="pt-16 border-t border-white/5 mt-auto flex flex-wrap justify-between items-center gap-8 opacity-50 hover:opacity-100 transition-opacity">
                        {['Astrology Weekly', 'Zenith Times', 'Cosmic Daily', 'Star Guide', 'Nebula Insight'].map(brand => (
                            <span key={brand} className="text-white font-serif italic text-sm tracking-widest leading-none">{brand}</span>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-20">
                    <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                    </div>
                </div>
            </section>



            {/* Quick Access Features - Premium Light Design (Matching Reference Image) */}
            <section className="bg-[#fcfdff] py-32 relative overflow-hidden">
                {/* Subtle Artistic Accents */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 opacity-50"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="flex flex-col items-center justify-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border border-slate-200/50">
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            Explore Wisdom
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                            Personalized <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Astrology Tools</span>
                        </h2>
                        <p className="max-w-2xl text-slate-500 font-medium leading-relaxed">
                            Navigate your life with precision using our suite of celestial insights.
                        </p>
                    </div>

                    {/* NEW: Daily Horoscope Select Grid */}
                    <div className="mb-20">
                        <div className="flex items-center justify-center gap-2 mb-8">
                            <h3 className="text-xl font-serif italic text-slate-700">Select your Sign for Daily Insights</h3>
                            <div className="h-[1px] w-12 bg-slate-200"></div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
                            {zodiacSigns.map((sign) => (
                                <Link
                                    key={sign.name}
                                    to={`/horoscope/${sign.name.toLowerCase()}`}
                                    className="group relative p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:border-purple-100 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${sign.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                                    <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-sm">{sign.symbol}</span>
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-purple-700 transition-colors">{sign.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide group-hover:text-purple-500/70 transition-colors">{sign.dates}</p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            // Professional styling configs
                            const styles = [
                                { bg: "hover:shadow-purple-500/10 hover:border-purple-500/20", iconBg: "bg-purple-100", iconColor: "text-purple-600", accent: "purple" }, // Horoscope
                                { bg: "hover:shadow-amber-500/10 hover:border-amber-500/20", iconBg: "bg-amber-100", iconColor: "text-amber-600", accent: "amber" },   // Chart
                                { bg: "hover:shadow-rose-500/10 hover:border-rose-500/20", iconBg: "bg-rose-100", iconColor: "text-rose-600", accent: "rose" },     // Compatibility
                                { bg: "hover:shadow-emerald-500/10 hover:border-emerald-500/20", iconBg: "bg-emerald-100", iconColor: "text-emerald-600", accent: "emerald" } // Tarot
                            ][idx];

                            return (
                                <Link
                                    key={idx}
                                    to={feature.link}
                                    className={`group relative flex flex-col p-8 bg-white rounded-[2rem] border border-slate-200/60 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${styles.bg}`}
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`w-14 h-14 rounded-2xl ${styles.iconBg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                                            <Icon className={`w-7 h-7 ${styles.iconColor}`} />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                                            <ArrowRight className={`w-4 h-4 ${styles.iconColor}`} />
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Bottom aesthetic line */}
                                    <div className={`absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-${styles.accent}-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>
            {/* NEW: AstroAI Chat Highlight Section */}
            <section className="py-24 relative overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-gradient-to-br from-purple-900 to-indigo-950 rounded-[3rem] p-8 md:p-16 relative overflow-hidden shadow-2xl shadow-purple-950/20">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-amber-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                                    <Sparkles className="w-3 h-3" />
                                    AI-Powered Consultation
                                </div>

                                <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight leading-[1.1]">
                                    Instant Answers to <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-indigo-200 to-white italic">Every Query</span>
                                </h2>

                                <p className="text-lg text-purple-100/70 font-light leading-relaxed max-w-lg">
                                    Why wait for an appointment? Our advanced AstroAI analyzes your unique birth chart in real-time to provide precise answers about your career, love life, and health.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                            <Zap className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-white/90 font-medium">10 Free Queries Monthly</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
                                            <Cpu className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm text-white/90 font-medium">Real-time Predictions</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Link
                                        to="/chart"
                                        className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all duration-300 shadow-xl group/btn"
                                    >
                                        Start Free Chat
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Visual Mockup of Chat */}
                                <div className="bg-white/10 backdrop-blur-3xl rounded-3xl border border-white/20 p-6 shadow-2xl relative z-10 animate-float">
                                    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-white font-bold text-sm">Astra AI Guide</div>
                                            <div className="text-[10px] text-green-400 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                                Active & Waiting
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="p-3 bg-white/10 rounded-2xl rounded-tl-sm text-xs text-white/90 max-w-[80%] border border-white/5">
                                            "Based on your Saturn transit in the 10th house, this is the perfect time for a career shift..."
                                        </div>
                                        <div className="p-3 bg-indigo-600 rounded-2xl rounded-tr-sm text-xs text-white max-w-[80%] ml-auto shadow-lg">
                                            "Is this shift favorable for a startup?"
                                        </div>
                                        <div className="p-3 bg-white/10 rounded-2xl rounded-tl-sm text-xs text-white/90 max-w-[90%] border border-white/5">
                                            "Yes, with Jupiter aspecting your Ascendant after April, the stars align for entrepreneurial success."
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="w-full bg-white/5 border border-white/20 rounded-xl py-3 px-4 text-xs text-white/50">
                                            Type your query here...
                                        </div>
                                        <div className="absolute right-2 top-1.5 w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                            <ArrowRight className="w-4 h-4 text-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Background Rings */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-white/5 rounded-full pointer-events-none"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-white/5 rounded-full pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>





            {/* Astrology Calendar (Capricorn/Structure Theme) - Professional Redesign */}
            <section className="relative py-32 overflow-hidden bg-[#223346] text-white">
                {/* Background Ambient Glows */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-40"></div>

                {/* Subtle Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">

                        {/* Left Side: Content & CTA */}
                        <div className="space-y-10 text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-amber-400 font-bold text-[10px] uppercase tracking-[0.25em]">
                                <Calendar className="w-3 h-3" />
                                Synchronize Your Life
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-none">
                                    Cosmic <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 italic px-1">Calendar</span>
                                </h2>
                                <p className="text-lg text-slate-400 font-light leading-relaxed max-w-xl">
                                    Master time with our precision Panchang. Track detailed Tithi, Nakshatra, and auspicious Muhurta timings tailored to your exact location.
                                </p>
                            </div>

                            <div className="flex flex-col space-y-4">
                                {[
                                    { icon: Sparkles, title: "Hindu Panchang", desc: "Live Tithi, Nakshatra, Yoga & Karana" },
                                    { icon: Moon, title: "Vrat & Upvas Alerts", desc: "Notifications for Ekadashi, Pradosh & Purnima" },
                                    { icon: Compass, title: "Muhurta Timing", desc: "Real-time Choghadiya & Rahu Kaal tracking" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 group">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-900/20 flex items-center justify-center border border-white/10 group-hover:border-indigo-400/50 transition-colors">
                                            <item.icon className="w-5 h-5 text-indigo-300 group-hover:text-indigo-100 transition-colors" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-base group-hover:text-indigo-200 transition-colors">{item.title}</h4>
                                            <p className="text-slate-500 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <Link
                                    to="/calendar"
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-white text-black rounded-full font-bold uppercase tracking-widest text-xs hover:bg-amber-400 transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-amber-400/20 group"
                                >
                                    Explore Full Calendar
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        {/* Right Side: Visual Mockup / Glass Card */}
                        <div className="relative">
                            {/* Decorative Orbit Rings */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full animate-spin-slower pointer-events-none"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-white/5 rounded-full animate-reverse-spin pointer-events-none"></div>

                            {/* Main Glass Card */}
                            <div className="relative z-10 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl skew-y-1 hover:skew-y-0 transition-transform duration-700">
                                {/* Header Mockup */}
                                <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                                    <div>
                                        <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">Today's Panchang</div>
                                        <div className="text-3xl font-serif text-white">
                                            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
                                        <Moon className="w-6 h-6 text-indigo-300" />
                                    </div>
                                </div>

                                {/* Data Rows Mockup */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                                            <span className="text-slate-300 font-medium">Sunrise</span>
                                        </div>
                                        <span className="text-white font-mono bg-white/5 px-3 py-1 rounded text-sm group-hover:bg-amber-400/20 group-hover:text-amber-300 transition-colors">06:14 AM</span>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                            <span className="text-slate-300 font-medium">Tithi</span>
                                        </div>
                                        <span className="text-white font-mono bg-white/5 px-3 py-1 rounded text-sm group-hover:bg-indigo-400/20 group-hover:text-indigo-300 transition-colors">Shukla Paksha</span>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                                            <span className="text-slate-300 font-medium">Nakshatra</span>
                                        </div>
                                        <span className="text-white font-mono bg-white/5 px-3 py-1 rounded text-sm group-hover:bg-rose-400/20 group-hover:text-rose-300 transition-colors">Rohini</span>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                                            <span className="text-slate-300 font-medium">Abhijit Muhurta</span>
                                        </div>
                                        <span className="text-white font-mono bg-white/5 px-3 py-1 rounded text-sm group-hover:bg-emerald-400/20 group-hover:text-emerald-300 transition-colors">11:45 - 12:30</span>
                                    </div>
                                </div>

                                {/* Bottom Decorative Bar */}
                                <div className="mt-10 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-2/3 bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Gradient Transition to Next Section */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#0a0a0b] pointer-events-none z-20"></div>
            </section>

            {/* User Reviews Section (Leo/Expression Theme) - Professional Redesign */}
            <section className="relative py-32 overflow-hidden bg-[#0a0a0b]">
                {/* Background Image with Lighter Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/lighter_cosmos_bg.png"
                        alt="Cosmic background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-transparent to-[#0a0a0b]/80"></div>
                </div>

                {/* Visual Anchors */}
                <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 z-0"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] translate-y-1/3 translate-x-1/3 z-0"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header Block */}
                    <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-10 border-b border-white/5 pb-10">
                        <div className="max-w-2xl space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-violet-300 font-bold text-[10px] uppercase tracking-[0.25em]">
                                <Star className="w-3 h-3 fill-violet-300" />
                                Community Validation
                            </div>
                            <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-none">
                                Trust in the <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-indigo-300 to-white">Cosmos</span>
                            </h2>
                            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-xl">
                                Join a community of over 2 million seekers who rely on our precision-guided celestial insights for clarity in an uncertain world.
                            </p>
                        </div>

                        {/* Trust Indicator / Badge */}
                        <div className="flex items-center gap-8 bg-slate-900/50 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                            <div className="text-center px-4 border-r border-white/10">
                                <div className="text-4xl font-black text-white mb-1">4.98</div>
                                <div className="flex justify-center gap-0.5 mb-2">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                                </div>
                                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">App Store Rating</div>
                            </div>
                            <div className="px-2">
                                <div className="flex -space-x-3 mb-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-[#1a1b1e] bg-slate-800 bg-cover bg-center" style={{ backgroundImage: `url('https://i.pravatar.cc/100?img=${i + 20}')` }}></div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-[#1a1b1e] bg-slate-800 flex items-center justify-center text-xs font-bold text-white">2M+</div>
                                </div>
                                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold text-center">Active Users</div>
                            </div>
                        </div>
                    </div>

                    {/* Testimonials Slider */}
                    <div className="relative w-full overflow-hidden mask-linear-fade">
                        {/* Gradient Masks for smooth fade edges */}
                        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10"></div>
                        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10"></div>

                        <div className="flex w-max animate-scroll-left hover:pause-animation">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="flex gap-6 pr-6">
                                    {[
                                        {
                                            name: "Sarah Jenkins",
                                            role: "Holistic Practitioner",
                                            text: "The daily horoscopes are spookily accurate. It's become a non-negotiable part of my morning ritual.",
                                            rating: 5,
                                            img: "/rev_1.png"
                                        },
                                        {
                                            name: "David Chen",
                                            role: "Tech Entrepreneur",
                                            text: "The JPL/NASA integration blew me away. It feels like genuine astronomical science.",
                                            rating: 5,
                                            img: "/rev_2.png"
                                        },
                                        {
                                            name: "Michelle Rivera",
                                            role: "Creative Director",
                                            text: "The birth chart analysis revealed patterns I've felt my whole life but couldn't name.",
                                            rating: 5,
                                            img: "https://i.pravatar.cc/150?u=michelle"
                                        },
                                        {
                                            name: "Elena Vance",
                                            role: "Astrophysics Student",
                                            text: "The planetary alignment visualization is mathematically consistent. A rare bridge of intuition and accuracy.",
                                            rating: 5,
                                            img: "https://i.pravatar.cc/150?u=elena"
                                        },
                                        {
                                            name: "Marcus Thorne",
                                            role: "Financial Analyst",
                                            text: "Timing is everything. The Muhurta alerts help me schedule barely-there windows of opportunity.",
                                            rating: 5,
                                            img: "https://i.pravatar.cc/150?u=marcus"
                                        },
                                        {
                                            name: "Priya Sharma",
                                            role: "Wellness Coach",
                                            text: "My clients love the 'Power Actions'—concrete steps to align with daily energies.",
                                            rating: 5,
                                            img: "https://i.pravatar.cc/150?u=priya"
                                        }
                                    ].map((review, idx) => (
                                        <div key={idx} className="w-[300px] group relative p-6 rounded-[1.5rem] bg-slate-900/40 backdrop-blur-sm border border-white/5 hover:border-white/20 hover:bg-slate-900/80 transition-all duration-300">
                                            <div className="flex gap-0.5 mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                                                ))}
                                            </div>

                                            <p className="text-slate-300 font-medium text-sm leading-relaxed mb-6 group-hover:text-white transition-colors line-clamp-3">
                                                "{review.text}"
                                            </p>

                                            <div className="flex items-center gap-3 mt-auto">
                                                <div className="w-10 h-10 rounded-full border border-white/10 p-0.5">
                                                    <img src={review.img} alt={review.name} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold text-xs tracking-wide">{review.name}</h4>
                                                    <p className="text-slate-500 text-[9px] uppercase tracking-widest font-bold group-hover:text-indigo-300 transition-colors">{review.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Home;
