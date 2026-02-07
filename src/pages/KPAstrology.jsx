import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import {
    Target, Clock, CheckCircle, TrendingUp, Heart, Briefcase,
    Calendar, Users, ArrowRight, Zap, Award, Shield, BookOpen,
    Star, ChevronRight, Sparkles, Globe
} from 'lucide-react';
import SEO from '../components/SEO';

const KPAstrology = () => {
    const navigate = useNavigate();
    const { profiles } = useProfile();

    const handleGetReport = () => {
        if (profiles.length === 0) {
            navigate('/profiles');
        } else {
            navigate('/chart');
        }
    };

    const accuracyFeatures = [
        {
            icon: Target,
            title: "Pinpoint Event Timing",
            description: "KP Astrology uses sub-lord theory to predict exact dates and times for events like job changes, marriage, or property purchase with remarkable precision."
        },
        {
            icon: CheckCircle,
            title: "Yes/No Answers",
            description: "Get clear, unambiguous answers to specific questions. KP system eliminates confusion by providing definite yes or no predictions."
        },
        {
            icon: Clock,
            title: "Ruling Planets Method",
            description: "The ruling planets at the time of judgment reveal the outcome. This unique technique provides instant clarity on any question."
        },
        {
            icon: Shield,
            title: "No Contradictions",
            description: "KP system's logical framework eliminates conflicting predictions that often arise in traditional astrology, ensuring consistent results."
        }
    ];

    const howItWorks = [
        {
            step: "1",
            title: "Cuspal Sub-Lord",
            description: "Each house cusp has a sub-lord that determines whether the house will give results. This is the foundation of KP predictions."
        },
        {
            step: "2",
            title: "Star Lord (Nakshatra Lord)",
            description: "Planets are analyzed based on the constellation (nakshatra) they occupy, not just their zodiac sign. The star lord reveals the true nature of events."
        },
        {
            step: "3",
            title: "Significators",
            description: "Planets connected to specific houses through lordship, occupation, or aspect become significators. Their combined influence determines outcomes."
        },
        {
            step: "4",
            title: "Ruling Planets",
            description: "At the time of question (Prashna), ruling planets (Ascendant lord, Moon star lord, Day lord) indicate the answer and timing."
        },
        {
            step: "5",
            title: "Dasha & Transit",
            description: "Events occur when Dasha (planetary period) and Transit align with significators. KP provides exact dates using this synchronization."
        },
        {
            step: "6",
            title: "Ayanamsa Precision",
            description: "KP uses Krishnamurti Ayanamsa (23°51'23\" for 2024), ensuring accurate planetary positions for precise predictions."
        }
    ];

    const predictions = [
        {
            icon: Briefcase,
            title: "Job & Career Timing",
            description: "Predict exact timing for job offers, promotions, transfers, or career changes. Know when opportunities will materialize."
        },
        {
            icon: Heart,
            title: "Marriage & Relationships",
            description: "Determine marriage timing, partner characteristics, and relationship outcomes. Get clear yes/no answers about proposals."
        },
        {
            icon: TrendingUp,
            title: "Business & Finance",
            description: "Forecast business success, partnership outcomes, loan approvals, and financial gains with specific timeframes."
        },
        {
            icon: Calendar,
            title: "Property & Assets",
            description: "Predict property purchase timing, inheritance matters, and asset acquisition with date-level accuracy."
        },
        {
            icon: Users,
            title: "Children & Family",
            description: "Determine childbirth timing, family events, and resolve questions about children's education or career."
        },
        {
            icon: Globe,
            title: "Foreign Travel & Settlement",
            description: "Predict foreign travel opportunities, visa approvals, and chances of settling abroad with precise timing."
        }
    ];

    const comparisonData = [
        {
            aspect: "House System",
            kp: "Placidus cusps with sub-lord analysis",
            vedic: "Whole sign or equal house system"
        },
        {
            aspect: "Primary Focus",
            kp: "Nakshatra (star) and sub-lord",
            vedic: "Zodiac sign and planet placement"
        },
        {
            aspect: "Prediction Method",
            kp: "Significator theory and ruling planets",
            vedic: "Dasha, transit, and yogas"
        },
        {
            aspect: "Event Timing",
            kp: "Exact dates using sub-periods",
            vedic: "General time periods (months/years)"
        },
        {
            aspect: "Question Analysis",
            kp: "Horary (Prashna) with ruling planets",
            vedic: "Birth chart analysis primarily"
        },
        {
            aspect: "Accuracy Level",
            kp: "Pinpoint precision for specific events",
            vedic: "Broader predictions and trends"
        },
        {
            aspect: "Ayanamsa Used",
            kp: "Krishnamurti Ayanamsa (23°51'23\")",
            vedic: "Lahiri Ayanamsa (23°51'16\")"
        }
    ];

    const faqs = [
        {
            question: "What is KP Astrology?",
            answer: "KP Astrology (Krishnamurti Paddhati) is a modern, precise astrology system developed by Prof. K.S. Krishnamurti in the 1960s. It uses sub-lord theory and ruling planets to predict exact timing of events. Unlike traditional Vedic astrology, KP focuses on nakshatras (star constellations) and house cusps to eliminate contradictions and provide clear yes/no answers."
        },
        {
            question: "How accurate is KP Astrology for predictions?",
            answer: "KP Astrology is highly accurate for event-based predictions when birth time is precise. It can predict events to the exact date using sub-lord theory and significator analysis. The system's logical framework eliminates contradictions common in traditional astrology. Accuracy depends on correct birth data and proper application of KP principles by the astrologer."
        },
        {
            question: "Can KP Astrology predict marriage timing?",
            answer: "Yes, KP Astrology excels at predicting marriage timing with date-level accuracy. It analyzes 7th house cuspal sub-lord, Venus, and significators of houses 2, 7, and 11. The ruling planets method can answer specific questions like 'Will this proposal succeed?' The Dasha-Bhukti-Antara periods of significators indicate exact marriage timing."
        },
        {
            question: "What is the difference between KP and Vedic Astrology?",
            answer: "KP Astrology uses Placidus house cusps and sub-lord theory, while Vedic uses whole sign houses. KP focuses on nakshatra lords and provides pinpoint event timing, whereas Vedic gives broader time periods. KP's ruling planets method offers instant yes/no answers. Both use sidereal zodiac but different ayanamsas (KP: 23°51'23\", Vedic: 23°51'16\")."
        },
        {
            question: "Can KP Astrology answer yes or no questions?",
            answer: "Yes, KP Astrology specializes in yes/no questions through the ruling planets method. At the time of question, the Ascendant lord, Moon star lord, and Day lord are analyzed as significators. If they connect to favorable houses, the answer is yes; if to unfavorable houses, it's no. This provides clear, unambiguous answers."
        },
        {
            question: "What is sub-lord in KP Astrology?",
            answer: "Sub-lord is the most crucial element in KP Astrology. Each nakshatra (13°20') is divided into 9 sub-divisions ruled by different planets. The sub-lord of a house cusp determines whether that house will give results. For example, if 7th cusp sub-lord is connected to houses 2-7-11, marriage happens; if to 1-6-10, it may be delayed or denied."
        },
        {
            question: "Do I need exact birth time for KP Astrology?",
            answer: "Yes, exact birth time (within 2-3 minutes) is essential for KP Astrology because it uses Placidus house cusps. Even a 4-minute difference can change the cuspal sub-lord, altering predictions completely. If birth time is unknown, KP offers Horary (Prashna) astrology where questions are answered based on the time of asking, not birth time."
        }
    ];

    return (
        <div className="min-h-screen pt-20 pb-20">
            <SEO
                title="KP Astrology - Accurate Event Predictions & Timing"
                description="Master KP Astrology (Krishnamurti Paddhati) for precise event timing. Get accurate predictions for marriage, job, business with exact dates. Learn KP system now!"
                keywords="KP astrology, Krishnamurti Paddhati, KP astrology predictions, KP astrology marriage, KP astrology job timing, KP astrology yes no, sub lord, ruling planets, horary astrology, KP system"
                url="/kp-astrology"
            />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20"></div>

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
                    <div className="max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest border border-blue-100 mb-6">
                            <Target className="w-3 h-3" />
                            Precision Astrology System
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-primary uppercase italic tracking-tighter leading-none mb-6">
                            KP Astrology <br />
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Pinpoint Predictions
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
                            Get exact dates for life events using Krishnamurti Paddhati—the most accurate
                            astrology system for marriage timing, job changes, and yes/no answers.
                            No vague predictions, only precise results.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleGetReport}
                                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Get KP Analysis
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/premium-reports')}
                                className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-lg uppercase tracking-wide border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300"
                            >
                                View Reports
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-8 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Exact Date Predictions</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Yes/No Answers</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Scientific Method</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* What is KP Astrology */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <div className="max-w-4xl">
                    <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-6">
                        What is <span className="text-blue-600">KP Astrology?</span>
                    </h2>

                    <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                        <p>
                            <strong>KP Astrology</strong> (Krishnamurti Paddhati) is a modern, precise astrology system
                            developed by late Prof. K.S. Krishnamurti in the 1960s. It revolutionized Vedic astrology by
                            introducing the <strong>sub-lord theory</strong>—a method that provides exact timing for events.
                        </p>

                        <p>
                            Unlike traditional Vedic astrology that gives broad time periods, KP Astrology can predict
                            events down to the exact date. It achieves this by dividing each nakshatra (star constellation)
                            into nine sub-divisions, each ruled by a different planet called the <strong>sub-lord</strong>.
                        </p>

                        <p>
                            The system uses <strong>Placidus house cusps</strong> instead of whole sign houses. The sub-lord
                            of each house cusp determines whether that house will deliver results. This eliminates the
                            contradictions often found in traditional astrology.
                        </p>

                        <p>
                            KP Astrology is particularly effective for <strong>horary questions</strong> (Prashna)—answering
                            specific yes/no questions using the ruling planets at the time of asking. This makes it ideal
                            for practical, event-based predictions like job timing, marriage prospects, or business outcomes.
                        </p>

                        <p>
                            The system uses <strong>Krishnamurti Ayanamsa</strong> (23°51'23\" for 2024), which differs
                            slightly from Lahiri Ayanamsa used in traditional Vedic astrology. This precision ensures
                            accurate planetary positions for reliable predictions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Why KP is Accurate */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="max-w-4xl mx-auto mb-12">
                        <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-6 text-center">
                            Why KP Astrology is <span className="text-blue-600">Highly Accurate</span>
                        </h2>
                        <p className="text-xl text-slate-600 text-center">
                            KP Astrology's precision comes from its logical, scientific approach to planetary analysis
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {accuracyFeatures.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-black text-primary mb-3 uppercase tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* How KP Works */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-6 text-center">
                    How <span className="text-blue-600">KP Astrology</span> Works
                </h2>
                <p className="text-xl text-slate-600 text-center max-w-3xl mx-auto mb-12">
                    Understanding the core principles that make KP Astrology the most precise prediction system
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {howItWorks.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-blue-200 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-black text-primary uppercase tracking-tight">
                                    {item.title}
                                </h3>
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* What KP Can Predict */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-12 text-center">
                        What KP Astrology <span className="text-blue-600">Can Predict</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {predictions.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
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

            {/* Comparison Table */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-12 text-center">
                    KP vs <span className="text-blue-600">Traditional Vedic</span>
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full bg-white rounded-2xl overflow-hidden border-2 border-slate-200">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wide">Aspect</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wide">KP Astrology</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wide">Traditional Vedic</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisonData.map((row, idx) => (
                                <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                    <td className="px-6 py-4 font-bold text-primary">{row.aspect}</td>
                                    <td className="px-6 py-4 text-slate-700">{row.kp}</td>
                                    <td className="px-6 py-4 text-slate-700">{row.vedic}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reports CTA */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-20">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <Zap className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6">
                        Get Your KP Astrology Report
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Receive precise predictions with exact dates for marriage, job, business, and life events.
                        Professional KP analysis based on authentic Krishnamurti Paddhati principles.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={handleGetReport}
                            className="px-12 py-5 bg-white text-blue-600 rounded-2xl font-black text-xl uppercase tracking-wide shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-3"
                        >
                            Generate KP Chart
                            <ArrowRight className="w-6 h-6" />
                        </button>
                        <button
                            onClick={() => navigate('/premium-reports')}
                            className="px-12 py-5 bg-blue-900 text-white rounded-2xl font-black text-xl uppercase tracking-wide hover:bg-blue-800 transition-all duration-300"
                        >
                            Premium Reports
                        </button>
                    </div>
                    <p className="text-white/80 text-sm mt-6">
                        Instant analysis • Exact timing • Clear answers • Professional interpretation
                    </p>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-20">
                <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-12 text-center">
                    Frequently Asked <span className="text-blue-600">Questions</span>
                </h2>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-blue-200 transition-all duration-300">
                            <h3 className="text-xl font-black text-primary mb-3 flex items-start gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">
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
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border-2 border-blue-100">
                    <h2 className="text-3xl md:text-4xl font-black text-primary uppercase italic tracking-tighter mb-6">
                        Experience Precision with KP Astrology
                    </h2>
                    <p className="text-lg text-slate-700 leading-relaxed mb-6">
                        KP Astrology offers what traditional systems cannot—exact dates, clear yes/no answers,
                        and logical predictions based on scientific principles. Whether you need marriage timing,
                        job change dates, or business decisions, KP provides precise guidance.
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-8">
                        Our KP analysis uses authentic Krishnamurti Paddhati methods with proper sub-lord calculations,
                        ruling planets analysis, and significator theory. Get professional reports that help you make
                        informed decisions with confidence.
                    </p>
                    <button
                        onClick={handleGetReport}
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                    >
                        Start KP Analysis
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KPAstrology;
