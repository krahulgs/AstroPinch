import React from 'react';
import { useChart } from '../context/ChartContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const BirthChart = () => {
    const { userData, chartData, chartSvg } = useChart();
    const navigate = useNavigate();

    if (!userData || !chartData) {
        return <Navigate to="/chart" replace />;
    }

    const getSymbol = (name) => {
        const symbols = {
            Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂',
            Jupiter: '♃', Saturn: '♄', Uranus: '♅', Neptune: '♆', Pluto: '♇'
        };
        return symbols[name] || '•';
    };

    const getColor = (name) => {
        const colors = {
            Sun: 'text-amber-600', Moon: 'text-slate-600', Mercury: 'text-emerald-600',
            Venus: 'text-pink-600', Mars: 'text-red-600', Jupiter: 'text-orange-600',
            Saturn: 'text-amber-800', Uranus: 'text-cyan-600', Neptune: 'text-indigo-600',
            Pluto: 'text-purple-700'
        };
        return colors[name] || 'text-slate-500';
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-primary">
                    {userData.name}'s Natal Chart
                </h2>
                <p className="text-secondary">
                    Born on {new Date(userData.date).toLocaleDateString()} at {userData.time} in {userData.place}
                </p>
                <div className="pt-4">
                    <Link
                        to="/horoscope"
                        className="inline-flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-full font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-transform group"
                    >
                        <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                        View Daily Guidance
                    </Link>

                    <button
                        onClick={() => navigate('/report/consolidated', { state: { userData } })}
                        className="inline-flex items-center gap-3 px-8 py-3 bg-white border border-primary/20 text-primary rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-gray-50 transition-colors ml-4"
                    >
                        View Consolidated Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Chart Visualization */}
                <div className="glass-panel p-4 rounded-3xl flex items-center justify-center relative bg-white border border-primary/10 shadow-lg aspect-square overflow-hidden">
                    {chartSvg ? (
                        <div
                            className="w-full h-full flex items-center justify-center chart-svg-container [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg_text]:fill-primary [&>svg_path]:stroke-gray-900 [&>svg_circle]:stroke-gray-900"
                            dangerouslySetInnerHTML={{ __html: chartSvg }}
                        />
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                            <p className="text-secondary">Rendering Natal Chart...</p>
                        </div>
                    )}
                </div>

                {/* Chart Details */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl bg-white border border-primary/5 shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
                            <span className="w-2 h-2 bg-primary rounded-full"></span>
                            Planetary Positions
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {chartData.planets.map((planet) => (
                                <div key={planet.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/20 transition-colors">
                                    <span className="flex items-center gap-3">
                                        <span className={`text-xl ${getColor(planet.name)}`}>{getSymbol(planet.name)}</span>
                                        <span className="text-primary font-medium">{planet.name}</span>
                                    </span>
                                    <span className="text-secondary text-sm font-semibold">{planet.sign}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="glass-panel p-4 rounded-xl text-center bg-white border border-primary/5 shadow-sm">
                            <div className="text-xs text-secondary uppercase tracking-wider mb-1">Sun</div>
                            <div className="text-amber-600 font-bold">{chartData.sun_sign}</div>
                        </div>
                        <div className="glass-panel p-4 rounded-xl text-center bg-white border border-primary/5 shadow-sm">
                            <div className="text-xs text-secondary uppercase tracking-wider mb-1">Moon</div>
                            <div className="text-slate-600 font-bold">{chartData.moon_sign}</div>
                        </div>
                        <div className="glass-panel p-4 rounded-xl text-center bg-white border border-primary/5 shadow-sm">
                            <div className="text-xs text-secondary uppercase tracking-wider mb-1">Rising</div>
                            <div className="text-blue-600 font-bold">{chartData.ascendant}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BirthChart;
