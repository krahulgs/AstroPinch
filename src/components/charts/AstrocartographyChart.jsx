import worldMap from '../../assets/world-map.svg';

const AstrocartographyChart = ({ locations }) => {
    if (!locations || locations.length === 0) return null;

    return (
        <div className="glass-panel p-4 rounded-3xl relative overflow-hidden bg-white shadow-xl">
            <div className="aspect-[2/1] bg-slate-900 rounded-2xl relative border border-gray-200 shadow-inner overflow-hidden">
                {/* World Map Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <img
                        src={worldMap}
                        alt="World Map"
                        className="w-full h-full object-cover opacity-80 invert mix-blend-screen"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>

                {/* Plot Points */}
                {locations.map((loc, idx) => {
                    // Convert Lat/Lng to % (Rough Equirectangular Projection)
                    // Lng: -180 to 180 -> 0 to 100%
                    // Lat: 90 to -90 -> 0 to 100%
                    const x = ((loc.lng + 180) / 360) * 100;
                    const y = ((90 - loc.lat) / 180) * 100;

                    return (
                        <div
                            key={idx}
                            className="absolute group transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                            style={{ left: `${x}%`, top: `${y}%` }}
                        >
                            <div className="relative">
                                <div className="w-4 h-4 rounded-full bg-emerald-500 blur-sm animate-pulse absolute"></div>
                                <div className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-white relative z-10"></div>

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-white/95 border border-gray-200 p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl backdrop-blur-md z-20 transform scale-95 group-hover:scale-100 duration-200">
                                    <div className="text-xs font-bold text-slate-800 text-center mb-1">{loc.city}</div>
                                    <div className="text-[10px] text-emerald-600 text-center uppercase font-black tracking-wider">{loc.line_title || "Power Line"}</div>
                                    <div className="text-[10px] text-slate-500 text-center leading-tight mt-1 line-clamp-2">{loc.effect_title || loc.desc}</div>
                                    {/* Arrow */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-gray-200 transform rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Legend/Info integrated */}
            <div className="mt-4 flex items-center justify-between text-xs text-secondary">
                <span className="font-medium">Global Power Lines</span>
                <span className="italic">Standard Equirectangular Projection</span>
            </div>
        </div>
    );
};

export default AstrocartographyChart;
