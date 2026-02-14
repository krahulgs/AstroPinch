import React, { useState } from 'react';
import { useChart } from '../context/ChartContext';
import { Navigate } from 'react-router-dom';
import { BookOpen, Info, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';

const Kundali = () => {
    const { userData, kundaliSvg, chartAnalysis } = useChart();
    const [selectedHouse, setSelectedHouse] = useState(null);

    if (!userData || !kundaliSvg) {
        return <Navigate to="/chart" replace />;
    }

    const getBirthDay = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    return (
        <div className="space-y-12 pb-20">
            <SEO
                title={`${userData.name}'s Vedic Kundali`}
                description={`View the traditional Vedic Janma Patrika for ${userData.name}. Detailed house analysis and planetary positions.`}
                url="/kundali"
            />
            <div className="text-center space-y-4 pt-10 px-4">
                <span className="text-primary font-medium tracking-widest uppercase text-sm">Vedic Janma Patrika</span>
                <h2 className="text-5xl font-black text-primary uppercase tracking-tighter italic">
                    Your Traditional Kundali
                </h2>

                {/* Birth Record Card */}
                <div className="max-w-4xl mx-auto mt-10 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-[3rem] blur-2xl opacity-50"></div>
                    <div className="relative glass-panel p-8 md:p-10 rounded-[3rem] bg-white border border-primary/10 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Sparkles className="w-24 h-24 text-primary" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center relative z-10">
                            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-8 text-center md:text-left">
                                <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Celestial Subject</p>
                                <h3 className="text-2xl font-black text-primary truncate">{userData.name}</h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mt-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Born on {getBirthDay(userData.date)}</span>
                                </div>
                            </div>

                            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Birth Date</p>
                                    <p className="text-primary font-bold">{new Date(userData.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Moment of Birth</p>
                                    <p className="text-primary font-bold">{userData.time}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Physical Location</p>
                                    <p className="text-primary font-bold truncate">{userData.place}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto px-4">
                {/* Visual Chart Section */}
                <div className="space-y-6">
                    <div className="glass-panel p-8 rounded-3xl flex items-center justify-center bg-white border border-primary/10 aspect-square overflow-hidden shadow-2xl relative">
                        {/* Decorative background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>

                        <div
                            className="w-full h-full flex items-center justify-center chart-svg-container relative z-10 [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg_text]:fill-primary [&>svg_path]:stroke-gray-900 [&>svg_circle]:stroke-gray-900"
                            dangerouslySetInnerHTML={{ __html: kundaliSvg }}
                        />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                        <Info className="w-5 h-5 text-primary flex-shrink-0" />
                        <p className="text-xs text-secondary leading-relaxed">
                            Numbers in the chart represent Houses (Bhavas). Planets are placed in the specific house where they were located at the time of your birth.
                        </p>
                    </div>
                </div>

                {/* Detailed Explanation Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter flex items-center gap-3">
                            <BookOpen className="w-8 h-8 text-primary" />
                            Soul Path Analysis
                        </h3>
                    </div>

                    <div className="space-y-6 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
                        {chartAnalysis?.map((house) => (
                            <div
                                key={house.house}
                                className={`relative group glass-panel p-8 rounded-[2.5rem] bg-white border border-gray-100 hover:border-primary/30 transition-all duration-500 ${selectedHouse === house.house ? 'ring-2 ring-primary/30 bg-primary/5' : 'shadow-lg'
                                    }`}
                                onMouseEnter={() => setSelectedHouse(house.house)}
                                onMouseLeave={() => setSelectedHouse(null)}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl font-black text-primary/30">#{house.house}</span>
                                            <h4 className="text-lg font-black text-primary uppercase tracking-tight">
                                                {house.title.split('-')[0]}
                                            </h4>
                                        </div>
                                        <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">{house.title.split('-')[1] || 'Vedic Realm'}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-end max-w-[150px]">
                                        {house.planets !== "Empty" ? (
                                            house.planets.split(', ').map(p => (
                                                <span key={p} className="text-[10px] bg-primary/10 border border-primary/20 px-2 py-1 rounded-full text-primary font-black uppercase tracking-widest animate-in fade-in zoom-in">
                                                    {p}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Quiet Realm</span>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6 relative z-10">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <p className="text-secondary text-sm italic font-medium leading-relaxed">
                                            "{house.interpretation}"
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-primary/70 uppercase tracking-widest">Planetary Synergy</p>
                                        <p className="text-primary text-sm font-bold leading-relaxed">
                                            {house.deep_analysis}
                                        </p>
                                    </div>

                                    {house.remedies && house.remedies.length > 0 && (
                                        <div className="pt-6 border-t border-gray-100 space-y-4">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                                <Sparkles className="w-3 h-3" /> Vedic Remedy
                                            </div>
                                            <div className="space-y-2">
                                                {house.remedies.map((rem, i) => (
                                                    <div key={i} className="flex gap-3 items-start p-3 bg-rose-50 border border-rose-100 rounded-xl">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0"></div>
                                                        <p className="text-secondary text-xs font-medium leading-relaxed">
                                                            {rem.action}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kundali;
