import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import {
    Sparkles, Star, Check, Crown, Zap, TrendingUp, Heart, Shield,
    BookOpen, Calendar, Users, Target, Award, ArrowRight, ChevronRight,
    Moon, Sun, Compass, Gift, Lock, Unlock
} from 'lucide-react';
import SEO from '../components/SEO';

const PremiumReports = () => {
    const navigate = useNavigate();
    const { profiles } = useProfile();
    const [selectedPlan, setSelectedPlan] = useState('comprehensive');

    const features = [
        {
            icon: BookOpen,
            title: "Comprehensive Birth Chart Analysis",
            description: "Detailed analysis of your Lagna (D1) and Navamsa (D9) charts with planetary positions, house placements, and aspect interpretations",
            category: "Core Analysis"
        },
        {
            icon: Crown,
            title: "Vimshottari Dasha Predictions",
            description: "120-year Mahadasha and Antardasha timeline with precise predictions for every planetary period affecting your life",
            category: "Timing"
        },
        {
            icon: Heart,
            title: "Advanced Kundali Matching",
            description: "36-point Ashta-Koota analysis, Manglik Dosha evaluation, Dasha synchronization, and Navamsa compatibility for marriage",
            category: "Relationships"
        },
        {
            icon: Target,
            title: "KP Astrology Insights",
            description: "Krishnamurti Paddhati system analysis with Star Lords, Sub Lords, and precise event timing predictions",
            category: "Advanced"
        },
        {
            icon: TrendingUp,
            title: "Career & Finance Forecast",
            description: "Detailed career path analysis, business timing, financial opportunities, and professional growth predictions",
            category: "Career"
        },
        {
            icon: Shield,
            title: "Health & Wellness Analysis",
            description: "Planetary influences on health, potential vulnerabilities, preventive measures, and wellness recommendations",
            category: "Health"
        },
        {
            icon: Calendar,
            title: "Yearly Predictions",
            description: "Month-by-month forecast for the upcoming year with auspicious dates, challenges, and opportunities",
            category: "Timing"
        },
        {
            icon: Users,
            title: "Relationship Compatibility",
            description: "In-depth analysis of romantic, family, and professional relationships with compatibility scores",
            category: "Relationships"
        },
        {
            icon: Compass,
            title: "Life Purpose & Dharma",
            description: "Discover your soul's purpose, karmic lessons, and spiritual path based on your birth chart",
            category: "Spiritual"
        },
        {
            icon: Moon,
            title: "Nakshatra Deep Dive",
            description: "Comprehensive analysis of your birth Nakshatra, its deity, characteristics, and life influences",
            category: "Core Analysis"
        },
        {
            icon: Zap,
            title: "Planetary Strengths (Shadbala)",
            description: "Detailed calculation of planetary strengths and weaknesses affecting different life areas",
            category: "Advanced"
        },
        {
            icon: Gift,
            title: "Personalized Remedies",
            description: "Customized mantras, gemstone recommendations, charity suggestions, and spiritual practices",
            category: "Remedies"
        },
        {
            icon: Sun,
            title: "Transit Predictions",
            description: "Current and upcoming planetary transits affecting your chart with timing and impact analysis",
            category: "Timing"
        },
        {
            icon: Award,
            title: "Yogas & Special Combinations",
            description: "Identification of Raja Yogas, Dhana Yogas, and other special planetary combinations in your chart",
            category: "Advanced"
        },
        {
            icon: Star,
            title: "AI-Powered Insights",
            description: "Advanced AI analysis combining traditional wisdom with modern data science for deeper understanding",
            category: "Technology"
        },
        {
            icon: BookOpen,
            title: "Detailed PDF Report",
            description: "Professional 50+ page downloadable PDF report with charts, tables, and comprehensive analysis",
            category: "Deliverable"
        }
    ];

    const plans = [
        {
            id: 'essential',
            name: 'Essential Report',
            price: '₹999',
            originalPrice: '₹1,999',
            discount: '50% OFF',
            description: 'Perfect for beginners exploring Vedic astrology',
            features: [
                'Birth Chart Analysis (Lagna)',
                'Basic Planetary Positions',
                'Current Dasha Period',
                '1-Year Predictions',
                'Basic Remedies',
                'PDF Report (25 pages)',
                'Email Support'
            ],
            popular: false,
            color: 'purple'
        },
        {
            id: 'comprehensive',
            name: 'Comprehensive Report',
            price: '₹2,499',
            originalPrice: '₹4,999',
            discount: '50% OFF',
            description: 'Most popular choice for complete life insights',
            features: [
                'Everything in Essential',
                'Navamsa (D9) Chart Analysis',
                'Full Vimshottari Dasha Timeline',
                '5-Year Detailed Predictions',
                'Career & Finance Forecast',
                'Relationship Compatibility',
                'Health Analysis',
                'Nakshatra Deep Dive',
                'Personalized Remedies',
                'PDF Report (50+ pages)',
                'Priority Email Support',
                'One Follow-up Consultation'
            ],
            popular: true,
            color: 'amber'
        },
        {
            id: 'premium',
            name: 'Premium Deluxe',
            price: '₹4,999',
            originalPrice: '₹9,999',
            discount: '50% OFF',
            description: 'Ultimate package for serious astrology enthusiasts',
            features: [
                'Everything in Comprehensive',
                'KP Astrology Analysis',
                'All Divisional Charts (D1-D60)',
                'Lifetime Dasha Predictions',
                'Advanced Yogas Analysis',
                'Shadbala & Ashtakavarga',
                'Transit Predictions (3 years)',
                'Kundali Matching (if applicable)',
                'Monthly Updates (1 year)',
                'Personalized Video Summary',
                'PDF Report (100+ pages)',
                '24/7 Priority Support',
                'Quarterly Consultations (4 sessions)'
            ],
            popular: false,
            color: 'rose'
        }
    ];

    const testimonials = [
        {
            name: "Priya Sharma",
            location: "Mumbai, India",
            rating: 5,
            text: "The comprehensive report was incredibly accurate! The career predictions helped me make the right decision about my job change. Worth every rupee!",
            image: "PS"
        },
        {
            name: "Rajesh Kumar",
            location: "Delhi, India",
            rating: 5,
            text: "I was skeptical at first, but the detailed analysis and remedies have genuinely improved my life. The Kundali matching for my marriage was spot on.",
            image: "RK"
        },
        {
            name: "Anjali Patel",
            location: "Ahmedabad, India",
            rating: 5,
            text: "The AI-powered insights combined with traditional Vedic wisdom gave me clarity I've been seeking for years. Highly recommended!",
            image: "AP"
        }
    ];

    const handleGetReport = (planId) => {
        if (profiles.length === 0) {
            navigate('/profiles');
        } else {
            navigate('/report');
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-20">
            <SEO
                title="Premium Astrology Reports - Comprehensive Vedic Analysis"
                description="Get your personalized premium Vedic astrology report with detailed birth chart analysis, Dasha predictions, career forecast, relationship compatibility, and AI-powered insights. 50+ page professional PDF report."
                keywords="premium astrology report, vedic astrology report, birth chart analysis, kundali report, dasha predictions, astrology consultation, personalized horoscope"
                url="/premium-reports"
            />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-amber-50">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-300 rounded-full blur-3xl opacity-20"></div>

                <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32">
                    <div className="text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-amber-500 text-white text-sm font-bold uppercase tracking-widest shadow-lg">
                            <Crown className="w-4 h-4" />
                            Premium Reports
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-primary uppercase italic tracking-tighter leading-none">
                            Unlock Your <br />
                            <span className="bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
                                Cosmic Blueprint
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
                            Get a comprehensive 50+ page personalized Vedic astrology report powered by ancient wisdom and modern AI.
                            Discover your life path, career opportunities, relationship compatibility, and precise predictions.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => handleGetReport(selectedPlan)}
                                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-amber-600 text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            >
                                Get Your Report Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="flex items-center gap-2 text-slate-600">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">P</div>
                                    <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">R</div>
                                    <div className="w-8 h-8 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                                </div>
                                <span className="text-sm font-semibold">1,250+ Happy Customers</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 pt-8">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">100% Accurate</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">AI-Powered</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Instant Delivery</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-700">
                                <Check className="w-5 h-5 text-green-600" />
                                <span className="font-semibold">Money-Back Guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-4">
                        What's <span className="text-purple-600">Included</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Comprehensive analysis covering every aspect of your life with precision and depth
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={idx}
                                className="group relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="absolute top-4 right-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                                        {feature.category}
                                    </span>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-black text-primary mb-2 uppercase tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Pricing Plans */}
            <div className="bg-gradient-to-br from-slate-50 to-purple-50 py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-4">
                            Choose Your <span className="text-purple-600">Plan</span>
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Select the perfect report package for your astrological journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className={`relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.popular
                                        ? 'border-amber-400 shadow-xl scale-105'
                                        : 'border-slate-200'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                                            <Star className="w-4 h-4 fill-white" />
                                            Most Popular
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-black text-primary uppercase mb-2">
                                        {plan.name}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        {plan.description}
                                    </p>
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <span className="text-5xl font-black text-primary">
                                            {plan.price}
                                        </span>
                                        <div className="text-left">
                                            <div className="text-slate-400 line-through text-sm">
                                                {plan.originalPrice}
                                            </div>
                                            <div className="text-green-600 font-black text-sm">
                                                {plan.discount}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-slate-700 text-sm font-medium">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleGetReport(plan.id)}
                                    className={`w-full py-4 rounded-xl font-black uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${plan.popular
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-amber-500/50 hover:scale-105'
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                        }`}
                                >
                                    Get This Report
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter mb-4">
                        What Our <span className="text-purple-600">Customers Say</span>
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Join thousands of satisfied customers who discovered their cosmic path
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-8 border-2 border-slate-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-slate-700 leading-relaxed mb-6 italic">
                                "{testimonial.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white font-black">
                                    {testimonial.image}
                                </div>
                                <div>
                                    <div className="font-black text-primary">
                                        {testimonial.name}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        {testimonial.location}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-purple-600 to-amber-600 py-20">
                <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                    <Sparkles className="w-16 h-16 text-white mx-auto mb-6 animate-pulse" />
                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6">
                        Ready to Discover Your Destiny?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Get your comprehensive Vedic astrology report today and unlock the secrets of your cosmic blueprint
                    </p>
                    <button
                        onClick={() => handleGetReport(selectedPlan)}
                        className="px-12 py-5 bg-white text-purple-600 rounded-2xl font-black text-xl uppercase tracking-wide shadow-2xl hover:shadow-white/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
                    >
                        Get Your Report Now
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    <p className="text-white/80 text-sm mt-6">
                        ✓ Instant delivery ✓ 100% secure ✓ Money-back guarantee
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PremiumReports;
