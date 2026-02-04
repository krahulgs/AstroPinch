import React from 'react';
import { useChart } from '../context/ChartContext';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const Predictions = () => {
    const { userData, chartData } = useChart();

    if (!userData || !chartData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
                <Sparkles className="w-16 h-16 text-purple-400 animate-pulse" />
                <h2 className="text-3xl font-bold text-slate-200">The Future Awaits</h2>
                <p className="text-slate-400 max-w-lg">
                    Enter your birth details to unlock the secrets of your timeline.
                </p>
                <Link to="/chart" className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                    Enter Birth Details
                </Link>
            </div>
        );
    }

    const getAscendantInsight = (asc) => {
        const insights = {
            Aries: "Your natural leadership will be tested next month. Trust your instincts.",
            Taurus: "Financial stability is on the horizon. A seed you planted months ago finally sprouts.",
            Gemini: "New social circles will open up. One conversation could change your trajectory.",
            Cancer: "A period of emotional nesting will lead to great inner clarity.",
            Leo: "You'll be in the spotlight soon. Prepare for a creative breakthrough.",
            Virgo: "Focus on organization. A systematic approach brings unexpected freedom.",
            Libra: "Collaborations are favored. Someone new brings a needed perspective.",
            Scorpio: "A deep transformation is completing. You are ready for the next level.",
            Sagittarius: "A distant goal becomes much clearer. Travel plans may be rewarding.",
            Capricorn: "Career recognition is coming. Your persistence has not gone unnoticed.",
            Aquarius: "Breakthrough ideas are flowing. Share your vision with like-minded peers.",
            Pisces: "Your intuition is your superpower this month. Pay attention to your dreams."
        };
        return insights[asc] || "A significant planetary transit suggests unique opportunities coming your way.";
    };

    const { bestPrediction, chartSvg } = useChart();

    return (
        <div className="max-w-6xl mx-auto space-y-12 pt-10">
            <SEO
                title="Your Life Predictions"
                description="Unlock the secrets of your timeline with aggregated analysis from multiple cosmic engines."
                url="/predictions"
            />
            <div className="text-center space-y-2">
                <span className="text-primary font-medium tracking-widest uppercase text-sm">The Unified Oracle</span>
                <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                    Your Best Prediction
                </h2>
                <p className="text-secondary max-w-2xl mx-auto">
                    Aggregated analysis from Kerykeion, VedAstro, OpenAstro2, and PyJHora engines.
                </p>
            </div>

            {/* Main Summary Section */}
            <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden bg-white border-l-8 border-l-primary border border-t-gray-100 border-r-gray-100 border-b-gray-100 shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20"></div>
                <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-amber-500" />
                    Overall Life Trend
                </h3>
                <p className="text-xl text-secondary leading-relaxed font-light italic">
                    "{bestPrediction?.best_prediction || "Your path is currently being calculated by the cosmic engines..."}"
                </p>
                <div className="mt-8">
                    <Link
                        to="/horoscope"
                        className="inline-flex items-center gap-3 px-6 py-2 border border-amber-500/30 bg-amber-50 text-amber-600 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-amber-100 transition-colors"
                    >
                        <Sparkles className="w-3 h-3" />
                        Explore Your Daily Horoscope
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Natal Chart Component */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-primary ml-2">Your Natal Blueprint</h3>
                    <div className="glass-panel p-6 rounded-3xl flex items-center justify-center bg-white border border-gray-100 aspect-square overflow-hidden shadow-2xl">
                        {chartSvg ? (
                            <div
                                className="w-full h-full flex items-center justify-center chart-svg-container"
                                dangerouslySetInnerHTML={{ __html: chartSvg }}
                            />
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                                <p className="text-secondary">Loading Celestial Map...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Multi-System Details */}
                <div className="space-y-6">
                    {/* Western Analysis */}
                    <div className="glass-panel p-6 rounded-2xl bg-white border border-gray-100 hover:border-primary/20 transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold uppercase text-xs tracking-widest text-primary">Western Natal Analysis</h4>
                                <p className="text-sm text-secondary">Engine: Kerykeion</p>
                            </div>
                            <span className="px-2 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded border border-primary/10">PLACIDUS</span>
                        </div>
                        <p className="text-secondary leading-relaxed text-sm">
                            {bestPrediction?.western?.insight}
                        </p>
                    </div>

                    {/* Vedic Wisdom */}
                    <div className="glass-panel p-6 rounded-2xl bg-white border border-gray-100 hover:border-amber-500/30 transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold uppercase text-xs tracking-widest text-amber-600">Vedic Spiritual Trends</h4>
                                <p className="text-sm text-secondary">Engine: VedAstro & PyJHora</p>
                            </div>
                            <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded border border-amber-100">SIDEREAL</span>
                        </div>
                        <p className="text-secondary leading-relaxed text-sm">
                            {bestPrediction?.vedic?.insight}
                        </p>
                    </div>

                    {/* Technical Data */}
                    <div className="glass-panel p-6 rounded-2xl bg-white border border-gray-100 hover:border-blue-500/30 transition-all shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold uppercase text-xs tracking-widest text-blue-600">Advanced Astronomical Data</h4>
                                <p className="text-sm text-secondary">Engine: OpenAstro2</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-[10px] text-secondary">
                                AYANAMSA: <span className="text-primary ml-1">{bestPrediction?.technical?.data?.ayanamsa}</span>
                            </div>
                            <div className="text-[10px] text-secondary">
                                PRECISION: <span className="text-primary ml-1 text-green-600">✓ HIGH</span>
                            </div>
                        </div>
                        <p className="text-secondary leading-relaxed text-sm mt-3">
                            Calculation methodology uses NASA JPL Ephemeris for maximum mathematical fidelity.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Predictions;
