import React from 'react';
import { Users, LineChart, Globe, Zap, Check } from 'lucide-react';
import SEO from '../../components/SEO';

const Partnership = () => {
    return (
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
            <SEO
                title="Partnership & API"
                description="Scale your astrology practice or integrate cosmic intelligence into your application. Explore whitelabel reports and our high-performance astrology API."
                url="/partnership"
            />
            <div className="text-center mb-16">
                <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm mb-4">Join Our Ecosystem</span>
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-6">
                    Partner with AstroPinch
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Scale your astrology practice or integrate cosmic intelligence into your business with our robust API and partnership programs.
                </p>
            </div>

            {/* Two Tracks */}
            <div className="grid md:grid-cols-2 gap-8 mb-20">

                {/* For Astrologers */}
                <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden group hover:border-blue-300 transition-colors">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users size={120} />
                    </div>
                    <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                        <Users className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">For Professional Astrologers</h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Use our advanced calculation engine to generate reports for your clients instantly. Focus on consultation while we handle the math.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-700">
                            <Check className="w-5 h-5 text-green-500" /> <span>Whitelabel Reports with your branding</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <Check className="w-5 h-5 text-green-500" /> <span>Advanced Dasha & Transit Tools</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <Check className="w-5 h-5 text-green-500" /> <span>Client Management Dashboard</span>
                        </li>
                    </ul>
                    <button className="w-full py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all">
                        Join Astrologer Network
                    </button>
                </div>

                {/* For Business/API */}
                <div className="bg-slate-900 p-8 md:p-10 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Globe size={120} className="text-white" />
                    </div>
                    <div className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                        <Zap className="w-7 h-7" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">API for Developers & Business</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Integrate horoscopes, matchmaking, and birth chart data directly into your app or website with our high-performance JSON API.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-300">
                            <Check className="w-5 h-5 text-blue-400" /> <span>Restful API with &lt; 100ms latency</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <Check className="w-5 h-5 text-blue-400" /> <span>Extensive Documentation</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-300">
                            <Check className="w-5 h-5 text-blue-400" /> <span>Pay-as-you-go pricing</span>
                        </li>
                    </ul>
                    <button className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                        Get API Key
                    </button>
                </div>

            </div>

            {/* Stats/Trust */}
            <div className="bg-slate-50 rounded-2xl p-12 text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-8">Trusted by innovators worldwide</h3>
                <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale">
                    {/* Logo placeholders */}
                    <span className="text-2xl font-black text-slate-400">STARGAZE</span>
                    <span className="text-2xl font-black text-slate-400">MYSTIC.AI</span>
                    <span className="text-2xl font-black text-slate-400">VEDICLABS</span>
                    <span className="text-2xl font-black text-slate-400">HOROSCOPE+</span>
                </div>
            </div>
        </div>
    );
};

export default Partnership;
