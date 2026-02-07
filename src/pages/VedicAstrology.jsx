import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import {
    BookOpen, Star, Check, TrendingUp, Heart, Users,
    Calendar, Target, ArrowRight, ChevronDown, Sparkles,
    Shield, Zap, Globe, Award
} from 'lucide-react';
import SEO from '../components/SEO';

const VedicAstrology = () => {
    const navigate = useNavigate();
    const { profiles } = useProfile();

    const handleGetKundali = () => {
        if (profiles.length === 0) {
            navigate('/profiles');
        } else {
            navigate('/chart');
        }
    };

    const handleKundaliMatch = () => {
        navigate('/kundali-match');
    };

    const comparisonData = [
        {
            aspect: "Zodiac System",
            vedic: "Sidereal (based on actual star positions)",
            western: "Tropical (based on seasons)"
        },
        {
            aspect: "Birth Chart Focus",
            vedic: "Moon sign and Ascendant (Lagna)",
            western: "Sun sign primary"
        },
        {
            aspect: "Predictive Accuracy",
            vedic: "Dasha system for precise timing",
            western: "Transit-based predictions"
        },
        {
            aspect: "House System",
            vedic: "Whole sign houses",
            western: "Multiple house systems"
        },
        {
            aspect: "Divisional Charts",
            vedic: "16 divisional charts (Vargas)",
            western: "Single birth chart"
        },
        {
            aspect: "Remedies",
            vedic: "Mantras, gemstones, rituals",
            western: "Psychological insights"
        }
    ];

    const predictions = [
        {
            icon: TrendingUp,
            title: "Career & Finance",
            description: "Identify the best career path, business opportunities, and financial growth periods based on planetary positions."
        },
        {
            icon: Heart,
            title: "Marriage & Relationships",
            description: "Analyze compatibility, find auspicious marriage timing, and understand relationship dynamics through Kundali matching."
        },
        {
            icon: Shield,
            title: "Health & Wellness",
            description: "Predict potential health issues, understand body constitution, and receive preventive health guidance."
        },
        {
            icon: Calendar,
            title: "Life Events Timing",
            description: "Know the right time for important decisions like buying property, starting business, or changing jobs."
        },
        {
            icon: Target,
            title: "Education & Skills",
            description: "Discover natural talents, best fields of study, and periods favorable for learning and examinations."
        },
        {
            icon: Users,
            title: "Family & Children",
            description: "Understand family relationships, predict childbirth timing, and analyze children's horoscopes."
        }
    ];

    const systemFeatures = [
        {
            title: "Swiss Ephemeris Calculations",
            description: "We use the most accurate astronomical data from Swiss Ephemeris, ensuring precise planetary positions down to the second."
        },
        {
            title: "Vimshottari Dasha System",
            description: "Our engine calculates 120-year Mahadasha and Antardasha periods, providing exact timing for life events."
        },
        {
            title: "Ayanamsa Precision",
            description: "We apply Lahiri Ayanamsa (23.85° for 2024) to convert tropical positions to accurate sidereal coordinates."
        },
        {
            title: "Divisional Chart Analysis",
            description: "Automatic generation of all 16 Varga charts (D1 to D60) for comprehensive life area analysis."
        },
        {
            title: "AI-Powered Interpretations",
            description: "Traditional Vedic principles combined with modern AI to deliver personalized, easy-to-understand insights."
        },
        {
            title: "Real-Time Transit Tracking",
            description: "Continuous monitoring of current planetary transits and their effects on your birth chart."
        }
    ];

    const faqs = [
        {
            question: "What is Vedic Astrology?",
            answer: "Vedic Astrology, also known as Jyotish Shastra, is an ancient Indian system of astrology that uses the sidereal zodiac based on actual star positions. It analyzes planetary positions at birth to provide insights into personality, life events, and future predictions. Unlike Western astrology, it focuses on the Moon sign and uses advanced techniques like Dasha systems for precise timing."
        },
        {
            question: "How accurate is Vedic Astrology?",
            answer: "Vedic Astrology is highly accurate when calculated correctly with precise birth time, date, and location. It uses the sidereal zodiac that accounts for the precession of equinoxes, making it astronomically accurate. The Vimshottari Dasha system provides specific time periods for events, often matching real-life occurrences with remarkable precision. Accuracy depends on the quality of birth data and the astrologer's expertise."
        },
        {
            question: "What is a Kundali or birth chart?",
            answer: "A Kundali (also called Janam Kundali or birth chart) is a detailed map of planetary positions at the exact time and place of your birth. It contains 12 houses representing different life areas and shows where the 9 planets (Navagraha) were positioned. Your Kundali reveals your personality traits, strengths, challenges, and life path. It's the foundation for all Vedic astrology predictions."
        },
        {
            question: "Is Vedic Astrology different from Western Astrology?",
            answer: "Yes, Vedic and Western astrology differ significantly. Vedic astrology uses the sidereal zodiac based on fixed star positions, while Western uses the tropical zodiac based on seasons. Vedic focuses on Moon sign and Ascendant, whereas Western emphasizes Sun sign. Vedic astrology includes Dasha systems for timing predictions and uses divisional charts for detailed analysis, which Western astrology doesn't employ."
        },
        {
            question: "Can Vedic Astrology predict marriage and career?",
            answer: "Yes, Vedic Astrology can predict marriage timing, compatibility, and career paths with good accuracy. The 7th house and Venus indicate marriage prospects, while the 10th house and Saturn show career direction. Dasha periods reveal when major events like marriage or job changes are likely. Kundali matching (Gun Milan) is used to assess marriage compatibility between partners."
        },
        {
            question: "Do I need exact birth time for Vedic Astrology?",
            answer: "Yes, exact birth time is crucial for accurate Vedic astrology predictions. Even a 4-minute difference can change your Ascendant (Lagna), which affects house placements and Dasha calculations. If you don't know your exact birth time, astrologers can use birth time rectification techniques, but predictions will be less precise. For best results, obtain your birth time from official birth records."
        },
        {
            question: "How does AstroPinch calculate Vedic birth charts?",
            answer: "AstroPinch uses Swiss Ephemeris, the most accurate astronomical database, to calculate planetary positions. We apply Lahiri Ayanamsa to convert positions to the sidereal zodiac. Our system automatically generates your Lagna chart, Navamsa chart, and all divisional charts. We calculate Vimshottari Dasha periods, planetary strengths (Shadbala), and Ashtakavarga scores. AI then interprets these calculations using traditional Vedic principles."
        }
    ];

    return (
        <div className="min-h-screen pt-20 pb-20">
            <SEO
                title="Vedic Astrology - Free Kundali & Birth Chart Analysis"
                description="Get your free Vedic astrology Kundali online. Accurate birth chart analysis, marriage matching, career predictions using authentic Jyotish Shastra. Generate now!"
                keywords="vedic astrology, free kundali, birth chart analysis, jyotish shastra, janam kundali, marriage matching, kundali matching, online kundali, vedic horoscope, career prediction, dasha predictions"
                url="/vedic-astrology"
            />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-amber-50">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20"></div>

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-widest border border-purple-100 mb-6">
                            <Star className="w-3 h-3 fill-purple-600" />
                            Ancient Wisdom, Modern Precision
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-primary uppercase italic tracking-tighter leading-none mb-6">
                            Vedic Astrology <br />
                            <span className="bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                                Made Simple
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
                            Discover your life path with authentic Vedic astrology. Get your free Kundali,
                            personalized predictions, and marriage compatibility analysis using the most
                            accurate astronomical calculations.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGetKundali}
                                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Generate Free Kundali
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={handleKundaliMatch}
                                className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-black text-lg uppercase tracking-wide border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300"
                            >
                                Check Compatibility
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-8 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">100% Free</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Instant Results</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Swiss Ephemeris Accuracy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is Vedic Astrology */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <div className="max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-6">
                        What is <span className="text-purple-600">Vedic Astrology?</span>
                    </h2>

                    <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                        <p>
                            Vedic Astrology, known as <strong>Jyotish Shastra</strong> in Sanskrit, is an ancient Indian
                            system of astrology with roots dating back over 5,000 years. The word "Jyotish" means
                            "science of light" and refers to the study of celestial bodies and their influence on human life.
                        </p>

                        <p>
                            Unlike Western astrology, Vedic astrology uses the <strong>sidereal zodiac</strong>, which is
                            based on the actual positions of constellations in the sky. This makes it astronomically accurate
                            and accounts for the precession of equinoxes—a gradual shift in Earth's axis that Western
                            astrology doesn't consider.
                        </p>

                        <p>
                            At the heart of Vedic astrology is your <strong>Kundali</strong> (birth chart)—a detailed map
                            showing where planets were positioned at your exact birth time and location. This chart reveals
                            your personality, strengths, challenges, and life path.
                        </p>

                        <p>
                            Vedic astrology focuses primarily on your <strong>Moon sign</strong> (Rashi) and
                            <strong> Ascendant</strong> (Lagna), rather than just your Sun sign. The Moon represents your
                            mind and emotions, making it more relevant for understanding your inner self and daily experiences.
                        </p>
                    </div>
                </div>
            </div>

            {/* Why More Accurate */}
            <div className="bg-gradient-to-br from-slate-50 to-purple-50 py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="max-w-4xl">
                        <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-6">
                            Why Vedic Astrology is <span className="text-purple-600">More Accurate</span>
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6 mt-8">
                            <div className="bg-white rounded-2xl p-6 border-2 border-purple-100">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-primary mb-3 uppercase">Sidereal Zodiac System</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Uses actual star positions in the sky, accounting for the 23.85-degree shift
                                    (Ayanamsa) between tropical and sidereal zodiacs. This astronomical precision
                                    makes predictions more aligned with reality.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border-2 border-purple-100">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                                    <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-primary mb-3 uppercase">Dasha Timing System</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    The Vimshottari Dasha system divides your life into precise planetary periods,
                                    allowing accurate prediction of when specific events will occur—not just what might happen.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border-2 border-purple-100">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-primary mb-3 uppercase">Divisional Charts</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Uses 16 specialized charts (Vargas) to analyze specific life areas like marriage (D9),
                                    career (D10), and children (D7), providing depth that single-chart systems can't match.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 border-2 border-purple-100">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-black text-primary mb-3 uppercase">5000+ Years of Refinement</h3>
                                <p className="text-slate-700 leading-relaxed">
                                    Thousands of years of observation, documentation, and refinement by ancient sages
                                    have created a comprehensive system tested across millions of birth charts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-12 text-center">
                    Vedic vs <span className="text-purple-600">Western Astrology</span>
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-2xl overflow-hidden border-2 border-slate-200">
                        <thead>
                            <tr className="bg-gradient-to-r from-purple-600 to-amber-600 text-white">
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wide">Aspect</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wide">Vedic Astrology</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wide">Western Astrology</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                    <td className="px-6 py-4 font-bold text-primary">{row.aspect}</td>
                                    <td className="px-6 py-4 text-slate-700">{row.vedic}</td>
                                    <td className="px-6 py-4 text-slate-700">{row.western}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* What You Can Predict */}
            <div className="bg-gradient-to-br from-purple-50 to-amber-50 py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-12 text-center">
                        What You Can <span className="text-purple-600">Predict</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {predictions.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-primary mb-3 uppercase tracking-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* How Our System Works */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-6 text-center">
                    How Our <span className="text-purple-600">System Works</span>
                </h2>
                <p className="text-xl text-slate-600 text-center max-w-3xl mx-auto mb-12">
                    AstroPinch uses cutting-edge technology combined with authentic Vedic astrology principles
                    to deliver the most accurate birth chart analysis available online.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {systemFeatures.map((feature, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-slate-100">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
                                    {idx + 1}
                                </div>
                                <h3 className="text-lg font-black text-primary uppercase tracking-tight">
                                    {feature.title}
                                </h3>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Free Kundali CTA */}
            <div className="bg-gradient-to-r from-purple-600 to-amber-600 py-20">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6">
                        Get Your Free Kundali Now
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Generate your personalized Vedic birth chart in seconds. Completely free,
                        accurate, and based on authentic Jyotish principles.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGetKundali}
                            className="px-12 py-5 bg-white text-purple-600 rounded-2xl font-black text-xl uppercase tracking-wide shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3"
                        >
                            Generate Free Kundali
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleKundaliMatch}
                            className="px-12 py-5 bg-purple-900 text-white rounded-2xl font-black text-xl uppercase tracking-wide hover:bg-purple-800 transition-all duration-300"
                        >
                            Check Marriage Match
                        </button>
                    </div>
                    <p className="text-white/80 text-sm mt-6">
                        No registration required • Instant results • 100% accurate calculations
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-20">
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-12 text-center">
                    Frequently Asked <span className="text-purple-600">Questions</span>
                </h2>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-purple-200 transition-all duration-300">
                            <h3 className="text-xl font-black text-primary mb-3 flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">
                                    ?
                                </span>
                                {faq.question}
                            </h3>
                            <p className="text-slate-700 leading-relaxed pl-9">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conclusion */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 pb-20">
                <div className="bg-gradient-to-br from-purple-50 to-amber-50 rounded-3xl p-8 md:p-12 border-2 border-purple-100">
                    <h2 className="text-3xl md:text-4xl font-black text-primary uppercase italic tracking-tighter mb-6">
                        Start Your Vedic Astrology Journey Today
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-6">
                        Vedic astrology offers profound insights into your life path, relationships, career, and future.
                        With AstroPinch, you get authentic Jyotish analysis powered by the most accurate astronomical
                        calculations available.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-8">
                        Our system combines ancient Vedic wisdom with modern AI technology to deliver personalized
                        predictions you can trust. Whether you're seeking career guidance, marriage compatibility,
                        or simply want to understand yourself better, your free Kundali is the first step.
                    </p>
                    <button
                        onClick={handleGetKundali}
                        className="px-10 py-4 bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                    >
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VedicAstrology;
