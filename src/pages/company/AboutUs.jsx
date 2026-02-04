import React from 'react';
import { Sparkles, Brain, Scroll, Heart } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 mb-6">
                    AstroPinch: Where Ancient Wisdom Meets AI
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    We are redefining the astrology experience by harmonizing the profound, time-tested principles of Vedic Astrology (Jyotish) with the precision and speed of modern Artificial Intelligence.
                </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Our mission is to make authentic, deep astrological guidance accessible, affordable, and incredibly easy to understand for everyone, everywhere.
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                            We believe that astrology shouldn't be shrouded in confusing jargon. It should be a clear, empowering tool for self-discovery and navigating life's challenges. By using AI to process complex planetary calculations and Vedic logic, we deliver insights that are both accurate and deeply personal.
                        </p>
                    </div>
                    <div className="relative h-64 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
                        {/* Abstract visual for Mission */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
                        <Sparkles className="w-24 h-24 text-primary/20 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Core Values Grid */}
            <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">What Sets Us Apart</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-4">
                        <Brain className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">AI-Powered Precision</h3>
                    <p className="text-sm text-slate-600">
                        Our engines crunch millions of planetary combinations in seconds to provide analysis that is mathematically precise and devoid of human error.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4">
                        <Scroll className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Vedic Authenticity</h3>
                    <p className="text-sm text-slate-600">
                        We strictly adhere to the classical texts of Parashara and Jaimini. Our algorithms are designed by expert Vedic astrologers.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mb-4">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Empathetic Guidance</h3>
                    <p className="text-sm text-slate-600">
                        We don't just predict; we guide. Our reports are written in a supportive, positive tone to help you make the best of your cosmic blueprint.
                    </p>
                </div>
            </div>

            {/* Story/Team */}
            <div className="text-center bg-slate-900 rounded-2xl p-8 md:p-12 text-white">
                <h2 className="text-2xl font-bold mb-4">Built for the Modern Seeker</h2>
                <p className="text-slate-300 max-w-2xl mx-auto mb-8">
                    AstroPinch was born from a simple question: "Why is high-quality astrology so hard to access?" We aggregated the best technological minds and astrological experts to answer that question with a platform that serves you.
                </p>
                <button className="px-6 py-3 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-100 transition-colors">
                    Start Your Journey
                </button>
            </div>
        </div>
    );
};

export default AboutUs;
