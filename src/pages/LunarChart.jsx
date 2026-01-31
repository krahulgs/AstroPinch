import React from 'react';
import { useChart } from '../context/ChartContext';
import { Navigate } from 'react-router-dom';
import { Moon } from 'lucide-react';

const LunarChart = () => {
    const { userData, chartData, lunarSvg } = useChart();

    if (!userData || !chartData) {
        return <Navigate to="/chart" replace />;
    }

    return (
        <div className="space-y-8 pb-20 px-4">
            <div className="text-center space-y-2 pt-10">
                <span className="text-primary font-medium tracking-widest uppercase text-sm">Chandra Kundli</span>
                <h2 className="text-3xl font-bold text-primary">
                    {userData.name}'s Lunar Chart
                </h2>
                <p className="text-secondary max-w-2xl mx-auto">
                    A planetary view centered on your Moon sign ({chartData.moon_sign}).
                    This chart represents your emotional landscape and subconscious drivers.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="glass-panel p-8 rounded-3xl flex flex-col items-center justify-center relative bg-white border border-primary/10 shadow-2xl overflow-hidden aspect-square">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -ml-20 -mt-20"></div>

                    {lunarSvg ? (
                        <div
                            className="w-full h-full flex items-center justify-center chart-svg-container [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg_text]:fill-primary [&>svg_path]:stroke-gray-900 [&>svg_circle]:stroke-gray-900"
                            dangerouslySetInnerHTML={{ __html: lunarSvg }}
                        />
                    ) : (
                        <div className="text-center space-y-6">
                            <Moon className="w-16 h-16 text-primary animate-pulse mx-auto" />
                            <p className="text-secondary">Aligning with the Moons energy...</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl bg-white border-l-4 border-l-primary border border-t-gray-100 border-r-gray-100 border-b-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-primary mb-2">Lunar Perspective</h3>
                        <p className="text-sm text-secondary">
                            In Vedic astrology, the Moon centered chart (Chandra Kundli) is often considered
                            as important as the Lagna (Ascendant) chart for understanding one's internal state.
                        </p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl bg-white border-l-4 border-l-purple-500 border border-t-gray-100 border-r-gray-100 border-b-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-primary mb-2">Current Phase</h3>
                        <p className="text-sm text-secondary">
                            The Moon reflects your adaptability. With your Moon in {chartData.moon_sign},
                            you find security through {chartData.moon_sign} related themes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LunarChart;
