import React, { useState, useRef } from 'react';
import { ArrowRight, Star, Heart, Calendar, Sparkles, Calculator, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import ZodiacIcons from '../components/ZodiacIcons';
import { useProfile } from '../context/ProfileContext';

const Home = () => {
    const { token } = useProfile();
    const [selectedSign, setSelectedSign] = useState(null);
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // Redirect to profiles if logged in
    if (token) return <Navigate to="/profiles" replace />;

    const zodiacSigns = [
        { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', color: 'from-red-500 to-orange-500', bg: 'bg-red-50' },
        { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
        { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50' },
        { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', color: 'from-gray-400 to-slate-500', bg: 'bg-gray-50' },
        { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', color: 'from-orange-500 to-red-600', bg: 'bg-orange-50' },
        { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', color: 'from-green-600 to-teal-600', bg: 'bg-emerald-50' },
        { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50' },
        { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', color: 'from-red-600 to-rose-700', bg: 'bg-rose-50' },
        { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50' },
        { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', color: 'from-gray-600 to-slate-700', bg: 'bg-slate-50' },
        { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
        { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50' }
    ];

    const features = [
        {
            icon: Star,
            title: "Daily Horoscope",
            description: "Your personalized daily forecast",
            link: "/horoscope"
        },
        {
            icon: Calculator,
            title: "Birth Chart",
            description: "Free natal chart calculator",
            link: "/birth-chart"
        },
        {
            icon: Heart,
            title: "Compatibility",
            description: "Love & relationship insights",
            link: "/compatibility"
        },
        {
            icon: Sparkles,
            title: "Tarot Reading",
            description: "Daily card guidance",
            link: "/tarot"
        }
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* Hero Section - Sleek, Modern, Two-Column */}
            <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/app_bg.png"
                        alt="Cosmic background"
                        className="w-full h-full object-cover animate-pulse-slow"
                    />
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

                                <h1 className="text-6xl md:text-8xl font-medium text-white tracking-tight leading-[0.9] font-serif italic">
                                    Discover Your <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Cosmic Path</span>
                                </h1>

                                <p className="text-lg md:text-xl text-white/50 max-w-xl font-light tracking-wide leading-relaxed">
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
                                        <span className="text-white/40 text-[9px] font-medium uppercase tracking-tighter">Joined by 2M+ users</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: The Orbital Engine */}
                        <div className="relative hidden lg:block h-[600px] w-full flex items-center justify-center pointer-events-none">
                            {/* Stellar Core */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_40px_rgba(255,255,255,0.8)] animate-pulse"></div>
                                <div className="absolute inset-0 w-4 h-4 rounded-full bg-white/20 blur-xl scale-[4]"></div>
                            </div>

                            {/* Ring 1: Fast (Inner) - Vedic */}
                            <div className="absolute border border-white/5 rounded-full w-[300px] h-[300px] animate-orbit-fast">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-auto">
                                    <div className="group relative bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-blue-500/20 hover:border-blue-500 transition-all duration-500 w-56 shadow-2xl">
                                        <div className="absolute inset-0 bg-blue-500/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
                                        <div className="relative space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                                    <BookOpen className="w-5 h-5 text-blue-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold text-[10px] tracking-widest uppercase">VedAstro Engine</h4>
                                                    <p className="text-white/30 text-[9px] font-medium leading-none mt-1">Ancient Vedic Logic</p>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-[8px] font-bold text-blue-400 tracking-wider uppercase">SWISS EPHEMERIS 2.10</span>
                                                <div className="w-1 h-1 rounded-full bg-blue-500/40 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 h-20 w-[1px] bg-gradient-to-t from-blue-500/50 to-transparent -translate-x-1/2 translate-y-4"></div>
                                </div>
                            </div>

                            {/* Ring 2: Medium (Middle) - AI */}
                            <div className="absolute border border-white/5 rounded-full w-[450px] h-[450px] animate-orbit-med">
                                <div className="absolute -right-24 top-1/2 -translate-y-1/2 pointer-events-auto">
                                    <div className="group relative bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-purple-500/20 hover:border-purple-500 transition-all duration-500 w-56 shadow-2xl">
                                        <div className="absolute inset-0 bg-purple-500/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
                                        <div className="relative space-y-3">
                                            <div className="flex items-center gap-3 text-right flex-row-reverse">
                                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold text-[10px] tracking-widest uppercase">Gemini 1.5 Flash</h4>
                                                    <p className="text-white/30 text-[9px] font-medium leading-none mt-1">Llama 3.3 Synthesis</p>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-white/5 flex items-center justify-between flex-row-reverse">
                                                <span className="text-[8px] font-bold text-purple-400 tracking-wider uppercase">SYNTHETIC INTELLIGENCE</span>
                                                <div className="w-1 h-1 rounded-full bg-purple-500/40 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent to-purple-500/50 -translate-y-1/2 -translate-x-[120%]"></div>
                                </div>
                            </div>

                            {/* Ring 3: Slow (Outer) - NASA */}
                            <div className="absolute border border-white/5 rounded-full w-[600px] h-[600px] animate-orbit-slow">
                                <div className="absolute bottom-0 left-1/4 pointer-events-auto">
                                    <div className="group relative bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-amber-500/20 hover:border-amber-500 transition-all duration-500 w-56 shadow-2xl">
                                        <div className="absolute inset-0 bg-amber-500/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity"></div>
                                        <div className="relative space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                                    <Calculator className="w-5 h-5 text-amber-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold text-[10px] tracking-widest uppercase">JPL Horizons</h4>
                                                    <p className="text-white/30 text-[9px] font-medium leading-none mt-1">Skyfield Precision Core</p>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-[8px] font-bold text-amber-400 tracking-wider uppercase">KERYKEION / NASA DATA</span>
                                                <div className="w-1 h-1 rounded-full bg-amber-500/40 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 left-1/2 h-24 w-[1px] bg-gradient-to-b from-transparent to-amber-500/50 -translate-x-1/2 -translate-y-[100%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Trust Bar Integrated into Hero */}
                    <div className="pt-24 border-t border-white/5 mt-auto flex flex-wrap justify-between items-center gap-8 opacity-20 hover:opacity-50 transition-opacity">
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



            {/* Quick Access Features (Gemini/Intellect Theme) */}
            <section className="bg-gradient-to-b from-slate-50 to-white py-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            // Enhanced gradients for better visibility
                            const gradients = [
                                "bg-gradient-to-br from-purple-100 via-white to-white border-purple-100/50",
                                "bg-gradient-to-br from-amber-100 via-white to-white border-amber-100/50",
                                "bg-gradient-to-br from-rose-100 via-white to-white border-rose-100/50",
                                "bg-gradient-to-br from-emerald-100 via-white to-white border-emerald-100/50"
                            ];

                            return (
                                <Link
                                    key={idx}
                                    to={feature.link}
                                    className={`group relative p-8 rounded-3xl border shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden ${gradients[idx % gradients.length]}`}
                                >
                                    {/* Removed opacity overlay to let color shine through */}

                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-white/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                        <Icon className="w-6 h-6 text-slate-700 group-hover:text-purple-600 transition-colors duration-300" />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-purple-900 transition-colors">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.description}</p>

                                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                        <ArrowRight className="w-5 h-5 text-purple-400" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Today's Highlights (Libra/Harmony Theme) */}
            <section className="relative py-32 overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/highlights_bg.png"
                        alt="Astrology highlights"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-6xl font-serif text-white mb-16 text-center italic tracking-tight">Today's <span className="text-amber-200/80">Highlights</span></h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Love Horoscope */}
                        <div className="group relative p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-red-500/10 rounded-2xl text-red-400 group-hover:scale-110 transition-transform duration-500">
                                        <Heart className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-serif text-white">Love Horoscope</h3>
                                </div>
                                <p className="text-white/60 mb-10 leading-relaxed text-lg font-light">
                                    Discover what the stars have in store for your romantic life today with our deep-dive compatibility analysis.
                                </p>
                                <Link
                                    to="/horoscope/love"
                                    className="inline-flex items-center gap-3 text-white hover:text-red-400 transition-colors font-serif italic text-xl"
                                >
                                    Read Analysis
                                    <ArrowRight className="w-6 h-6 border border-white/20 rounded-full p-1 group-hover:translate-x-2 transition-all" />
                                </Link>
                            </div>
                        </div>

                        {/* Tarot Card of the Day */}
                        <div className="group relative p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform duration-500">
                                        <Sparkles className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-3xl font-serif text-white">Card of the Day</h3>
                                </div>
                                <p className="text-white/60 mb-10 leading-relaxed text-lg font-light">
                                    Draw your daily tarot card for guidance, clarity, and spiritual inspiration for the next 24 hours.
                                </p>
                                <Link
                                    to="/tarot"
                                    className="inline-flex items-center gap-3 text-white hover:text-amber-400 transition-colors font-serif italic text-xl"
                                >
                                    Draw Card
                                    <ArrowRight className="w-6 h-6 border border-white/20 rounded-full p-1 group-hover:translate-x-2 transition-all" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Astrology Calendar (Capricorn/Structure Theme) */}
            <section className="bg-slate-50/40 border-b border-slate-100/50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mystical-card p-12 md:p-20 text-center bg-white border border-gray-100">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-8" />
                        <h2 className="text-4xl md:text-5xl font-serif text-black mb-6">Cosmic Calendar</h2>
                        <p className="text-gray-500 mb-10 max-w-2xl mx-auto text-xl font-light">
                            Track lunar phases, planetary retrogrades, and important astrological events throughout the year.
                        </p>
                        <Link
                            to="/calendar"
                            className="inline-flex items-center gap-2 px-12 py-5 bg-black text-white rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-all duration-300 shadow-xl shadow-black/10"
                        >
                            Explore Calendar
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* User Reviews Section (Leo/Expression Theme) */}
            <section className="relative py-24 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/reviews_bg.png"
                        alt="Reviews background"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-serif text-black mb-6 italic">Trust in the <br /><span className="text-primary italic">Cosmos</span></h2>
                            <p className="text-slate-500 text-xl font-light leading-relaxed">
                                Join over 2 million seekers who have found clarity and purpose through our precision-guided celestial insights.
                            </p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-slate-100 shadow-xl shadow-black/5 flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-black mb-1">4.9</div>
                                <div className="flex gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                                </div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Average Rating</div>
                            </div>
                            <div className="w-[1px] h-12 bg-slate-200"></div>
                            <div>
                                <div className="text-2xl font-bold text-black mb-1">128K+</div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Reviews</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Jenkins",
                                role: "Yoga Instructor",
                                text: "The daily horoscopes are spookily accurate. It's become a part of my morning ritual. The precision is unlike any other app I've used.",
                                rating: 5,
                                img: "/rev_1.png"
                            },
                            {
                                name: "David Chen",
                                role: "Tech Entrepreneur",
                                text: "As someone who appreciates data and precision, the JPL/NASA integration blew me away. It's not just stars; it's astronomical science.",
                                rating: 5,
                                img: "/rev_2.png"
                            },
                            {
                                name: "Michelle Rivera",
                                role: "Creative Director",
                                text: "The birth chart analysis was deeply moving. It revealed patterns I've felt my whole life but couldn't name. A truly spiritual experience.",
                                rating: 5,
                                img: "https://i.pravatar.cc/150?u=michelle"
                            }
                        ].map((review, idx) => (
                            <div key={idx} className="group p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white hover:border-primary/20 hover:bg-white hover:shadow-2xl transition-all duration-500">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 italic text-lg leading-relaxed mb-8 group-hover:text-black transition-colors">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                                        <img src={review.img} alt={review.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="text-black font-bold text-sm">{review.name}</h4>
                                        <p className="text-slate-400 text-xs uppercase tracking-widest font-medium">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Signup (Aquarius/Community Theme) */}
            <section className="bg-blue-50/20 py-32">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="mystical-card p-12 md:p-16 text-center bg-white border border-blue-100/50 overflow-hidden relative">
                        {/* Decorative Background Accent */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl opacity-50"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">Divine Insights Weekly</h2>
                            <p className="text-gray-500 mb-10 text-lg">
                                Subscribe to receive personalized astrological insights and cosmic updates directly in your inbox.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-6 py-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
                                />
                                <button className="px-10 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-all duration-300 whitespace-nowrap">
                                    Join Now
                                </button>
                            </div>
                            <p className="mt-8 text-[10px] text-gray-400 uppercase tracking-widest">No spam. Only cosmic wisdom. Unsubscribe anytime.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
