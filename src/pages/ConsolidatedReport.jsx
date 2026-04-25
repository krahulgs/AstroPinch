import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { API_BASE_URL } from '../api/config';
import { useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AstrocartographyChart from '../components/charts/AstrocartographyChart';
import ChatWidget from '../components/ChatWidget';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Sparkles, Star, Scroll, Brain, Globe, Activity, Download, MapPin, Gem, CircleDot, Mic2, BookOpen, Info, Layers, Map, Share2, AlertTriangle, Briefcase, Moon, Heart, ShieldAlert, Leaf, Zap, Home, Clock, Shield, TrendingUp, User, Calendar, Eye, Target, Lightbulb, GraduationCap, Car } from 'lucide-react';
import SEO from '../components/SEO';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ConsolidatedReport Crash:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center p-4 bg-red-50">
                    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Something went wrong</h2>
                        <p className="text-secondary mb-6 text-sm">We encountered an error while generating your report.</p>

                        <div className="bg-gray-50 p-4 rounded-xl text-left mb-6 overflow-hidden">
                            <p className="text-sm text-red-600 font-mono break-all">
                                {this.state.error?.toString()}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                localStorage.removeItem('lastReportData');
                                window.location.reload();
                            }}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-red-500/30"
                        >
                            Reset & Reload
                        </button>
                        <p className="mt-4 text-sm text-slate-400">
                            If this persists, try clearing your browser cache.
                        </p>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// Loshu Grid Component (AstroArunPandit Style)
const LoshuGridDisplay = ({ loshuData, showAnalysis = false }) => {
    if (!loshuData) return null;

    const gridLayout = [
        [4, 9, 2],
        [3, 5, 7],
        [8, 1, 6]
    ];

    const gridMap = loshuData.grid || {};

    return (
        <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-primary uppercase tracking-widest">{t('report.loshu.title')}</h4>
                <div className="flex gap-2 text-xs font-bold">
                    <span className="bg-amber-100/50 text-amber-800 px-2 py-1 rounded">{t('report.loshu.mulank')}: {loshuData.mulank}</span>
                    <span className="bg-purple-100/50 text-purple-800 px-2 py-1 rounded">{t('report.loshu.bhagyank')}: {loshuData.bhagyank}</span>
                </div>
            </div>

            {/* Grid Visualization */}
            <div className="grid grid-cols-3 gap-2 aspect-square max-w-[200px] mx-auto bg-amber-50/50 p-2 rounded-xl border border-amber-100 shadow-inner">
                {gridLayout.flat().map((num) => {
                    const count = (gridMap[num] || gridMap[num.toString()]) || 0;
                    return (
                        <div key={num} className={`aspect-square rounded-lg flex flex-col items-center justify-center border transition-all duration-500 ${count > 0
                            ? 'bg-white border-amber-200 shadow-sm scale-105'
                            : 'bg-slate-50/50 border-slate-100 opacity-30'
                            }`}>
                            <span className={`text-sm font-black ${count > 0 ? 'text-primary' : 'text-slate-300'}`}>
                                {num}
                            </span>
                            {count > 1 && (
                                <span className="text-xs text-amber-600 font-bold leading-none mt-0.5">
                                    x{count}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {!showAnalysis && (
                <div className="mt-4 flex flex-col items-center">
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest">{t('report.loshu.kua')} {loshuData.kua}</span>
                </div>
            )}

            {showAnalysis && (
                <>
                    {/* Planes Analysis */}
                    {loshuData.completed_planes?.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs text-secondary font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity className="w-3 h-3 text-emerald-500" /> {t('report.loshu.success_planes')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {loshuData.completed_planes.map(plane => (
                                    <span key={plane} className="px-3 py-1.5 text-[10px] md:text-xs bg-emerald-50 text-emerald-700 rounded-full font-black border border-emerald-100 shadow-sm">
                                        {plane}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Remedies (Dynamic based on Missing Numbers) */}
                    {loshuData.remedies && Object.keys(loshuData.remedies).length > 0 && (
                        <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 p-4 rounded-2xl border border-amber-100/50">
                            <p className="text-xs text-amber-800 font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                <Leaf className="w-3 h-3 text-amber-600" /> {t('report.loshu.key_remedies')}
                            </p>
                            <div className="space-y-3">
                                {Object.entries(loshuData.remedies).map(([num, remedy]) => (
                                    <div key={num} className="flex gap-3 items-start group">
                                        <div className="w-6 h-6 rounded-lg bg-white border border-amber-200 flex items-center justify-center text-xs font-black text-amber-700 shadow-sm group-hover:scale-110 transition-transform">
                                            {num}
                                        </div>
                                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                            {remedy}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// Vedic Charts Display Component
const VedicChartsDisplay = ({ userData }) => {
    const [chartStyle, setChartStyle] = useState('north'); // 'north' or 'south'
    const [lagnaChart, setLagnaChart] = useState(null);
    const [navamsaChart, setNavamsaChart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCharts = async () => {
            if (!userData) return;

            setLoading(true);
            try {
                let payload = { ...userData };

                if (typeof userData.date === 'string' && userData.date.includes('-')) {
                    const [y, m, d] = userData.date.split('-').map(Number);
                    payload.year = y;
                    payload.month = m;
                    payload.day = d;
                }

                if (typeof userData.time === 'string' && userData.time.includes(':')) {
                    const [h, min] = userData.time.split(':').map(Number);
                    payload.hour = h;
                    payload.minute = min;
                }

                if (!payload.city && payload.place) {
                    payload.city = payload.place;
                }
                if (!payload.city && payload.location_name) {
                    payload.city = payload.location_name;
                }

                const style = chartStyle;

                // Fetch both charts in parallel
                const [lagnaRes, navamsaRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/chart/lagna/${style}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    }),
                    fetch(`${API_BASE_URL}/api/chart/navamsa/${style}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })
                ]);

                if (lagnaRes.ok) {
                    const data = await lagnaRes.json();
                    setLagnaChart(data.image);
                }

                if (navamsaRes.ok) {
                    const data = await navamsaRes.json();
                    setNavamsaChart(data.image);
                }
            } catch (err) {
                console.error('Chart fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCharts();
    }, [userData, chartStyle]);

    return (
        <div className="space-y-6">
            {/* Style Toggle */}
            <div className="flex justify-center gap-2 px-2 max-w-sm mx-auto">
                <button
                    onClick={() => setChartStyle('north')}
                    className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${chartStyle === 'north'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {t('report.charts.north_indian')}
                </button>
                <button
                    onClick={() => setChartStyle('south')}
                    className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${chartStyle === 'south'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {t('report.charts.south_indian')}
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Lagna Chart (D1) */}
                    <div className="glass-panel p-6 rounded-[2.5rem] bg-white border border-purple-100 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                <CircleDot className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-primary uppercase tracking-tight">{t('report.charts.lagna_chart')}</h3>
                                <p className="text-sm text-purple-600 font-bold uppercase tracking-widest">{t('report.charts.d1_birth')}</p>
                            </div>
                        </div>

                        {lagnaChart ? (
                            <div className="flex justify-center">
                                <img
                                    src={lagnaChart}
                                    alt="Lagna Chart"
                                    className="max-w-full h-auto rounded-xl"
                                />
                            </div>
                        ) : (
                            <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-xl text-gray-400">
                                Chart unavailable
                            </div>
                        )}

                        <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
                            <p className="text-sm text-purple-700 text-center italic">
                                {t('report.charts.lagna_desc')}
                            </p>
                        </div>
                    </div>

                    {/* Navamsa Chart (D9) */}
                    <div className="glass-panel p-6 rounded-[2.5rem] bg-white border border-amber-100 shadow-xl">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                <Star className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-primary uppercase tracking-tight">{t('report.charts.navamsa_chart')}</h3>
                                <p className="text-sm text-amber-600 font-bold uppercase tracking-widest">{t('report.charts.d9_dharma')}</p>
                            </div>
                        </div>

                        {navamsaChart ? (
                            <div className="flex justify-center">
                                <img
                                    src={navamsaChart}
                                    alt="Navamsa Chart"
                                    className="max-w-full h-auto rounded-xl"
                                />
                            </div>
                        ) : (
                            <div className="aspect-square flex items-center justify-center bg-gray-50 rounded-xl text-gray-400">
                                {t('report.charts.unavailable')}
                            </div>
                        )}

                        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-sm text-amber-700 text-center italic">
                                {t('report.charts.navamsa_desc')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const YearlyPredictionGraph = ({ data, userData }) => {
    // Generate synthetic heatmap data
    const tracks = [
        { id: 'summary', name: 'SUMMARY', height: 40 },
        { id: 'career', name: 'CAREER', height: 30 },
        { id: 'health', name: 'HEALTH', height: 30 },
        { id: 'family', name: 'FAMILY', height: 30 },
        { id: 'finance', name: 'FINANCE', height: 30 },
    ];

    // Determine Start Year from UserData (DOB)
    const getBirthYear = () => {
        if (!userData?.date) return new Date().getFullYear() - 30; // Default fallback
        const dateStr = String(userData.date);
        // Handle YYYY-MM-DD
        if (dateStr.includes('-')) {
            const parts = dateStr.split('-');
            if (parts[0].length === 4) return parseInt(parts[0]); // YYYY-MM-DD
            if (parts[2].length === 4) return parseInt(parts[2]); // DD-MM-YYYY
        }
        return new Date().getFullYear() - 30;
    };

    const birthYear = getBirthYear();
    const currentYearVal = new Date().getFullYear();
    const startYear = currentYearVal - 10;
    const endYear = currentYearVal + 50; // 60 Year Forecast Horizon (-10 to +50)
    const totalYears = endYear - startYear;
    const yearWidth = 80; // Increased width for better detail in 10-year view

    // Seeded Random for consistency across renders for the same profile
    const seed = useMemo(() => {
        if (!userData) return 123;
        const seedStr = `${userData.date}-${userData.time || ''}-${userData.name || ''}`;
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            const char = seedStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }, [userData]);

    const getSeededValue = (offset) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
    };

    // Calculate "NOW" position
    // We need to account for startYear when calculating prompt offset
    // currentDayOffsetYears = (CurrentTime - StartOfYear(currentYear))
    // BUT nowCursorLeft = ( (currentYear - startYear) + currentDayOffsetYears ) * yearWidth 

    // Fraction of current year passed
    const fractionPassed = (new Date().getTime() - new Date(currentYearVal, 0, 1).getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const nowOffsetYears = (currentYearVal - startYear) + fractionPassed;

    // Clamp cursor between 0 and total width if needed, or hide if out of range
    const showNowCursor = nowOffsetYears >= 0 && nowOffsetYears <= totalYears;
    const nowCursorLeft = showNowCursor ? nowOffsetYears * yearWidth : 0;

    // Current Year Data from API
    const currentYearData = Array.isArray(data) ? data.find(d => d.year === currentYearVal) : null;
    const liveScore = currentYearData ? currentYearData.score : 72;
    const liveStatus = currentYearData ? currentYearData.status : "Positive";


    // Helper to generate random heatmap strips
    // Helper to generate deterministic heatmap strips based on astrology/numerology seed
    const generateStrips = (trackId) => {
        const strips = [];
        let currentYear = startYear;

        // Create a unique numeric offset for this specific track
        let trackOffset = 0;
        for (let i = 0; i < trackId.length; i++) trackOffset += trackId.charCodeAt(i);

        while (currentYear < endYear) {
            // Use getSeededValue for deterministic "randomness"
            // We multiply currentYear by a factor to ensure distinct values
            const r1 = getSeededValue(currentYear * 10 + trackOffset);
            const r2 = getSeededValue(currentYear * 20 + trackOffset + 50);
            const r3 = getSeededValue(currentYear * 30 + trackOffset + 100);

            const duration = r1 * 0.5 + 0.2; // Granular strips (0.2 to 0.7 years)
            const intensity = r2;

            let color;
            // Logical assignments based on astrological "intensity"
            if (intensity < 0.35) {
                // Challenge Period (Red)
                // Variation in opacity based on r3
                color = `rgba(220, 38, 38, ${0.4 + r3 * 0.4})`;
            } else if (intensity > 0.65) {
                // Success Period (Green)
                color = `rgba(34, 197, 94, ${0.4 + r3 * 0.4})`;
            } else {
                // Neutral/Stability Period (White/Transparent)
                color = `rgba(255, 255, 255, ${0.1 + r3 * 0.15})`;
            }

            strips.push({
                start: currentYear,
                duration: duration,
                end: Math.min(currentYear + duration, endYear),
                color: color
            });
            currentYear += duration;
        }
        return strips;
    };

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (scrollContainerRef.current && showNowCursor) {
            const containerWidth = scrollContainerRef.current.clientWidth;
            const scrollPos = nowCursorLeft - (containerWidth / 2) + (yearWidth / 2);
            // Use setTimeout to ensure layout is settled
            setTimeout(() => {
                scrollContainerRef.current?.scrollTo({ left: scrollPos, behavior: 'smooth' });
            }, 100);
        }
    }, [nowCursorLeft, showNowCursor, yearWidth]);

    return (
        <div className="rounded-[1.5rem] bg-white border border-slate-200 shadow-xl overflow-hidden relative font-sans select-none flex flex-col">
            {/* Professional Light Header - Fixed at Top */}
            <div className="bg-slate-50 px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between z-10 relative shadow-sm gap-2">
                <div className="flex items-center gap-2 md:gap-3">
                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    <div>
                        <h3 className="text-sm md:text-lg font-bold text-slate-800 tracking-wide uppercase">Life Forecast</h3>
                        <p className="text-[10px] md:text-xs text-slate-500 font-mono tracking-wider uppercase">VedAstro V.4.2 // 60-Year Forecast (Born: {birthYear})</p>
                    </div>
                </div>
                {/* Legend */}
                <div className="flex items-center gap-2 text-xs uppercase font-bold tracking-wider bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm w-fit">
                    <span className="text-red-500">Challenge</span>
                    <div className="w-12 md:w-16 h-1.5 md:h-2 rounded-full bg-gradient-to-r from-red-500 via-white to-green-500 border border-slate-100"></div>
                    <span className="text-emerald-600">Success</span>
                </div>
            </div>

            {/* Live Status Bar (Current Projection) */}
            <div className="bg-white px-6 py-3 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-3 md:gap-6 z-10 relative">
                <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping absolute top-0 left-0 opacity-75"></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full relative z-10"></div>
                    </div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Live Status</span>
                    <span className="text-xs text-slate-400 font-mono border-l border-slate-200 pl-2">
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                </div>

                <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner relative group">
                        {/* Background segments */}
                        <div className="absolute inset-0 flex">
                            <div className="w-1/3 h-full border-r border-white/50"></div>
                            <div className="w-1/3 h-full border-r border-white/50"></div>
                        </div>
                        {/* Live Value Bar */}
                        <div className="h-full bg-gradient-to-r from-blue-500 via-emerald-400 to-green-400 w-[78%] relative">
                            <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-white/80 shadow-[0_0_10px_white]"></div>
                        </div>
                    </div>
                    <div className="text-right shrink-0 min-w-[100px]">
                        <div className="text-xs font-black text-emerald-600 leading-none">{liveScore}%</div>
                        <div className="text-xs font-bold text-emerald-600/60 uppercase tracking-widest">{liveStatus}</div>
                    </div>
                </div>
            </div>

            {/* Scrollable Container */}
            <div ref={scrollContainerRef} className="overflow-x-auto custom-scrollbar relative bg-slate-50/50">
                <div style={{ width: `${totalYears * yearWidth}px` }} className="min-w-full">

                    {/* Overall Vitality Trend Line Graph */}
                    {/* Overall Vitality Trend Line Graph */}
                    <div className="relative h-24 border-b border-slate-200">
                        <div className="sticky left-6 top-0 z-10 w-max mb-2 pt-2">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-white/80 px-2 py-0.5 rounded-full border border-blue-100 shadow-sm backdrop-blur-sm">
                                Overall Vitality Trend
                            </span>
                        </div>

                        {(() => {
                            // Dynamic Trend Generation inside the render
                            const trendHeight = 80;
                            const points = [];
                            for (let i = 0; i <= totalYears * 5; i++) {
                                const x = (i / 5) * yearWidth;
                                const currentYearIter = startYear + (i / 5);

                                // Try to find real data for this year
                                const realYearData = Array.isArray(data) ? data.find(d => Math.floor(d.year) === Math.floor(currentYearIter)) : null;

                                let yVal;
                                if (realYearData) {
                                    // Use API score (0-100) converted to 0.1-0.9 range
                                    yVal = (realYearData.score / 100) * 0.8 + 0.1;
                                } else {
                                    // Fallback to seeded pseudo-random trend
                                    const offset = i / 10;
                                    yVal = (getSeededValue(offset) * 0.3) + (Math.sin(offset / 3) * 0.2) + 0.4;
                                }

                                const y = trendHeight - (Math.max(0.05, Math.min(0.95, yVal)) * trendHeight);
                                points.push({ x, y });
                            }
                            const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');
                            const areaPath = `M0,${trendHeight} ${points.map(p => `L${p.x},${p.y}`).join(' ')} L${totalYears * yearWidth},${trendHeight} Z`;

                            return (
                                <svg width={totalYears * yearWidth} height={trendHeight} className="overflow-visible block mt-1 absolute bottom-0">
                                    <defs>
                                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    {/* Light Grid Lines */}
                                    <line x1="0" y1={trendHeight * 0.2} x2={totalYears * yearWidth} y2={trendHeight * 0.2} stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" opacity="0.6" />
                                    <line x1="0" y1={trendHeight * 0.5} x2={totalYears * yearWidth} y2={trendHeight * 0.5} stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" opacity="0.4" />
                                    <line x1="0" y1={trendHeight * 0.8} x2={totalYears * yearWidth} y2={trendHeight * 0.8} stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" opacity="0.6" />

                                    <path d={areaPath} fill="url(#trendGradient)" />
                                    <polyline points={polylinePoints} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            );
                        })()}
                    </div>

                    {/* Timeline Ruler with Dasha Hover */}
                    <div className="flex bg-slate-50 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                        {Array.from({ length: totalYears }).map((_, i) => {
                            const year = startYear + i;
                            const isCurrent = year === currentYearVal;

                            // Find API data for this year to show Dasha info
                            const yearInfo = Array.isArray(data) ? data.find(d => d.year === year) : null;
                            const dashaText = yearInfo ? `${yearInfo.planetary_influence} / ${yearInfo.sub_lord}` : null;

                            return (
                                <div
                                    key={year}
                                    className={`flex-shrink-0 border-l border-slate-200 text-xs font-mono font-bold flex items-center justify-center relative group transition-all duration-300 ${isCurrent ? 'bg-blue-600 text-white shadow-lg scale-110 z-20 rounded-md ring-2 ring-blue-200 transform -translate-y-1' : 'text-slate-400 hover:bg-white'}`}
                                    style={{ width: `${yearWidth}px`, height: '32px' }}
                                >
                                    {year}

                                    {/* Dasha Tooltip */}
                                    {dashaText && (
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow-xl z-50 whitespace-nowrap pointer-events-none">
                                            {dashaText}
                                        </div>
                                    )}

                                    {/* Small tick mark */}
                                    {!isCurrent && <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>}
                                </div>
                            );
                        })}
                    </div>

                    {/* Tracks Container */}
                    <div className="p-6 space-y-4">
                        {/* Current Year Cursor */}
                        {showNowCursor && (
                            <div
                                className="absolute top-0 bottom-0 w-[2px] bg-blue-500 z-20 pointer-events-none shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                style={{ left: `${nowCursorLeft}px` }}
                            >
                                <div className="sticky top-10 ml-1.5 bg-blue-600 text-xs text-white px-1.5 py-0.5 rounded font-bold shadow-lg w-max z-30">
                                    NOW
                                </div>
                            </div>
                        )}



                        {tracks.map((track) => (
                            <div key={track.id} className="relative">
                                <div className="sticky left-6 flex items-center gap-2 mb-1 z-10 w-max bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">
                                    {track.id === 'career' && <Briefcase className="w-3 h-3 text-slate-400" />}
                                    {track.id === 'health' && <Heart className="w-3 h-3 text-slate-400" />}
                                    {track.id === 'family' && <Home className="w-3 h-3 text-slate-400" />}
                                    {track.id === 'finance' && <Gem className="w-3 h-3 text-slate-400" />}
                                    {track.id === 'summary' && <Layers className="w-3 h-3 text-blue-500" />}
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                                        {track.name}
                                    </span>
                                </div>

                                <div className="w-full h-10 bg-slate-100 rounded-md overflow-hidden flex relative border border-slate-200 shadow-inner">
                                    {generateStrips(track.id).map((strip, i) => (
                                        <div
                                            key={i}
                                            className="h-full hover:brightness-110 transition-all"
                                            style={{
                                                width: `${(strip.duration / totalYears) * (totalYears * yearWidth)}px`,
                                                backgroundColor: strip.color,
                                            }}
                                            title={`${strip.start.toFixed(1)} - ${strip.end.toFixed(1)}`}
                                        ></div>
                                    ))}

                                    {Array.from({ length: totalYears }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute top-0 bottom-0 border-l border-slate-300/20 pointer-events-none"
                                            style={{ left: `${i * yearWidth}px` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-mono z-10">
                <div className="flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    <span>SCROLL TO VIEW FUTURE PREDICTIONS &rarr;</span>
                </div>
                <span>ID: {seed.toString(36).toUpperCase()}</span>
            </div>
        </div>
    );
};

const HealthAnalysisDisplay = ({ content }) => {
    if (!content) return null;

    // Simple parser for 10-point structure
    const sections = content.split(/\n(?=\d+[\.|️⃣])/).filter(s => s.trim());
    const header = sections[0]?.startsWith("Based on") ? sections.shift() : "";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-emerald-50 border border-emerald-100 p-6 md:p-8 rounded-[2rem] text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Activity className="w-48 h-48 text-emerald-600" />
                </div>
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Heart className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-emerald-900 uppercase tracking-tighter mb-2">{t('report.health.title')}</h2>
                    <p className="text-emerald-700 font-bold uppercase tracking-widest text-xs md:text-sm">{t('report.health.subtitle')}</p>
                    {header && <p className="mt-4 text-emerald-800 italic max-w-2xl mx-auto">{header}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map((section, idx) => {
                    const lines = section.trim().split('\n');
                    const title = lines[0];
                    const body = lines.slice(1).join('\n');

                    const isRisk = title.includes("Risk") || title.includes("Warning") || body.includes("🔴");
                    const isPositive = title.includes("Positive") || title.includes("Remedies") || title.includes("Advice");

                    // Special styling for the Status Indicator (Last point usually)
                    if (title.includes(t('report.health.risk_indicator')) || body.includes(t('report.health.status_level'))) {
                        return (
                            <div key={idx} className="col-span-1 md:col-span-2 p-8 rounded-[2rem] bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-xl text-center border border-slate-700 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black text-slate-200 uppercase tracking-widest mb-4 border-b border-slate-700 pb-2 inline-block">{title}</h3>
                                    <div className="text-lg md:text-2xl font-medium leading-relaxed whitespace-pre-wrap">
                                        {body}
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={idx} className={`glass-panel p-6 rounded-[1.5rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isRisk ? 'bg-red-50/50 border-red-100 hover:shadow-red-100' : isPositive ? 'bg-emerald-50/50 border-emerald-100 hover:shadow-emerald-100' : 'bg-white border-slate-100'}`}>
                            <h3 className={`text-base md:text-lg font-black uppercase tracking-tight mb-3 ${isRisk ? 'text-red-700' : isPositive ? 'text-emerald-700' : 'text-slate-800'}`}>
                                {/* eslint-disable-next-line no-control-regex */}
                                {title.replace(/^\d+[.|️⃣]\s*/, "")}
                            </h3>
                            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                                {body.replace(/^\*/gm, '•')}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ConsolidatedReport = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const [healthAnalysis, setHealthAnalysis] = useState(null);
    const [loadingHealth, setLoadingHealth] = useState(false);
    const [healthError, setHealthError] = useState(null);

    const fetchHealthAnalysis = async () => {
        if (healthAnalysis) return;
        setLoadingHealth(true);
        setHealthError(null);
        try {
            const payload = { ...userData };
            // Ensure payload is complete
            if (typeof userData.date === 'string' && userData.date.includes('-')) {
                const [y, m, d] = userData.date.split('-').map(Number);
                payload.year = y; payload.month = m; payload.day = d;
            }
            if (typeof userData.time === 'string' && userData.time.includes(':')) {
                const [h, min] = userData.time.split(':').map(Number);
                payload.hour = h; payload.minute = min;
            }

            // Normalize Location
            if (!payload.city && payload.place) payload.city = payload.place;
            if (!payload.city && payload.location_name) payload.city = payload.location_name;

            payload.lang = i18n.language;

            const res = await fetch(`${API_BASE_URL}/api/insights/health`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.detail || "Failed to generate health insights");
            }

            const data = await res.json();
            if (data.health_analysis) {
                setHealthAnalysis(data.health_analysis);
            } else {
                throw new Error("No analysis returned. Please check backend configuration.");
            }
        } catch (e) {
            console.error("Health Fetch Error", e);
            setHealthError(e.message);
        } finally {
            setLoadingHealth(false);
        }
    };

    // Robust UserData Retrieval: State -> LocalStorage
    const [userData] = useState(() => {
        try {
            if (location.state?.userData) {
                localStorage.setItem('lastReportData', JSON.stringify(location.state.userData));
                return location.state.userData;
            }
            const saved = localStorage.getItem('lastReportData');
            // Handle "undefined" string or invalid JSON
            if (!saved || saved === 'undefined') return null;
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse user data", e);
            return null;
        }
    });




    const handleDownloadPDF = async () => {
        setDownloading(true);
        try {
            // Prepare payload
            let payload = { ...userData };

            if (typeof userData.date === 'string' && userData.date.includes('-')) {
                const [y, m, d] = userData.date.split('-').map(Number);
                payload.year = y;
                payload.month = m;
                payload.day = d;
            }

            if (typeof userData.time === 'string' && userData.time.includes(':')) {
                const [h, min] = userData.time.split(':').map(Number);
                payload.hour = h;
                payload.minute = min;
            }

            if (!payload.city && payload.place) {
                payload.city = payload.place;
            }
            if (!payload.city && payload.location_name) {
                payload.city = payload.location_name;
            }

            payload.lang = i18n.language;

            const response = await fetch(`${API_BASE_URL}/api/report/pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const detailMsg = typeof errorData.detail === 'object' ? errorData.detail.message : errorData.detail;
                throw new Error(detailMsg || 'Failed to generate PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `AstroPinch_Report_${userData.name.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err) {
            console.error("PDF generation failed", err);
            let msg = err.message;
            if (err.detail) msg += `: ${JSON.stringify(err.detail)}`;
            alert(`Failed to download PDF: ${msg}`);
        } finally {
            setDownloading(false);
        }
    };

    const [activeTab, setActiveTab] = useState('vedic');


    const generateReport = useCallback(async () => {
        if (!userData) return;

        try {
            setLoading(true);
            setError(null);

            // Optimization: If report was already fetched during navigation, use it!
            // FORCE REFRESH: Commenting out pre-fetched data usage to ensure latest backend logic is always applied
            /* 
            if (location.state?.preFetchedReport) {
                const preData = location.state.preFetchedReport;
                setReport(preData);
                if (preData.vedic_astrology?.chart_svg) {
                    setVedicSvg(preData.vedic_astrology.chart_svg);
                }
                setLoading(false);
                return;
            }
            */

            // Decompose date/time if strict strings are passed
            let payload = { ...userData };

            if (typeof userData.date === 'string' && userData.date.includes('-')) {
                const [y, m, d] = userData.date.split('-').map(Number);
                payload.year = y;
                payload.month = m;
                payload.day = d;
            }

            if (typeof userData.time === 'string' && userData.time.includes(':')) {
                const [h, min] = userData.time.split(':').map(Number);
                payload.hour = h;
                payload.minute = min;
            }

            // Ensure city property exists (Profile sends location_name, backend expects city)
            if (!payload.city && payload.place) {
                payload.city = payload.place;
            }
            if (!payload.city && payload.location_name) {
                payload.city = payload.location_name;
            }

            // Add Language from i18n
            payload.lang = i18n.language;

            // Fetch Report and Charts in Parallel
            // Fetch Report and Charts in Parallel with Cache Busting
            const timestamp = new Date().getTime();
            const headers = {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            };

            const [reportRes] = await Promise.all([
                fetch(`${API_BASE_URL}/api/report/consolidated?t=${timestamp}`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    cache: 'no-store'
                })
            ]);

            if (!reportRes.ok) throw new Error('Failed to generate report');

            const data = await reportRes.json();
            setReport(data);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userData, i18n.language]);

    useEffect(() => {
        generateReport();
    }, [generateReport]);

    if (!userData) return <Navigate to="/chart" replace />;

    if (loading) {
        return (
            <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white overflow-hidden font-sans">
                {/* Clean Geometric Background */}
                <div className="absolute inset-0 pointer-events-none opacity-30">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-[60px] opacity-50"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-6 md:space-y-8 max-w-lg px-6 text-center">
                    {/* Compact Minimalist Spinner */}
                    <div className="relative w-12 h-12 md:w-16 md:h-16">
                        <div className="absolute inset-0 border-2 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-t-2 border-purple-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-purple-600/40 animate-pulse" />
                        </div>
                    </div>

                    {/* Editorial Style Text Content */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="space-y-1.5 md:space-y-2">
                            <p className="text-[9px] md:text-xs font-black text-purple-600 uppercase tracking-[0.3em] mb-1">Cosmic Analysis</p>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                {userData?.name ? (
                                    <>
                                        Curating <span className="text-purple-600">{userData.name}&apos;s</span>
                                        <br />
                                        <span className="block mt-0.5">Personal Revelation</span>
                                    </>
                                ) : (
                                    "Your Cosmic Revelation"
                                )}
                            </h1>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <p className="text-[10px] md:text-sm text-slate-500 font-medium max-w-[240px] md:max-w-xs mx-auto leading-relaxed">
                                {t('report.status.synthesizing', 'Analyzing planetary harmonics and temporal cycles...')}
                            </p>

                            <div className="flex items-center gap-1.5">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="w-1 h-1 bg-purple-200 rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Compact Data Origins */}
                    <div className="pt-4 md:pt-6 w-full max-w-[280px] md:max-w-xs">
                        <div className="flex flex-col items-center gap-4 py-4 md:py-6 px-6 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="flex items-center gap-2">
                                <div className="h-[1px] w-3 bg-slate-200"></div>
                                <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Origins</span>
                                <div className="h-[1px] w-3 bg-slate-200"></div>
                            </div>

                            <div className="flex items-center justify-center gap-6 md:gap-8">
                                {['NASA JPL', 'VEDIC', 'ASTRA'].map((source, i) => (
                                    <div key={source} className="flex flex-col items-center gap-1">
                                        <span className={`text-[8px] md:text-[9px] font-black ${i === 2 ? 'text-rose-500' : i === 1 ? 'text-purple-600' : 'text-blue-600'} uppercase tracking-widest`}>
                                            {source}
                                        </span>
                                        <div className={`h-0.5 w-full rounded-full ${i === 2 ? 'bg-rose-500' : i === 1 ? 'bg-purple-600' : 'bg-blue-600'} opacity-20`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Minimal Footer */}
                <div className="absolute bottom-6 left-0 w-full text-center">
                    <p className="text-[7px] font-bold text-slate-300 uppercase tracking-[0.2em] px-4">
                        AstroPinch &mdash; Precision Astral Analytics
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div className="space-y-4">
                    <div className="text-red-500 font-bold text-xl">{t('report.status.failed')}</div>
                    <p className="text-secondary">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-2 bg-gray-100 rounded-full hover:bg-gray-200 text-primary transition-colors">{t('report.status.try_again')}</button>
                    <div className="text-xs text-slate-500 mt-4">Debug: Backend at {API_BASE_URL}</div>
                </div>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div className="text-secondary text-xl">{t('report.status.no_data')}</div>
                <div className="text-slate-500 text-sm mt-2">{t('report.status.go_back')}</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            <SEO
                title={`Consolidated Report - ${userData?.name}`}
                description={`Comprehensive Vedic astrology report for ${userData?.name}. Personal insights, predictions, and remedies.`}
            />
            <ChatWidget reportData={report} />

            <div className="w-full mx-auto px-4 lg:px-12 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* LEFT SIDEBAR NAVIGATION */}
                    <aside className="lg:w-80 lg:max-h-[calc(100vh-100px)] lg:sticky lg:top-24 lg:self-start flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-700 z-30">
                        <div className="h-full space-y-6 overflow-y-auto no-scrollbar pr-2 pb-12">

                            {/* Profile Card in Sidebar */}
                            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                                    <Sparkles className="w-24 h-24 text-purple-600" />
                                </div>
                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-[1.5rem] flex items-center justify-center text-3xl font-black text-purple-600 shadow-inner mb-4 transition-transform group-hover:scale-105">
                                        {report.profile?.name?.[0] || 'A'}
                                    </div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-2">
                                        {report.profile?.name}
                                    </h1>
                                    <div className="space-y-1 mb-6">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{report.profile?.dob}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                            {(() => {
                                                if (!report.profile?.tob) return '';
                                                const [h, m] = report.profile.tob.split(':').map(Number);
                                                const h12 = h % 12 || 12;
                                                const ampm = h >= 12 ? 'PM' : 'AM';
                                                return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
                                            })()} • {report.profile?.place}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleDownloadPDF}
                                        disabled={downloading}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-slate-500/30 disabled:opacity-50"
                                    >
                                        <Download className="w-4 h-4" />
                                        {downloading ? t('report.status.downloading') : t('report.status.download_pdf')}
                                    </button>
                                </div>
                            </div>

                            {/* Main Navigation Menu */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-6 mb-4">Report Navigation</p>

                                <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible no-scrollbar p-1 gap-2 lg:gap-3 bg-slate-100/50 rounded-[2rem] lg:bg-transparent">
                                    <button
                                        onClick={() => setActiveTab('vedic')}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group whitespace-nowrap min-w-fit flex-1 lg:flex-none ${activeTab === 'vedic' ? 'bg-white shadow-xl text-purple-600 border border-slate-100 lg:scale-[1.02]' : 'text-slate-500 hover:text-slate-950 hover:bg-white/50'}`}
                                    >
                                        <Scroll className={`w-5 h-5 ${activeTab === 'vedic' ? 'text-purple-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        <span className="text-sm font-black uppercase tracking-wider">{t('report.tabs.vedic', 'Vedic Astrology')}</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('numerology')}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group whitespace-nowrap min-w-fit flex-1 lg:flex-none ${activeTab === 'numerology' ? 'bg-white shadow-xl text-pink-600 border border-slate-100 lg:scale-[1.02]' : 'text-slate-500 hover:text-slate-950 hover:bg-white/50'}`}
                                    >
                                        <Activity className={`w-5 h-5 ${activeTab === 'numerology' ? 'text-pink-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        <span className="text-sm font-black uppercase tracking-wider">{t('report.tabs.numerology', 'Numerology')}</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('locational')}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group whitespace-nowrap min-w-fit flex-1 lg:flex-none ${activeTab === 'locational' ? 'bg-white shadow-xl text-emerald-600 border border-slate-100 lg:scale-[1.02]' : 'text-slate-500 hover:text-slate-950 hover:bg-white/50'}`}
                                    >
                                        <MapPin className={`w-5 h-5 ${activeTab === 'locational' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        <span className="text-sm font-black uppercase tracking-wider">{t('report.tabs.locational')}</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('kp')}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group whitespace-nowrap min-w-fit flex-1 lg:flex-none ${activeTab === 'kp' ? 'bg-white shadow-xl text-blue-600 border border-slate-100 lg:scale-[1.02]' : 'text-slate-500 hover:text-slate-950 hover:bg-white/50'}`}
                                    >
                                        <Target className={`w-5 h-5 ${activeTab === 'kp' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        <span className="text-sm font-black uppercase tracking-wider">KP Astrology</span>
                                    </button>

                                    <button
                                        onClick={() => { setActiveTab('health'); fetchHealthAnalysis(); }}
                                        className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 group whitespace-nowrap min-w-fit flex-1 lg:flex-none ${activeTab === 'health' ? 'bg-white shadow-xl text-emerald-700 border border-slate-100 lg:scale-[1.02]' : 'text-slate-500 hover:text-slate-950 hover:bg-white/50'}`}
                                    >
                                        <Heart className={`w-5 h-5 ${activeTab === 'health' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                        <span className="text-sm font-black uppercase tracking-wider">Health & Wellness</span>
                                    </button>
                                </nav>
                            </div>

                            {/* Pro Tip/Status in Sidebar */}
                            <div className="hidden lg:block p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <Info className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Astro Tip</span>
                                </div>
                                <p className="text-xs text-indigo-700/80 leading-relaxed font-bold italic">
                                    "Planetary alignments change with time. Check your transit analysis regularly for precision."
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* MAIN CONTENT AREA */}
                    <main className="flex-grow min-w-0 pb-24" id="report-content">

                        {/* HEALTH TAB */}
                        {activeTab === 'health' && (
                            <div className="min-h-[50vh]">
                                {loadingHealth ? (
                                    <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-4">
                                        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                                        <div className="text-center">
                                            <p className="text-emerald-800 font-bold text-lg">Analyzing Health Charts...</p>
                                            <p className="text-emerald-600/70 text-sm">Validating Dasha & Transits</p>
                                        </div>
                                    </div>
                                ) : healthError ? (
                                    <div className="flex flex-col items-center justify-center py-20 animate-fade-in space-y-4">
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                            <ShieldAlert className="w-8 h-8 text-red-600" />
                                        </div>
                                        <div className="text-center max-w-md">
                                            <p className="text-red-800 font-bold text-lg mb-2">Analysis Failed</p>
                                            <p className="text-red-600/90 text-sm bg-red-50 p-4 rounded-xl border border-red-100 font-mono">
                                                {healthError}
                                            </p>
                                            <button
                                                onClick={fetchHealthAnalysis}
                                                className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md transition-all text-sm"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </div>
                                ) : healthAnalysis ? (
                                    <HealthAnalysisDisplay content={healthAnalysis} />
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                                            <Activity className="w-10 h-10 text-emerald-500" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800">Generate Your Health Report</h3>
                                        <p className="text-slate-500 max-w-md mx-auto">
                                            Unlock a detailed 10-point health analysis combining Vedic Astrology and Numerology to reveal physical and mental wellness insights.
                                        </p>
                                        <button
                                            onClick={fetchHealthAnalysis}
                                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all hover:scale-105 flex items-center gap-2"
                                        >
                                            <Sparkles className="w-4 h-4" /> Generate Analysis
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* VEDIC TAB (Previously Overview) */}
                        {activeTab === 'vedic' && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                                {/* NEW SECTION: Basic Info & Charts Grid */}
                                {report.vedic_astrology && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 mb-2 px-2">
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                                                <Scroll className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl md:text-3xl font-black text-primary uppercase italic tracking-tighter">{t('report.sections.vedic_astrology')}</h2>
                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('report.vedic.lahiri_ayanamsa') || report.vedic_astrology.ayanamsa?.name}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            {/* Left Column: Panchang */}
                                            <div className="lg:col-span-1 glass-panel p-5 md:p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl flex flex-col">
                                                <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
                                                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                                        <Activity className="w-5 h-5 text-purple-600" />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-primary uppercase tracking-widest">Panchang Info</h3>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="flex flex-col p-3 bg-white border border-gray-100 rounded-xl">
                                                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{t('report.vedic.nakshatra')}</span>
                                                        <span className="text-sm font-bold text-primary">{report.vedic_astrology.panchang?.nakshatra?.name}</span>
                                                        <span className="text-[10px] text-purple-600 uppercase font-black">{report.vedic_astrology.panchang?.nakshatra?.lord}</span>
                                                    </div>
                                                    <div className="flex flex-col p-3 bg-white border border-gray-100 rounded-xl">
                                                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">{t('report.vedic.tithi')}</span>
                                                        <span className="text-sm font-bold text-primary">{report.vedic_astrology.panchang?.tithi?.name}</span>
                                                    </div>
                                                    <div className="flex flex-col p-3 bg-white border border-gray-100 rounded-xl">
                                                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Yoga</span>
                                                        <span className="text-sm font-bold text-primary">{report.vedic_astrology.panchang?.yoga?.name}</span>
                                                    </div>
                                                    <div className="flex flex-col p-3 bg-white border border-gray-100 rounded-xl">
                                                        <span className="text-[10px] font-black text-secondary uppercase tracking-widest mb-1">Karana</span>
                                                        <span className="text-sm font-bold text-primary">{report.vedic_astrology.panchang?.karana?.name}</span>
                                                    </div>
                                                    <div className="col-span-2 flex flex-col p-3 bg-purple-50 border border-purple-100 rounded-xl">
                                                        <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">{t('report.vedic.current_mahadasha')}</span>
                                                        <span className="text-base font-bold text-primary">{report.vedic_astrology.dasha?.[0]?.planet || report.vedic_astrology.dasha?.active_mahadasha}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Columns: Charts */}
                                            <div className="lg:col-span-2">
                                                <VedicChartsDisplay userData={userData} />
                                            </div>
                                        </div>
                                    </div>
                                )}



                                {/* NEW SECTION: Jyotish Deep Analysis & Personality */}
                                {report.vedic_astrology && (
                                    <div className="space-y-8 mt-12">
                                        <div className="flex items-start gap-4 mb-10 px-2">
                                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-[2rem] bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-lg transform -rotate-6">
                                                <Brain className="w-6 h-6 md:w-8 md:h-8 text-indigo-600 animate-pulse" />
                                            </div>
                                            <div className="flex flex-col">
                                                <h2 className="text-3xl md:text-5xl font-black text-primary uppercase italic tracking-tighter leading-none">Jyotish</h2>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="h-px w-8 bg-indigo-200"></div>
                                                    <h3 className="text-sm md:text-base font-black text-indigo-500 uppercase tracking-[0.4em]">Deep Analysis</h3>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            {/* Legacy Personality Column */}
                                            <div>
                                                <div className="bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/80 p-6 md:p-12 rounded-[3rem] border border-purple-100 shadow-2xl relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-200/30 transition-colors duration-700"></div>
{report.vedic_astrology.vedic_personality_analysis ? (
                                                        <div className="bg-purple-50/30 p-4 md:p-6 rounded-2xl border border-purple-100 h-full flex flex-col justify-between">
                                                            <div className="space-y-5">
                                                                {report.vedic_astrology.avakhada && (
                                                                    <div className="mb-4 p-4 bg-white/50 rounded-2xl border border-purple-100 shadow-sm">
                                                                        <div className="flex items-center gap-2 mb-4">
                                                                            <div className="p-1.5 bg-purple-100 rounded-lg">
                                                                                <Moon className="w-3.5 h-3.5 text-purple-600" />
                                                                            </div>
                                                                            <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-widest">Avakhada Chakra Details</span>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                                            {[
                                                                                { label: 'Varna', value: report.vedic_astrology.avakhada.varna, color: 'indigo', desc: "Soul's Nature" },
                                                                                { label: 'Vashya', value: report.vedic_astrology.avakhada.vashya, color: 'blue', desc: "Dominance" },
                                                                                { label: 'Gana', value: report.vedic_astrology.avakhada.gana, color: 'purple', desc: "Temperament" },
                                                                                { label: 'Yoni', value: report.vedic_astrology.avakhada.yoni, color: 'pink', desc: "Instinct" },
                                                                                { label: 'Nadi', value: report.vedic_astrology.avakhada.nadi, color: 'rose', desc: "Constitution" },
                                                                                { label: 'Paya (Charan)', value: report.vedic_astrology.avakhada.paya, color: 'amber', desc: "Foundation" },
                                                                                { label: 'Yunja', value: report.vedic_astrology.avakhada.yunja, color: 'emerald', desc: "Structure" },
                                                                                { label: 'Tatwa', value: report.vedic_astrology.avakhada.tatwa, color: 'orange', desc: "Element" }
                                                                            ].map((item, idx) => (
                                                                                <div key={idx} className="flex flex-col group/item relative">
                                                                                    <span className={`text-[9px] font-black uppercase text-slate-400 group-hover/item:text-primary transition-colors tracking-tight`}>{item.label}</span>
                                                                                    <span className="text-xs md:text-sm font-black text-primary border-b border-transparent group-hover/item:border-purple-200 transition-all">{item.value}</span>
                                                                                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover/item:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-xl z-20 whitespace-nowrap">
                                                                                        {item.desc}
                                                                                        <div className="absolute top-full left-2 border-x-[6px] border-x-transparent border-t-[6px] border-t-slate-900"></div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                <div>
                                                                    <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                        <Star className="w-4 h-4 text-purple-600" />
                                                                        Overall Personality
                                                                    </h4>
                                                                    <ul className="space-y-2">
                                                                        {report.vedic_astrology.vedic_personality_analysis.overall_personality?.map((point, i) => (
                                                                            <li key={i} className="flex gap-2 text-sm text-slate-600">
                                                                                <span className="text-purple-400">•</span>
                                                                                {point}
                                                                            </li>
                                                                        ))}
                                                                    </ul>

                                                                    {report.vedic_astrology.vedic_personality_analysis.manglik_status && (
                                                                        <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-100/50">
                                                                            <div className="text-xs font-black text-rose-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                                                                                Manglik Analysis
                                                                            </div>
                                                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                                                {report.vedic_astrology.vedic_personality_analysis.manglik_status}
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    {report.vedic_astrology.vedic_personality_analysis.pitru_dosha_status && (
                                                                        <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-100/50">
                                                                            <div className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                                                Pitru Dosha Analysis
                                                                            </div>
                                                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                                                {report.vedic_astrology.vedic_personality_analysis.pitru_dosha_status}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>


                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h5 className="text-xs font-black text-secondary uppercase tracking-widest mb-1">Emotional Nature</h5>
                                                                        <p className="text-sm text-slate-600 leading-relaxed italic">
                                                                            "{report.vedic_astrology.vedic_personality_analysis.emotional_nature}"
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <h5 className="text-xs font-black text-secondary uppercase tracking-widest mb-1">Life Theme</h5>
                                                                        <p className="text-sm text-purple-700 font-bold leading-relaxed">
                                                                            {report.vedic_astrology.vedic_personality_analysis.life_theme}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3 pt-2 border-t border-purple-100/50">
                                                                    <div>
                                                                        <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider mr-2">Strengths:</span>
                                                                        <span className="text-sm text-slate-600">
                                                                            {report.vedic_astrology.vedic_personality_analysis.strengths?.join(", ")}
                                                                        </span>
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-sm font-bold text-amber-600 uppercase tracking-wider mr-2">Challenges:</span>
                                                                        <span className="text-sm text-slate-600">
                                                                            {report.vedic_astrology.vedic_personality_analysis.challenges?.join(", ")}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="mt-6 text-center">
                                                                <p className="text-sm text-slate-400 italic">
                                                                    "This chart shows tendencies, not fixed destiny."
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                            <Brain className="w-8 h-8 mb-2 opacity-50" />
                                                            <p className="text-sm">Generating detailed personality analysis...</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* AI Summary Columns */}
                                            <div className="space-y-8">



                                    {/* Vedic AI Summary - Robust Rendering (Support Object and String) */}
                                    {report.vedic_astrology?.ai_summary ? (
                                        typeof report.vedic_astrology.ai_summary === 'object' ? (
                                            <>

                                                {/* 1. The Foundation: Birth Chart Analysis */}
                                                {report.vedic_astrology.ai_summary.personality_analysis && (
                                                    <div className="glass-panel p-5 md:p-12 rounded-3xl md:rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 shadow-xl relative overflow-hidden mb-8">
                                                        <div className="absolute top-0 right-0 p-6 opacity-10 hidden md:block">
                                                            <Scroll className="w-32 h-32 text-indigo-600" />
                                                        </div>
                                                        <div className="relative z-10 space-y-6">
                                                            <div className="flex items-center gap-4 mb-6">
                                                                <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-indigo-100 flex items-center justify-center shadow-lg">
                                                                    <Scroll className="w-5 h-5 md:w-8 md:h-8 text-indigo-600" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="text-lg md:text-2xl font-black text-primary uppercase italic tracking-tighter leading-tight">
                                                                        {report.vedic_astrology.ai_summary.personality_analysis.title || 'Birth Chart Analysis'}
                                                                    </h3>
                                                                    <p className="text-indigo-600 text-[10px] md:text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                                                        <Sparkles className="w-3 h-3" /> Personalized Life Insights
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="prose prose-indigo max-w-none">
                                                                {(() => {
                                                                    const content = report.vedic_astrology.ai_summary.personality_analysis.content;
                                                                    if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
                                                                        return (
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                                                {Object.entries(content).map(([label, text]) => (
                                                                                    <div key={label} className={`p-4 rounded-2xl bg-white/60 border border-indigo-100 shadow-sm ${label === 'Life Theme' ? 'md:col-span-2 bg-indigo-50/50 border-indigo-200' : ''}`}>
                                                                                        <span className="text-sm font-black uppercase tracking-widest text-indigo-600 block mb-1">
                                                                                            {label}
                                                                                        </span>
                                                                                        <p className={`text-slate-700 leading-relaxed ${label === 'Life Theme' ? 'text-lg font-bold italic text-indigo-800' : 'text-sm font-medium'}`}>
                                                                                            {text}
                                                                                        </p>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        );
                                                                    }
                                                                    return (
                                                                        <p className="text-lg leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                                                                            {content}
                                                                        </p>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 4. The Connection: Marriage & Relationships */}
                                                {report.vedic_astrology.ai_summary.relationships && (
                                                    <div className="mb-12">
                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                                                                <Heart className="w-6 h-6 text-pink-600" />
                                                            </div>
                                                            <h3 className="text-xl md:text-2xl font-black text-primary uppercase italic tracking-tighter">Marriage & Relationships</h3>
                                                        </div>

                                                        <div className="glass-panel p-6 md:p-12 rounded-[2.5rem] bg-pink-50/30 border border-pink-100 shadow-xl relative overflow-hidden group">
                                                            <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform duration-700 group-hover:scale-110">
                                                                <Heart className="w-40 h-40 text-pink-600" />
                                                            </div>
                                                            <div className="relative z-10">
                                                                <div className="prose prose-pink max-w-none">
                                                                    {(() => {
                                                                        const relContent = report.vedic_astrology.ai_summary.relationships.content;

                                                                        if (typeof relContent === 'object' && !Array.isArray(relContent) && relContent !== null) {
                                                                            return (
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                    {Object.entries(relContent).map(([label, text]) => (
                                                                                        <div key={label} className={`p-4 rounded-2xl bg-white/60 border border-pink-100 shadow-sm ${label === 'Tip' ? 'md:col-span-2 bg-pink-50/50' : ''}`}>
                                                                                            <span className="text-sm font-black uppercase tracking-widest text-pink-600 block mb-1">
                                                                                                {label}
                                                                                            </span>
                                                                                            <p className="text-slate-700 text-sm leading-relaxed">
                                                                                                {text}
                                                                                            </p>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            );
                                                                        }

                                                                        return (
                                                                            <p className="text-lg leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                                                                                {typeof relContent === 'object'
                                                                                    ? JSON.stringify(relContent, null, 2)
                                                                                    : relContent}
                                                                            </p>
                                                                        );
                                                                    })()}
                                                                </div>
                                                                <div className="mt-8 pt-6 border-t border-pink-100 flex items-center justify-between">
                                                                    <div className="flex items-center gap-2 text-xs text-pink-600/60 font-black uppercase tracking-[0.2em]">
                                                                        <Heart className="w-4 h-4" /> Union & Partnership Insights
                                                                    </div>
                                                                    <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest">
                                                                        <Sparkles className="w-3 h-3" /> Relationship Harmony
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}






                                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                                    {Object.entries(report.vedic_astrology.ai_summary)
                                                        .filter(([key]) => !['personality_analysis', 'relationships', 'dosha_check', 'remedies'].includes(key))
                                                        .map(([key, section]) => {
                                                            if (typeof section !== 'object' || !section) return null;
                                                            const isLarge = ['career_path', 'emotional_core', 'life_phase'].includes(key);
                                                            const iconMap = {
                                                                emotional_core: <Moon className="w-5 h-5 text-blue-600" />,
                                                                life_phase: <Activity className="w-5 h-5 text-purple-600" />,
                                                                career_path: <Briefcase className="w-5 h-5 text-emerald-600" />,
                                                                transit_analysis: <Map className="w-5 h-5 text-amber-600" />
                                                            };
                                                            return (
                                                                <div key={key} className={`glass-panel p-6 rounded-3xl border bg-white border-indigo-100 shadow-md hover:shadow-xl transition-all duration-300 ${isLarge ? 'col-span-1 sm:col-span-2' : ''}`}>
                                                                    <div className="flex items-center gap-3 mb-4">
                                                                        <div className="p-2 bg-indigo-50 rounded-xl shadow-sm border border-indigo-100">
                                                                            {iconMap[key] || <Brain className="w-5 h-5 text-indigo-600" />}
                                                                        </div>
                                                                        <h4 className="font-bold text-primary tracking-tight">{section.title || key}</h4>
                                                                    </div>
                                                                    <div className="text-sm text-slate-600 leading-relaxed font-medium">
                                                                        {typeof section.content === 'object'
                                                                            ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                                                                {Object.entries(section.content).map(([label, text]) => (
                                                                                    <div key={label} className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-50">
                                                                                         <span className="text-xs font-black uppercase tracking-widest text-indigo-600 block mb-1">{label}</span>
                                                                                         <p className="text-slate-700 text-sm leading-relaxed">{text}</p>
                                                                                    </div>
                                                                                ))}
                                                                              </div>
                                                                            : (section.content || '')}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                </div>
                                            </>
                                        ) : (
                                            /* Legacy String Fallback */
                                            <div className="glass-panel p-6 md:p-12 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 shadow-xl mb-12">
                                                <p className="text-lg leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                                                    {report.vedic_astrology.ai_summary}
                                                </p>
                                                <div className="mt-6 pt-6 border-t border-indigo-100/50 flex justify-center">
                                                    <p className="text-sm text-indigo-400 font-bold uppercase tracking-widest">
                                                        Note: Regenerate report to view enhanced card-based analysis.
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    ) : null}
                                            </div>
                                        </div>
                                    </div>
                                )}

{/* KP System Card */}
                                    {/* Dasha Timeline Section (Promoted) */}
                                    <div className="col-span-full glass-panel p-5 md:p-12 rounded-[2.5rem] bg-indigo-950/5 border border-indigo-100 shadow-inner relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shadow-lg">
                                                    <Activity className="w-7 h-7 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black text-primary uppercase italic tracking-tighter">Vimshottari Dasha</h3>
                                                    <p className="text-indigo-600/60 text-sm font-bold uppercase tracking-widest mt-1">Life Cycles & Timing</p>
                                                </div>
                                            </div>

                                            {/* Active Period Highlight Card */}
                                            {report.vedic_astrology?.dasha?.active_mahadasha && (
                                                <div className="mb-6 md:mb-8 p-5 md:p-8 rounded-3xl md:rounded-[2rem] bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950 text-white shadow-2xl relative overflow-hidden group">
                                                    {/* Cosmic Background Effect */}
                                                    <div className="absolute inset-0 opacity-20 hidden md:block">
                                                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-300 transition-colors duration-1000"></div>
                                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
                                                    </div>

                                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                                                        <div className="flex items-center gap-4 md:gap-6">
                                                            <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                                                                <span className="text-xl md:text-3xl font-black">{report.vedic_astrology.dasha.active_mahadasha[0]}</span>
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></div>
                                                                    <h3 className="text-xl md:text-2xl font-serif italic leading-tight">
                                                                        {report.vedic_astrology.dasha.active_mahadasha} <span className="text-indigo-300">Mahadasha</span>
                                                                    </h3>
                                                                    {report.vedic_astrology.dasha.active_antardasha && (
                                                                        <p className="text-indigo-200 mt-1 md:mt-2 text-[10px] md:text-sm font-medium flex items-center gap-2">
                                                                            <span className="w-1 h-1 rounded-full bg-white/50"></span>
                                                                            {report.vedic_astrology.dasha.active_antardasha} Bhukti
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="md:text-right">
                                                                <div className="inline-block px-3 py-1 md:px-5 md:py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm">
                                                                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-indigo-100">Influencing Now</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Mobile Card View */}
                                            <div className="md:hidden space-y-3">
                                                {report.vedic_astrology?.dasha?.timeline?.map((d, i) => (
                                                    <div key={i} className={`p-4 rounded-2xl border transition-all ${d.is_active ? 'bg-indigo-50 border-indigo-200 shadow-md ring-1 ring-indigo-200' : 'bg-white border-indigo-50 shadow-sm'}`}>
                                                        <div className="flex justify-between items-center mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${d.is_active ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                                                                    {d.planet.substring(0, 2)}
                                                                </div>
                                                                <span className="font-bold text-slate-900 text-sm">{d.planet}</span>
                                                            </div>
                                                            {d.is_active && (
                                                                <span className="px-2 py-0.5 rounded-full text-sm font-black bg-indigo-600 text-white uppercase tracking-widest animate-pulse">
                                                                    Active
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <div className="flex flex-col">
                                                                <span className="text-slate-400 uppercase font-black tracking-tight mb-0.5">Start</span>
                                                                <span className="text-slate-700 font-bold">{d.start}</span>
                                                            </div>
                                                            <div className="w-8 h-px bg-slate-100"></div>
                                                            <div className="flex flex-col text-right">
                                                                <span className="text-slate-400 uppercase font-black tracking-tight mb-0.5">End</span>
                                                                <span className="text-slate-700 font-bold">{d.end}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Desktop Table View */}
                                            <div className="hidden md:block overflow-x-auto rounded-3xl border border-indigo-100 bg-white/80 backdrop-blur-sm shadow-sm">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="bg-indigo-50/50">
                                                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-indigo-900">Planetary Period</th>
                                                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-indigo-900">Start Date</th>
                                                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-indigo-900">End Date</th>
                                                            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-indigo-900 text-right">Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-indigo-50">
                                                        {report.vedic_astrology?.dasha?.timeline?.map((d, i) => (
                                                            <tr key={i} className={`group transition-all ${d.is_active ? 'bg-indigo-100/30' : 'hover:bg-indigo-50/20'}`}>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${d.is_active ? 'bg-indigo-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-600'}`}>
                                                                            {d.planet.substring(0, 2)}
                                                                        </div>
                                                                        <span className="font-bold text-slate-900 tracking-tight">
                                                                            {d.planet} Mahadasha
                                                                            {d.is_active && report.vedic_astrology?.dasha?.active_antardasha && (
                                                                                <span className="text-indigo-600 ml-2">/ {report.vedic_astrology.dasha.active_antardasha} Bhukti</span>
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{d.start}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-500 font-medium">{d.end}</td>
                                                                <td className="px-6 py-4 text-right">
                                                                    {d.is_active ? (
                                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-black bg-indigo-600 text-white uppercase tracking-widest shadow-sm animate-pulse">
                                                                            Current Phase
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                                                                            {new Date(d.start) > new Date() ? 'Upcoming' : 'Past'}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <div className="mt-6 flex items-center gap-2 text-xs text-indigo-400 font-bold uppercase tracking-widest justify-center">
                                                <Info className="w-3 h-3" /> Based on {report.vedic_astrology?.panchang?.nakshatra?.name || 'Moon Nakshatra'} 120-year cosmic cycle
                                            </div>
                                        </div>
                                    </div>

                                    
{/* Dosha Awareness Section */}
                                    <div className="mt-12 glass-panel p-5 md:p-12 rounded-[2.5rem] border-gray-100 bg-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shadow-lg">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 w-7 h-7"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black text-primary uppercase italic tracking-tighter">Dosha Awareness</h3>
                                                    <p className="text-red-900/60 text-sm font-bold uppercase tracking-widest mt-1">Planetary Flaws & Remedies</p>
                                                </div>
                                            </div>

                                            <div className="md:hidden space-y-4">
                                                {report.vedic_astrology?.doshas && Object.entries(report.vedic_astrology.doshas).map(([key, data]) => {
                                                    const formatName = (k) => k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                                    const isPresent = data.present;
                                                    const isModerate = data.intensity?.includes('Moderate');

                                                    const bgClass = !isPresent ? 'bg-emerald-50 border-emerald-100 opacity-80' : (isModerate ? 'bg-orange-50 border-orange-100 shadow-md' : 'bg-rose-50 border-rose-100 shadow-md');
                                                    const iconBg = !isPresent ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : (isModerate ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-rose-100 border-rose-200 text-rose-600');
                                                    const badgeClass = !isPresent ? 'bg-emerald-600' : (isModerate ? 'bg-orange-600 shadow-orange-200' : 'bg-rose-600 shadow-rose-200');

                                                    return (
                                                        <div key={key} className={`p-5 rounded-3xl border transition-all ${bgClass}`}>
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconBg}`}>
                                                                    {isPresent ? (isModerate ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />) : <Zap className="w-5 h-5" />}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{formatName(key)}</div>
                                                                    <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-widest mt-1 text-white shadow-lg ${badgeClass}`}>
                                                                        {isPresent ? 'Present' : 'Absent'}
                                                                    </div>
                                                                </div>
                                                                {isPresent && (
                                                                    <div className="text-right">
                                                                        <div className={`text-xs uppercase font-black tracking-widest mb-1 ${isModerate ? 'text-orange-600' : 'text-rose-600'}`}>Intensity</div>
                                                                        <div className={`text-xs font-black ${isModerate ? 'text-orange-700' : 'text-rose-700'}`}>{data.intensity}</div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {isPresent && (
                                                                <div className={`bg-white/60 p-3 rounded-xl border ${isModerate ? 'border-orange-200/50' : 'border-rose-200/50'} mb-3`}>
                                                                    <p className={`text-sm font-bold leading-tight italic ${isModerate ? 'text-orange-800' : 'text-rose-800'}`}>
                                                                        {data.reason}
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div className="space-y-1">
                                                                <div className="text-xs text-slate-400 uppercase font-black tracking-widest">Remedy</div>
                                                                <p className={`text-xs leading-relaxed ${isPresent ? 'text-slate-700 font-medium' : 'text-slate-500 italic'}`}>
                                                                    {isPresent ? data.remedy : (data.remedy || 'No specific remedial actions required.')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
                                                <table className="w-full border-separate border-spacing-y-3">
                                                    <thead>
                                                        <tr className="text-xs text-slate-400 uppercase tracking-widest font-black">
                                                            <th className="px-6 py-2 text-left">Dosha Detail</th>
                                                            <th className="px-6 py-2 text-left">Status</th>
                                                            <th className="px-6 py-2 text-left">Intensity</th>
                                                            <th className="px-6 py-2 text-left">Remedial Measures</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {report.vedic_astrology?.doshas && Object.entries(report.vedic_astrology.doshas).map(([key, data]) => {
                                                            const formatName = (k) => k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                                                            const isPresent = data.present;
                                                            const isModerate = data.intensity?.includes('Moderate');

                                                            const rowBg = !isPresent ? 'bg-emerald-50/20' : (isModerate ? 'bg-orange-50/30' : 'bg-rose-50/30');
                                                            const iconBg = !isPresent ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : (isModerate ? 'bg-orange-100 border-orange-200 text-orange-600' : 'bg-rose-100 border-rose-200 text-rose-600');
                                                            const badgeBg = !isPresent ? 'bg-emerald-600 shadow-emerald-100' : (isModerate ? 'bg-orange-600 shadow-orange-200' : 'bg-rose-600 shadow-rose-200');

                                                            return (
                                                                <tr key={key} className={`group transition-all duration-300 ${rowBg} rounded-2xl`}>
                                                                    <td className="px-6 py-5 rounded-l-2xl border-l border-y border-transparent">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${iconBg}`}>
                                                                                {isPresent ? (
                                                                                    isModerate ? <AlertTriangle className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />
                                                                                ) : (
                                                                                    <Zap className="w-5 h-5" />
                                                                                )}
                                                                            </div>
                                                                            <div>
                                                                                <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{formatName(key)}</div>
                                                                                {isPresent && <div className={`text-xs font-bold leading-tight max-w-[200px] mt-1 italic ${isModerate ? 'text-orange-600/70' : 'text-rose-600/70'}`}>{data.reason}</div>}
                                                                                {!isPresent && <div className="text-xs text-emerald-600/70 font-bold mt-1">Favorable Alignment</div>}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-5 border-y border-transparent">
                                                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg ${badgeBg}`}>
                                                                            {isPresent ? (
                                                                                <>
                                                                                    <AlertTriangle className="w-3 h-3" />
                                                                                    Present
                                                                                </>
                                                                            ) : (
                                                                                'Absent'
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-5 border-y border-transparent">
                                                                        <div className="flex flex-col">
                                                                            <span className={`text-xs font-black ${isPresent ? (isModerate ? 'text-orange-700' : 'text-rose-700') : 'text-slate-400'}`}>
                                                                                {isPresent ? data.intensity : 'N/A'}
                                                                            </span>
                                                                            {isPresent && (
                                                                                <div className="w-16 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                                                                    <div
                                                                                        className={`h-full rounded-full ${data.intensity?.includes('High') ? 'bg-rose-600 w-full' :
                                                                                            data.intensity?.includes('Moderate') ? 'bg-orange-500 w-2/3' :
                                                                                                'bg-amber-400 w-1/3'
                                                                                            }`}
                                                                                    ></div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-5 rounded-r-2xl border-r border-y border-transparent">
                                                                        <div className="flex gap-3">
                                                                            <div className={`mt-1 flex-shrink-0 w-1 h-full rounded-full ${isPresent ? 'bg-rose-200' : 'bg-emerald-200'}`}></div>
                                                                            <p className={`text-xs leading-relaxed max-w-sm ${isPresent ? 'text-slate-700 font-medium' : 'text-slate-400 italic'}`}>
                                                                                {isPresent ? data.remedy : (data.remedy || 'No specific remedial actions required for this alignment.')}
                                                                            </p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>


                                
{/* Vedic Remedies Card (Enhanced) */}

                                    {report.vedic_astrology?.remedies && (
                                        <div className="col-span-full glass-panel p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden bg-gradient-to-br from-amber-50 via-purple-50 to-white border border-amber-100 shadow-xl">
                                            <div className="absolute top-0 right-0 p-10 opacity-5">
                                                <Sparkles className="w-48 h-48 text-amber-500" />
                                            </div>

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12 relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-amber-100 flex items-center justify-center shadow-lg shadow-amber-900/10">
                                                        <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl md:text-2xl font-black text-primary uppercase italic tracking-tighter leading-tight">{t('report.remedies.title')}</h3>
                                                        <p className="text-amber-700 text-xs font-black uppercase tracking-widest">{t('report.remedies.subtitle')}</p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-2 bg-white/60 border border-white/50 rounded-xl backdrop-blur-md shadow-sm w-fit">
                                                    <p className="text-xs text-secondary uppercase font-black tracking-widest mb-0.5">{t('report.remedies.dasha_influence')}</p>
                                                    <p className="text-primary font-bold text-xs md:text-sm">{report.vedic_astrology.dasha?.[0]?.planet} Mahadasha</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                                                {/* Gemstone */}
                                                <div className="glass-panel p-6 md:p-8 rounded-[2rem] border-purple-100 bg-white hover:shadow-lg transition-all duration-500 group">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                                                        <Gem className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                                                    </div>
                                                    <div className="text-xs text-purple-600 uppercase font-black tracking-widest mb-1.5">{t('report.remedies.gemstone')}</div>
                                                    <h4 className="text-lg md:text-xl font-black text-primary mb-4">{report.vedic_astrology.remedies?.gemstone?.stone}</h4>

                                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-secondary uppercase font-bold">{t('report.remedies.wear_on')}</span>
                                                            <span className="text-purple-700 font-bold">{report.vedic_astrology.remedies?.gemstone?.wear_finger}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-xs">
                                                            <span className="text-secondary uppercase font-bold">{t('report.remedies.metal')}</span>
                                                            <span className="text-purple-700 font-bold">{report.vedic_astrology.remedies?.gemstone?.metal}</span>
                                                        </div>
                                                        <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                                            <p className="text-xs md:text-sm text-purple-700 leading-relaxed italic text-center">
                                                                "Enhances {report.vedic_astrology.remedies?.gemstone?.life_area}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Rudraksha */}
                                                <div className="glass-panel p-6 md:p-8 rounded-[2rem] border-amber-100 bg-white hover:shadow-lg transition-all duration-500 group">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                                                        <CircleDot className="w-5 h-5 md:w-6 md:h-6 text-amber-600" />
                                                    </div>
                                                    <div className="text-xs text-amber-600 uppercase font-black tracking-widest mb-1.5">{t('report.remedies.rudraksha')}</div>
                                                    <h4 className="text-lg md:text-2xl font-black text-primary mb-4">{report.vedic_astrology.remedies?.rudraksha?.type}</h4>

                                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                                        <p className="text-xs md:text-sm text-secondary leading-relaxed italic">
                                                            "{report.vedic_astrology.remedies?.rudraksha?.benefits}"
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase bg-amber-50 w-fit px-3 py-1 rounded-full">
                                                            <Star className="w-3 h-3 fill-amber-700" />
                                                            {t('report.remedies.deity_focus')}: {report.vedic_astrology.remedies?.rudraksha?.deity}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mantra */}
                                                <div className="glass-panel p-6 md:p-8 rounded-[2rem] border-emerald-100 bg-white hover:shadow-lg transition-all duration-500 group">
                                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                                                        <Mic2 className="w-5 h-5 md:w-6 md:h-6 text-emerald-600" />
                                                    </div>
                                                    <div className="text-xs text-emerald-600 uppercase font-black tracking-widest mb-1.5">{t('report.remedies.sacred_mantra')}</div>
                                                    <h4 className="text-base md:text-2xl font-bold text-primary italic mb-4 leading-relaxed">
                                                        "{report.vedic_astrology.remedies?.mantra?.sanskrit}"
                                                    </h4>

                                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                                        <div className="flex flex-col gap-1">
                                                            <div className="text-xs text-secondary uppercase font-bold">{t('report.remedies.instructions')}</div>
                                                            <p className="text-xs md:text-sm text-emerald-700 leading-relaxed font-medium">
                                                                {report.vedic_astrology.remedies?.mantra?.instructions || "Chant 108 times daily."}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs font-bold text-secondary border-t border-gray-100 pt-3">
                                                            <span className="uppercase">{t('report.remedies.deity_focus')}</span>
                                                            <span className="text-emerald-700 uppercase">{report.vedic_astrology.remedies?.mantra?.deity}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                
{/* VedAstro Yearly Prediction Graph */}
                                    <YearlyPredictionGraph data={null} userData={userData} />

                                    {/* Graha Insights - Full Width & Non-Scrollable */}
                                    <div className="mt-12 glass-panel p-5 md:p-12 rounded-[2.5rem] border-gray-100 bg-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                                                    <Scroll className="w-7 h-7 text-amber-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black text-primary uppercase italic tracking-tighter">Graha Insights</h3>
                                                    <p className="text-amber-600/60 text-sm font-bold uppercase tracking-widest mt-1">Detailed Planetary Influence</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                {report.vedic_astrology?.graha_effects?.map((effect, idx) => (
                                                    <div key={idx} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 group hover:-translate-y-1">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-amber-50 group-hover:border-amber-100 transition-colors">
                                                                    <span className="text-sm font-black text-gray-900 group-hover:text-amber-700">{effect.house}</span>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-gray-900 capitalize">
                                                                        {effect.planet}
                                                                    </p>
                                                                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{effect.sanskrit}</p>
                                                                </div>
                                                            </div>
                                                            <span className="px-3 py-1 bg-amber-50 rounded-full text-sm font-black text-amber-700 uppercase tracking-widest border border-amber-100">
                                                                {effect.nature}
                                                            </span>
                                                        </div>

                                                        <div className="relative">
                                                            <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-amber-100 rounded-full group-hover:bg-amber-300 transition-colors"></div>
                                                            <p className="text-sm text-slate-700 leading-relaxed font-medium pl-3">
                                                                {effect.effect}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>


                                    
                            </div>
                        )}
{/* NUMEROLOGY TAB */}
                        {
                            activeTab === 'numerology' && (
                                <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="space-y-10">

                                        {/* Numerology Header — AI Executive Summary */}
                                        <div className="p-6 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-violet-50 via-white to-indigo-50 border border-violet-100 shadow-lg shadow-violet-100/50 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-violet-100/60 to-transparent rounded-full pointer-events-none"></div>
                                            <div className="relative z-10 space-y-8">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-violet-100 pb-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
                                                            <Brain className="w-7 h-7 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase italic leading-none">{t('report.sections.ai_executive_summary')}</h3>
                                                            <div className="flex items-center gap-1.5 mt-2">
                                                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                                <span className="text-xs font-black text-violet-500 uppercase tracking-widest">Neural Synthesis Active</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        {(() => {
                                                            const executiveSummary = report.executive_summary;
                                                            const aiInsights = report.numerology?.ai_insights;
                                                            const rawText = aiInsights || report.predictions_summary?.best_prediction || "";
                                                            
                                                            if (!executiveSummary && !rawText) return null;
                                                            
                                                            // Parse insights into sections if possible
                                                            const sections = rawText.split(/(?=\d\.\s)/).filter(s => s.trim());
                                                            
                                                            return (
                                                                <>
                                                                    {executiveSummary && (
                                                                        <div className="md:col-span-2 p-6 md:p-8 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 mb-2 relative group overflow-hidden">
                                                                            <div className="flex items-center gap-3 mb-3">
                                                                                 <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                                                                                 <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Global Synthesis</span>
                                                                            </div>
                                                                            <p className="text-base md:text-lg text-slate-700 font-medium italic opacity-95 leading-relaxed relative z-10">
                                                                                "{executiveSummary.replace(/\*\*/g, '')}"
                                                                            </p>
                                                                            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:rotate-12 transition-transform duration-500">
                                                                                <Brain className="w-16 h-16 text-indigo-600" />
                                                                            </div>
                                                                        </div>
                                                                    )}

                                                                    {sections.length > 0 ? (
                                                                        sections.map((section, idx) => {
                                                                            const cleaned = section.replace(/^\d+[.)]\s*/, "");
                                                                            const titleMatch = cleaned.match(/^(\*\*)?([^*:]+)(\*\*)?[:\s]*(.*)/s);
                                                                            const title = titleMatch ? titleMatch[2].trim() : "";
                                                                            const content = titleMatch ? titleMatch[4].trim() : cleaned;
                                                                            if (!content && !title) return null;
                                                                            
                                                                            return (
                                                                                <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-100 hover:border-violet-200 hover:shadow-md hover:shadow-violet-50 transition-all shadow-sm">
                                                                                    <div className="flex items-center gap-3 mb-3">
                                                                                        <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                                                                                        {title && (<h4 className="text-sm font-black uppercase tracking-wider text-violet-600">{title}</h4>)}
                                                                                    </div>
                                                                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{content.replace(/\*\*/g, '')}</p>
                                                                                </div>
                                                                            );
                                                                        })
                                                                    ) : rawText && (
                                                                        <div className="md:col-span-2 p-5 rounded-3xl bg-white border border-slate-100 shadow-sm">
                                                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">{rawText.replace(/\*\*/g, '')}</p>
                                                                        </div>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>

                                                {/* Section 1: Core Numeric Vibration Grid */}
                                                <section className="space-y-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center">
                                                            <Activity className="w-5 h-5 text-pink-500" />
                                                        </div>
                                                        <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase italic tracking-tighter">{t('numerology_page.core_numbers_title')}</h3>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        {[
                                                            { key: 'life_path', label: t('numerology_page.life_path_number'), subtitle: t('numerology_page.descriptions.life_path'), value: report.numerology?.life_path, numColor: 'text-pink-500', tag: 'bg-pink-50', border: 'border-pink-200 hover:border-pink-300 hover:shadow-pink-100' },
                                                            { key: 'expression', label: t('numerology_page.destiny_number'), subtitle: t('numerology_page.descriptions.expression'), value: report.numerology?.expression, numColor: 'text-violet-500', tag: 'bg-violet-50', border: 'border-violet-200 hover:border-violet-300 hover:shadow-violet-100' },
                                                            { key: 'soul_urge', label: t('numerology_page.soul_urge_number'), subtitle: t('numerology_page.descriptions.soul_urge'), value: report.numerology?.soul_urge, numColor: 'text-emerald-500', tag: 'bg-emerald-50', border: 'border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-100' },
                                                            { key: 'personality', label: t('numerology_page.personality_number'), subtitle: t('numerology_page.descriptions.personality'), value: report.numerology?.personality, numColor: 'text-blue-500', tag: 'bg-blue-50', border: 'border-blue-200 hover:border-blue-300 hover:shadow-blue-100' },
                                                        ].map((item, idx) => {
                                                            const analysis = report.numerology?.detailed_analysis?.[item.key] || {};
                                                            return (
                                                                <div key={idx} className={`relative p-7 rounded-[2rem] border-2 bg-white transition-all duration-300 group overflow-hidden hover:-translate-y-1 hover:shadow-xl shadow-sm ${item.border}`}>
                                                                    <div className="flex justify-between items-start mb-5">
                                                                        <div>
                                                                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-700 transition-colors">{item.label}</h4>
                                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.subtitle}</p>
                                                                        </div>
                                                                        <div className={`text-5xl md:text-6xl font-black ${item.numColor} leading-none group-hover:scale-110 transition-transform duration-300 origin-right`}>{item.value}</div>
                                                                    </div>
                                                                    <p className="text-sm text-slate-600 leading-relaxed mb-5">{analysis.text || `Your vibration ${item.value} influences your journey and unique approach to life's challenges.`}</p>
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <div className={`${item.tag} p-3 rounded-2xl`}>
                                                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">{t('numerology_page.strength')}</span>
                                                                            <p className="text-xs text-slate-700 font-semibold">{analysis.strength || "Inherent natural talent"}</p>
                                                                        </div>
                                                                        <div className="bg-amber-50 p-3 rounded-2xl">
                                                                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block mb-1">{t('numerology_page.caution')}</span>
                                                                            <p className="text-xs text-slate-700 font-semibold">{analysis.caution || "Potential area for growth"}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {[
                                                            { label: t('numerology_page.birthday_number'), value: report.numerology?.birthday, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
                                                            { label: t('numerology_page.maturity_number'), value: report.numerology?.maturity, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
                                                        ].map((item, idx) => (
                                                            <div key={idx} className={`${item.bg} border ${item.border} px-6 py-4 rounded-2xl flex items-center justify-between`}>
                                                                <span className="text-xs font-black uppercase tracking-wider text-slate-500">{item.label}</span>
                                                                <span className={`text-xl font-black ${item.color}`}>{item.value}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>
                                        </div>

                                        {/* Section 2: Personal Year & Month */}
                                        <section className="space-y-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-indigo-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase italic tracking-tighter">{t('numerology_page.personal_cycles.title')}</h3>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('numerology_page.personal_cycles.subtitle')}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {[
                                                    { key: 'personal_year', label: t('numerology_page.personal_cycles.current_year'), value: report.numerology?.personal_year, analysis: report.numerology?.detailed_analysis?.personal_year, gradient: 'from-indigo-500 to-blue-500', border: 'border-indigo-100' },
                                                    { key: 'personal_month', label: t('numerology_page.personal_cycles.current_month'), value: report.numerology?.personal_month, analysis: report.numerology?.detailed_analysis?.personal_month, gradient: 'from-pink-500 to-rose-500', border: 'border-pink-100' },
                                                ].map((cycle, idx) => (
                                                    <div key={idx} className={`rounded-[2.5rem] border-2 ${cycle.border} bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300`}>
                                                        <div className={`bg-gradient-to-r ${cycle.gradient} p-7 text-white relative overflow-hidden`}>
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-8 -mt-8 rounded-full"></div>
                                                            <div className="relative z-10 flex justify-between items-center">
                                                                <div>
                                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{cycle.label}</h4>
                                                                    <p className="text-2xl font-black tracking-tighter mt-1">{cycle.analysis?.title || 'Cycle Analysis'}</p>
                                                                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-xs font-black uppercase tracking-widest">{t('numerology_page.personal_cycles.theme')}</div>
                                                                    <p className="text-xs font-bold text-white/90 italic mt-2">{cycle.analysis?.theme || "A transformative period in your timeline."}</p>
                                                                </div>
                                                                <div className="text-7xl font-black text-white/20">{cycle.value}</div>
                                                            </div>
                                                        </div>
                                                        <div className="p-6 space-y-3">
                                                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                                                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-200"><Zap className="w-4 h-4 text-white" /></div>
                                                                <div>
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">{t('numerology_page.personal_cycles.what_to_start')}</span>
                                                                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">{cycle.analysis?.start || "Begin new ventures that align with your purpose."}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100">
                                                                <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center shrink-0 shadow-sm shadow-blue-200"><Sparkles className="w-4 h-4 text-white" /></div>
                                                                <div>
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">{t('numerology_page.personal_cycles.focus_on')}</span>
                                                                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">{cycle.analysis?.focus || "Maintain discipline and awareness in your daily tasks."}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                                                                <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center shrink-0 shadow-sm shadow-rose-200"><ShieldAlert className="w-4 h-4 text-white" /></div>
                                                                <div>
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 block mb-1">{t('numerology_page.personal_cycles.avoid')}</span>
                                                                    <p className="text-xs text-slate-600 font-semibold leading-relaxed">{cycle.analysis?.avoid || "Steer clear of impulsive decisions and unnecessary conflict."}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        {/* Section 3: Career & Money */}
                                        <section className="space-y-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                                    <Briefcase className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase italic tracking-tighter">{t('numerology_page.career_money.title')}</h3>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('numerology_page.career_money.subtitle')}</p>
                                                </div>
                                            </div>
                                            <div className="p-8 md:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-emerald-50 to-transparent rounded-full pointer-events-none"></div>
                                                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                                                    <div className="space-y-6">
                                                        <div className="space-y-3">
                                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200">
                                                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">{t('numerology_page.career_money.annual_strategy')}</span>
                                                            </div>
                                                            <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{t('numerology_page.career_money.best_activities')}</h4>
                                                            <p className="text-base text-slate-600 font-medium leading-relaxed italic">"{report.numerology?.detailed_analysis?.timing?.best_activities}"</p>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{t('numerology_page.career_money.prime_timing')}</h5>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                {[
                                                                    { label: t('numerology_page.career_money.job_change'), value: report.numerology?.detailed_analysis?.timing?.job_change, icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                                                    { label: t('numerology_page.career_money.business_start'), value: report.numerology?.detailed_analysis?.timing?.business, icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                                                                    { label: t('numerology_page.career_money.investment'), value: report.numerology?.detailed_analysis?.timing?.investment, icon: Gem, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                                                                ].map((item, idx) => (
                                                                    <div key={idx} className={`${item.bg} border ${item.border} p-4 rounded-2xl hover:shadow-sm transition-all`}>
                                                                        <div className="flex items-center gap-2 mb-2"><item.icon className={`w-4 h-4 ${item.color}`} /><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span></div>
                                                                        <p className="text-sm font-bold text-slate-700 leading-snug">{item.value || "Not ideal this cycle"}</p>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="lg:border-l lg:border-slate-100 lg:pl-10 flex flex-col justify-center gap-6">
                                                        <div className="bg-rose-50 border-2 border-rose-100 p-8 rounded-[2rem] space-y-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-rose-500" /></div>
                                                            <div>
                                                                <h4 className="text-lg font-black text-rose-700 uppercase tracking-tighter mb-2">{t('numerology_page.career_money.warning_periods')}</h4>
                                                                <p className="text-sm text-rose-700/80 font-medium leading-relaxed">{report.numerology?.detailed_analysis?.timing?.warning}</p>
                                                            </div>
                                                            <div className="pt-2 flex items-center gap-3">
                                                                <div className="h-px flex-1 bg-rose-200"></div>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 italic">{t('numerology_page.career_money.handle_care')}</span>
                                                                <div className="h-px flex-1 bg-rose-200"></div>
                                                            </div>
                                                        </div>
                                                        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">{t('numerology_page.career_money.timing_analysis')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Section 4: Name Insights */}
                                        <section className="space-y-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                                    <Mic2 className="w-5 h-5 text-violet-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase italic tracking-tighter">{t('numerology_page.name_insights.title')}</h3>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('numerology_page.name_insights.subtitle')}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                <div className="md:col-span-1 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-lg shadow-violet-200 relative overflow-hidden group">
                                                    <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none"></div>
                                                    <div className="relative z-10 flex flex-col justify-between h-full gap-8">
                                                        <div>
                                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-200 mb-4">{t('numerology_page.name_insights.name_vibration')}</h4>
                                                            <div className="text-8xl font-black tracking-tighter drop-shadow-2xl">{report.numerology?.expression}</div>
                                                        </div>
                                                        <p className="text-xs font-bold text-violet-100 uppercase tracking-wider leading-relaxed">{t('numerology_page.name_insights.vibration_desc')}</p>
                                                    </div>
                                                </div>
                                                <div className="md:col-span-2 bg-white border border-slate-100 p-7 rounded-[2.5rem] shadow-sm flex flex-col justify-between gap-5">
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                        {[
                                                            { label: t('numerology_page.name_insights.career'), value: report.numerology?.detailed_analysis?.name_insight?.career, icon: Briefcase, iconColor: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                                                            { label: t('numerology_page.name_insights.relationships'), value: report.numerology?.detailed_analysis?.name_insight?.relationship, icon: Heart, iconColor: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
                                                            { label: t('numerology_page.name_insights.stability'), value: report.numerology?.detailed_analysis?.name_insight?.stability, icon: Shield, iconColor: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
                                                        ].map((item, idx) => (
                                                            <div key={idx} className={`${item.bg} border ${item.border} p-5 rounded-2xl hover:-translate-y-1 hover:shadow-sm transition-all`}>
                                                                <div className="flex items-center gap-2 mb-3"><item.icon className={`w-4 h-4 ${item.iconColor}`} /><span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{item.label}</span></div>
                                                                <p className="text-sm font-bold text-slate-700 leading-snug">{item.value || "Calculating support energy..."}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="p-5 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-2xl border border-violet-100 relative overflow-hidden">
                                                        <div className="absolute right-0 -top-3 opacity-10 pointer-events-none"><Sparkles className="w-20 h-20 text-violet-400" /></div>
                                                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 mb-2">{t('numerology_page.name_insights.simple_suggestion')}</h5>
                                                        <p className="text-sm text-slate-700 font-medium italic relative z-10 leading-relaxed">"{report.numerology?.detailed_analysis?.name_insight?.suggestion || "Consistency in how you write and speak your name will stabilize your core vibration."}"</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Section 5: Lucky Elements */}
                                        <section className="space-y-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl md:text-2xl font-black text-slate-800 uppercase italic tracking-tighter">{t('numerology_page.lucky_elements.title')}</h3>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('numerology_page.lucky_elements.subtitle')}</p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { label: t('numerology_page.lucky_elements.lucky_numbers'), value: report.numerology?.lucky_elements?.numbers?.join(', '), icon: Gem, iconColor: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', numColor: 'text-amber-600' },
                                                    { label: t('numerology_page.lucky_elements.favorable_dates'), value: report.numerology?.lucky_elements?.dates, icon: Calendar, iconColor: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', numColor: 'text-rose-600' },
                                                    { label: t('numerology_page.lucky_elements.lucky_colors'), value: report.numerology?.lucky_elements?.colors, icon: Zap, iconColor: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', numColor: 'text-blue-600' },
                                                    { label: t('numerology_page.lucky_elements.power_days'), value: report.numerology?.lucky_elements?.days, icon: Moon, iconColor: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100', numColor: 'text-purple-600' },
                                                ].map((item, idx) => (
                                                    <div key={idx} className={`${item.bg} border-2 ${item.border} p-5 rounded-[2rem] flex flex-col items-center text-center group hover:-translate-y-1 hover:shadow-md transition-all duration-300`}>
                                                        <div className={`w-12 h-12 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                                                            <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{item.label}</span>
                                                        <p className={`text-base font-black ${item.numColor} leading-snug`}>{item.value || "—"}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-6 rounded-[2rem] bg-gradient-to-r from-amber-400 to-orange-500 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg shadow-amber-200 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-white/5 pointer-events-none"></div>
                                                <div className="flex items-center gap-5 relative z-10">
                                                    <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-lg">
                                                        <Star className="w-7 h-7 text-white animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-100 mb-1">{t('numerology_page.lucky_elements.recommended_gemstone')}</h4>
                                                        <p className="text-2xl md:text-3xl font-black tracking-tight">{report.numerology?.lucky_elements?.gemstone || "Loading..."}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right relative z-10 hidden md:block">
                                                    <p className="text-xs font-bold text-amber-100 italic uppercase tracking-widest">{t('numerology_page.lucky_elements.wear_this')}</p>
                                                    <p className="text-[10px] text-white/70 font-black mt-1">{t('numerology_page.lucky_elements.pro_tip')}</p>
                                                </div>
                                            </div>
                                        </section>

                                        {/* AI Deep Dive */}
                                        {report.numerology?.ai_insights && (
                                            <section className="bg-gradient-to-br from-slate-800 to-indigo-900 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden shadow-xl shadow-indigo-200/50">
                                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
                                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-600/10 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none"></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center">
                                                            <Scroll className="w-8 h-8 text-indigo-300" />
                                                        </div>
                                                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">{t('numerology_page.ai_deep_dive.title')}</h3>
                                                    </div>
                                                    <div className="prose prose-invert max-w-none">
                                                        {report.numerology.ai_insights.split('\n\n').map((para, idx) => (
                                                            <p key={idx} className="text-slate-300 text-[1.05rem] leading-loose mb-6 last:mb-0 font-medium">
                                                                {para.startsWith('**') ? (
                                                                    <strong className="text-indigo-300 block mb-2 text-lg font-black uppercase tracking-wide">{para.replace(/\*\*/g, '')}</strong>
                                                                ) : para}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                    </div>
                                </div>
                            )
                        }

{/* LOCATIONAL TAB */}
                        {
                            activeTab === 'locational' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {!report.astrocartography ? (
                                        <div className="glass-panel p-12 text-center rounded-3xl border border-dashed border-gray-200 bg-white">
                                            <Globe className="w-16 h-16 mx-auto mb-4 text-secondary" />
                                            <h3 className="text-xl font-bold text-primary mb-2">Astrocartography Data Missing</h3>
                                            <p className="text-secondary mb-6 max-w-md mx-auto">
                                                Your current report doesn't include Locational Astrology data. Please regenerate the report to calculate your Power Zones.
                                            </p>
                                            <button
                                                onClick={generateReport}
                                                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all"
                                            >
                                                Regenerate Report
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Intro Card */}
                                            <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-gray-100 text-center">
                                                <h2 className="text-2xl md:text-3xl font-black text-primary uppercase italic tracking-tighter">Astrocartography Power Zones</h2>
                                                <p className="text-secondary max-w-2xl mx-auto">
                                                    Discover where your planetary lines intersect with the world. These locations hold specific vibrational power for you based on your birth time.
                                                </p>
                                            </div>

                                            {/* Map View */}
                                            <AstrocartographyChart locations={report.astrocartography} />

                                            {/* Location Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {report.astrocartography.length > 0 ? (
                                                    report.astrocartography.map((loc, idx) => (
                                                        <div key={idx} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all bg-white border border-gray-100">
                                                            <div className="flex justify-between items-start mb-4">
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <MapPin className="w-4 h-4 text-emerald-600" />
                                                                        <h3 className="text-xl font-black text-primary italic tracking-tight">{loc.city}</h3>
                                                                    </div>
                                                                    <span className="text-sm bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-black uppercase tracking-widest">
                                                                        {loc.angle}
                                                                    </span>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-black text-primary">{loc.planet}</div>
                                                                    <span className="text-sm text-secondary uppercase tracking-widest font-black">
                                                                        {loc.angle} Line
                                                                    </span>
                                                                    <div className="text-xs text-slate-400 font-mono mt-1">
                                                                        {Number(loc.lat || 0).toFixed(2)}°, {Number(loc.lng || 0).toFixed(2)}°
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-3">
                                                                <div>
                                                                    <div className="text-xs text-secondary uppercase font-black tracking-widest mb-1">Potential Effect</div>
                                                                    <p className="text-sm text-emerald-700 font-bold">{loc.effect_title}</p>
                                                                </div>
                                                                <div className="pt-3 border-t border-gray-100">
                                                                    <p className="text-sm text-secondary leading-relaxed font-medium italic">
                                                                        {loc.description}
                                                                    </p>
                                                                </div>
                                                                <div className="pt-2">
                                                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${loc.intensity * 10}% ` }}></div>
                                                                    </div>
                                                                    <div className="flex justify-between mt-1">
                                                                        <span className="text-sm text-slate-400">Intensity</span>
                                                                        <span className="text-sm text-emerald-600 font-bold">{loc.intensity}/10</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="col-span-full p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                        <Globe className="w-8 h-8 text-secondary mx-auto mb-2" />
                                                        <p className="text-secondary">No major planetary lines found on key global cities for this birth time.</p>
                                                        <p className="text-slate-500 text-sm mt-1">Try generating a report for a different time or look for minor aspects.</p>
                                                    </div>
                                                )}
                                            </div>

                                        </>
                                    )}
                                </div>
                            )
                        }

                        {/* KP ASTROLOGY TAB */}
                        {activeTab === 'kp' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* KP Analysis Header */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Target className="w-8 h-8 text-blue-600" />
                                        <div>
                                            <h2 className="text-3xl font-black text-primary uppercase tracking-tight">
                                                KP Astrology Analysis
                                            </h2>
                                            <p className="text-sm text-blue-600 font-semibold">
                                                Krishnamurti Paddhati • Event-Based Predictions
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed">
                                        Precise event timing using sub-lord theory, ruling planets, and significator analysis.
                                        Clear yes/no answers with confidence levels and practical guidance.
                                    </p>
                                </div>

                                {/* KP Predictions Grid */}
                                {report.vedic_astrology?.kp_system && (
                                    <div className="glass-panel p-8 rounded-3xl space-y-6 relative overflow-hidden bg-white border border-gray-100 shadow-xl">
                                        <div className="absolute top-0 right-0 p-6 opacity-5">
                                            <Star className="w-32 h-32 text-primary" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Star className="w-6 h-6 text-emerald-600" />
                                            <div>
                                                <h3 className="text-lg md:text-xl font-bold text-primary uppercase tracking-widest">{t('report.vedic.kp_system')}</h3>
                                                <p className="text-sm text-emerald-600">Krishnamurti Paddhati</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Left Column: Planetary Table */}
                                            <div className="space-y-4">
                                                {/* Mobile View Cards */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
                                                    {report.vedic_astrology.kp_system.slice(0, 9).map((p, idx) => (
                                                        <div key={idx} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-bold text-primary">{p.planet}</span>
                                                                <span className="text-sm text-secondary uppercase">{(p.sign || '').substring?.(0, 3) || p.sign}</span>
                                                            </div>
                                                            <div className="flex gap-4 text-right">
                                                                <div>
                                                                    <div className="text-xs text-secondary uppercase font-bold tracking-widest">Star</div>
                                                                    <div className="text-xs font-bold text-emerald-700">{p.star_lord}</div>
                                                                </div>
                                                                <div>
                                                                    <div className="text-xs text-secondary uppercase font-bold tracking-widest">Sub</div>
                                                                    <div className="text-xs font-bold text-amber-700">{p.sub_lord}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Desktop View Table */}
                                                <div className="hidden lg:block space-y-2">
                                                    <div className="grid grid-cols-4 text-sm font-bold text-secondary uppercase pb-2 border-b border-gray-100">
                                                        <span>Planet</span>
                                                        <span>Sign</span>
                                                        <span>Star</span>
                                                        <span>Sub</span>
                                                    </div>
                                                    {report.vedic_astrology.kp_system.slice(0, 9).map((p, idx) => (
                                                        <div key={idx} className="grid grid-cols-4 text-sm items-center py-2 border-b border-gray-100 last:border-0 hover:bg-emerald-50/50 transition-colors rounded-lg px-2 -mx-2">
                                                            <span className="text-primary font-bold">{p.planet}</span>
                                                            <span className="text-secondary text-sm">{(p.sign || '').substring?.(0, 3) || p.sign}</span>
                                                            <span className="text-emerald-700 font-medium text-sm">{p.star_lord}</span>
                                                            <span className="text-amber-700 font-medium text-sm">{p.sub_lord}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Right Column: Easy English Analysis (Enhanced) */}
                                            <div className="space-y-6 relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                                                            <Scroll className="w-5 h-5 text-emerald-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-primary uppercase tracking-widest">{t('report.vedic.kp_analysis', 'KP ANALYSIS')}</h4>
                                                            <p className="text-sm text-emerald-600 font-bold uppercase tracking-wider">Detailed Personal Insights</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {report.vedic_astrology.kp_analysis ? (
                                                    <div className="grid grid-cols-1 gap-4 relative z-10">
                                                        {report.vedic_astrology.kp_analysis.map((item, idx) => {
                                                            // Helper to match icons and colors
                                                            const getStyle = (type) => {
                                                                const t = (type || '').toLowerCase();
                                                                if (t.includes('health')) return { icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-100', accent: 'bg-rose-100' };
                                                                if (t.includes('career') || t.includes('job')) return { icon: Briefcase, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', accent: 'bg-amber-100' };
                                                                if (t.includes('property')) return { icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', accent: 'bg-emerald-100' };
                                                                if (t.includes('marriage') || t.includes('relationship')) return { icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50/50', border: 'border-pink-100', accent: 'bg-pink-100' };
                                                                if (t.includes('timing')) return { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', accent: 'bg-blue-100' };
                                                                if (t.includes('ruling')) return { icon: Star, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100', accent: 'bg-purple-100' };
                                                                if (t.includes('wealth') || t.includes('finance')) return { icon: Gem, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', accent: 'bg-indigo-100' };
                                                                if (t.includes('education') || t.includes('child')) return { icon: GraduationCap, color: 'text-violet-600', bg: 'bg-violet-50/50', border: 'border-violet-100', accent: 'bg-violet-100' };
                                                                if (t.includes('remedy')) return { icon: Sparkles, color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100', accent: 'bg-indigo-100' };
                                                                return { icon: Brain, color: 'text-slate-600', bg: 'bg-slate-50/50', border: 'border-slate-100', accent: 'bg-slate-100' };
                                                            };
                                                            const style = getStyle(item.type);
                                                            const ItemIcon = style.icon;

                                                            return (
                                                                <div key={idx} className={`p-5 rounded-[1.5rem] border transition-all hover:bg-white hover:shadow-lg ${style.bg} ${style.border} group`}>
                                                                    <div className="flex gap-4">
                                                                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 ${style.accent}`}>
                                                                            <ItemIcon className={`w-5 h-5 ${style.color}`} />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <span className={`text-xs font-black uppercase tracking-[0.2em] ${style.color}`}>
                                                                                {item.type}
                                                                            </span>
                                                                            <p className="text-sm text-slate-700 leading-relaxed font-medium"
                                                                                dangerouslySetInnerHTML={{ __html: (item.meaning || '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-bold">$1</strong>') }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                        <Brain className="w-8 h-8 mb-2 opacity-50" />
                                                        <p className="text-sm italic">Personalized interpretation is being ready...</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                                            <p className="text-sm text-emerald-700 uppercase tracking-widest font-bold">
                                                {t('report.vedic.source_kp')}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Foreign Travel Prediction Engine (Special Feature) */}
                                {(() => {
                                    const travelPrediction = report.kp_analysis?.predictions?.find(p => p.event === 'Foreign Travel');
                                    if (!travelPrediction) return null;
                                    return (
                                        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-800 text-white relative overflow-hidden shadow-2xl border border-blue-400/20 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay"></div>
                                            <div className="absolute top-0 right-0 p-12 opacity-15 rotate-12 transition-transform hover:scale-110">
                                                <Globe className="w-64 h-64 text-white" />
                                            </div>

                                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md">
                                                            <Target className="w-4 h-4 text-blue-200" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">KP Astrology Engine</span>
                                                        </div>
                                                        <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase italic">
                                                            Foreign Travel <br />
                                                            <span className="text-blue-300">Prediction</span>
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className={`px-6 py-2 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl ${travelPrediction.outcome === 'Yes' ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                                                            'bg-amber-500 text-white shadow-amber-500/30'
                                                            }`}>
                                                            {travelPrediction.outcome}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">Outcome Probability</span>
                                                            <span className="text-lg font-bold">{travelPrediction.confidence} Confidence</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-lg md:text-xl text-blue-50 font-medium leading-relaxed italic border-l-4 border-blue-400/30 pl-6">
                                                        "{travelPrediction.guidance}"
                                                    </p>
                                                </div>

                                                <div className="flex flex-col justify-between gap-8 order-last md:order-none">
                                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] space-y-6">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <Clock className="w-5 h-5 text-blue-200" />
                                                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-100">Timing of Opportunity</h4>
                                                            </div>
                                                            <p className="text-2xl font-black tracking-tight text-white">
                                                                {travelPrediction.time_window || "Currently neutral"}
                                                            </p>
                                                        </div>

                                                        <div className="pt-6 border-t border-white/10">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <Target className="w-5 h-5 text-blue-200" />
                                                                <h4 className="text-xs font-black uppercase tracking-widest text-blue-100">KP Logic Breakdown</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-blue-200 font-bold uppercase tracking-wider text-[10px]">Positive Significators</span>
                                                                    <span className="text-emerald-400 font-black">{travelPrediction.kp_logic?.supporting_houses}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-blue-200 font-bold uppercase tracking-wider text-[10px]">Opposing Factors</span>
                                                                    <span className="text-rose-400 font-black">{travelPrediction.kp_logic?.opposing_houses}</span>
                                                                </div>
                                                                <div className="p-3 bg-blue-900/40 rounded-xl border border-blue-400/20">
                                                                    <p className="text-xs text-blue-50 font-medium leading-relaxed italic">
                                                                        {travelPrediction.kp_logic?.sublord_judgment}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Career Promotion Engine (Special Feature) */}
                                {(() => {
                                    const promotionPrediction = report.kp_analysis?.predictions?.find(p => p.event === 'Promotion');
                                    if (!promotionPrediction) return null;
                                    return (
                                        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-950 text-white relative overflow-hidden shadow-2xl border border-slate-700/30 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay"></div>
                                            <div className="absolute top-0 right-0 p-12 opacity-10 -rotate-12 transition-transform hover:scale-110">
                                                <Briefcase className="w-64 h-64 text-white" />
                                            </div>

                                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-700/40 border border-slate-600/30 backdrop-blur-md">
                                                            <Brain className="w-4 h-4 text-blue-400" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Corporate Recognition Engine</span>
                                                        </div>
                                                        <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase italic text-white">
                                                            Career <br />
                                                            <span className="text-blue-400">Promotion</span>
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className={`px-6 py-2 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl ${promotionPrediction.outcome === 'Yes' ? 'bg-blue-600 text-white shadow-blue-500/30' :
                                                            'bg-amber-600 text-white shadow-amber-500/30'
                                                            }`}>
                                                            {promotionPrediction.outcome}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Outcome Probability</span>
                                                            <span className="text-lg font-bold text-slate-100">{promotionPrediction.confidence} Confidence</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed italic border-l-4 border-blue-500/50 pl-6">
                                                        "{promotionPrediction.guidance}"
                                                    </p>
                                                </div>

                                                <div className="flex flex-col justify-between gap-8 order-last md:order-none">
                                                    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] space-y-6">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <TrendingUp className="w-5 h-5 text-blue-400" />
                                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Peak Elevation Window</h4>
                                                            </div>
                                                            <p className="text-2xl font-black tracking-tight text-white">
                                                                {promotionPrediction.time_window || "Currently neutral"}
                                                            </p>
                                                        </div>

                                                        <div className="pt-6 border-t border-white/5">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <Target className="w-5 h-5 text-blue-400" />
                                                                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Cuspal Logic Breakdown</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Active Houses</span>
                                                                    <span className="text-blue-400 font-black">{promotionPrediction.kp_logic?.supporting_houses}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Resistance factors</span>
                                                                    <span className="text-rose-400 font-black">{promotionPrediction.kp_logic?.opposing_houses}</span>
                                                                </div>
                                                                <div className="p-3 bg-slate-800/40 rounded-xl border border-white/5">
                                                                    <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                                                                        {promotionPrediction.kp_logic?.sublord_judgment}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Financial Prosperity Prediction Engine (Special Feature) */}
                                {(() => {
                                    const wealthPrediction = report.kp_analysis?.predictions?.find(p => p.event === 'Financial Prosperity');
                                    if (!wealthPrediction) return null;
                                    return (
                                        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-indigo-700 to-purple-900 text-white relative overflow-hidden shadow-2xl border border-indigo-400/20 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay"></div>
                                            <div className="absolute top-0 right-0 p-12 opacity-15 -rotate-6 transition-transform hover:scale-110">
                                                <Gem className="w-64 h-64 text-white" />
                                            </div>

                                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md">
                                                            <Target className="w-4 h-4 text-indigo-200" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">KP Wealth Engine</span>
                                                        </div>
                                                        <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase italic">
                                                            Financial <br />
                                                            <span className="text-indigo-300">Prosperity</span>
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className={`px-6 py-2 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl ${wealthPrediction.outcome === 'Yes' ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                                                            'bg-amber-500 text-white shadow-amber-500/30'
                                                            }`}>
                                                            {wealthPrediction.outcome}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Outcome Probability</span>
                                                            <span className="text-lg font-bold">{wealthPrediction.confidence} Confidence</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-lg md:text-xl text-indigo-50 font-medium leading-relaxed italic border-l-4 border-indigo-400/30 pl-6">
                                                        "{wealthPrediction.guidance}"
                                                    </p>
                                                </div>

                                                <div className="flex flex-col justify-between gap-8 order-last md:order-none">
                                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] space-y-6">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <Clock className="w-5 h-5 text-indigo-200" />
                                                                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-100">Timing of Opportunity</h4>
                                                            </div>
                                                            <p className="text-2xl font-black tracking-tight text-white">
                                                                {wealthPrediction.time_window || "Currently neutral"}
                                                            </p>
                                                        </div>

                                                        <div className="pt-6 border-t border-white/10">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <Target className="w-5 h-5 text-indigo-200" />
                                                                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-100">KP Logic Breakdown</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-indigo-200 font-bold uppercase tracking-wider text-[10px]">Positive Significators</span>
                                                                    <span className="text-emerald-400 font-black">{wealthPrediction.kp_logic?.supporting_houses}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-indigo-200 font-bold uppercase tracking-wider text-[10px]">Opposing Factors</span>
                                                                    <span className="text-rose-400 font-black">{wealthPrediction.kp_logic?.opposing_houses}</span>
                                                                </div>
                                                                <div className="p-3 bg-indigo-900/40 rounded-xl border border-indigo-400/20">
                                                                    <p className="text-xs text-indigo-50 font-medium leading-relaxed italic">
                                                                        {wealthPrediction.kp_logic?.sublord_judgment}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Vehicle Purchase Prediction Engine (Special Feature) */}
                                {(() => {
                                    const vehiclePrediction = report.kp_analysis?.predictions?.find(p => p.event === 'Vehicle Purchase');
                                    if (!vehiclePrediction) return null;
                                    return (
                                        <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-teal-700 to-cyan-900 text-white relative overflow-hidden shadow-2xl border border-teal-400/20 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                            <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay"></div>
                                            <div className="absolute top-0 right-0 p-12 opacity-15 rotate-3 transition-transform hover:scale-110">
                                                <Car className="w-64 h-64 text-white" />
                                            </div>

                                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md">
                                                            <Target className="w-4 h-4 text-teal-200" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-teal-100">KP Vehicle Engine</span>
                                                        </div>
                                                        <h3 className="text-3xl md:text-4xl font-black tracking-tight leading-tight uppercase italic">
                                                            Vehicle <br />
                                                            <span className="text-teal-300">Purchase</span>
                                                        </h3>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        <div className={`px-6 py-2 rounded-2xl text-lg font-black uppercase tracking-widest shadow-xl ${vehiclePrediction.outcome === 'Yes' ? 'bg-emerald-500 text-white shadow-emerald-500/30' :
                                                            'bg-amber-500 text-white shadow-amber-500/30'
                                                            }`}>
                                                            {vehiclePrediction.outcome}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-teal-200">Outcome Probability</span>
                                                            <span className="text-lg font-bold">{vehiclePrediction.confidence} Confidence</span>
                                                        </div>
                                                    </div>

                                                    <p className="text-lg md:text-xl text-teal-50 font-medium leading-relaxed italic border-l-4 border-teal-400/30 pl-6">
                                                        "{vehiclePrediction.guidance}"
                                                    </p>
                                                </div>

                                                <div className="flex flex-col justify-between gap-8 order-last md:order-none">
                                                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] space-y-6">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <Clock className="w-5 h-5 text-teal-200" />
                                                                <h4 className="text-xs font-black uppercase tracking-widest text-teal-100">Timing of Opportunity</h4>
                                                            </div>
                                                            <p className="text-2xl font-black tracking-tight text-white">
                                                                {vehiclePrediction.time_window || "Currently neutral"}
                                                            </p>
                                                        </div>

                                                        <div className="pt-6 border-t border-white/10">
                                                            <div className="flex items-center gap-3 mb-4">
                                                                <Target className="w-5 h-5 text-teal-200" />
                                                                <h4 className="text-xs font-black uppercase tracking-widest text-teal-100">KP Logic Breakdown</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-teal-200 font-bold uppercase tracking-wider text-[10px]">Positive Significators</span>
                                                                    <span className="text-emerald-400 font-black">{vehiclePrediction.kp_logic?.supporting_houses}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center text-sm">
                                                                    <span className="text-teal-200 font-bold uppercase tracking-wider text-[10px]">Opposing Factors</span>
                                                                    <span className="text-rose-400 font-black">{vehiclePrediction.kp_logic?.opposing_houses}</span>
                                                                </div>
                                                                <div className="p-3 bg-teal-900/40 rounded-xl border border-teal-400/20">
                                                                    <p className="text-xs text-teal-50 font-medium leading-relaxed italic">
                                                                        {vehiclePrediction.kp_logic?.sublord_judgment}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* KP Predictions Grid */}
                                {report.kp_analysis && report.kp_analysis.predictions && report.kp_analysis.predictions.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {report.kp_analysis.predictions.filter(p => !['Foreign Travel', 'Promotion', 'Vehicle Purchase', 'Financial Prosperity'].includes(p.event)).map((prediction, idx) => (
                                            <div key={idx} className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
                                                {/* Event Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-black text-primary uppercase tracking-tight mb-1">
                                                            {prediction.event}
                                                        </h3>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${prediction.outcome === 'Yes' || prediction.outcome === 'Likely' ? 'bg-green-100 text-green-700' :
                                                                prediction.outcome === 'No' || prediction.outcome === 'Unlikely' ? 'bg-red-100 text-red-700' :
                                                                    prediction.outcome === 'Delayed' ? 'bg-amber-100 text-amber-700' :
                                                                        'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {prediction.outcome}
                                                            </span>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${prediction.confidence === 'High' ? 'bg-blue-100 text-blue-700' :
                                                                prediction.confidence === 'Medium' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-slate-100 text-slate-700'
                                                                }`}>
                                                                {prediction.confidence} Confidence
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Time Window */}
                                                {prediction.time_window && (
                                                    <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Clock className="w-4 h-4 text-blue-600" />
                                                            <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                                                                Time Window
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-blue-700">
                                                            {prediction.time_window}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* KP Logic Summary */}
                                                {prediction.kp_logic && (
                                                    <div className="mb-4 space-y-2">
                                                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                                                            KP Logic Summary
                                                        </h4>
                                                        {prediction.kp_logic.supporting_houses && (
                                                            <div className="text-sm">
                                                                <span className="font-bold text-green-700">Supporting: </span>
                                                                <span className="text-slate-700">{prediction.kp_logic.supporting_houses}</span>
                                                            </div>
                                                        )}
                                                        {prediction.kp_logic.opposing_houses && (
                                                            <div className="text-sm">
                                                                <span className="font-bold text-red-700">Opposing: </span>
                                                                <span className="text-slate-700">{prediction.kp_logic.opposing_houses}</span>
                                                            </div>
                                                        )}
                                                        {prediction.kp_logic.sublord_judgment && (
                                                            <div className="text-sm">
                                                                <span className="font-bold text-blue-700">Sub-lord: </span>
                                                                <span className="text-slate-700">{prediction.kp_logic.sublord_judgment}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* User Guidance */}
                                                {prediction.guidance && (
                                                    <div className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
                                                        <div className="flex items-start gap-2">
                                                            <Lightbulb className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider mb-1">
                                                                    Guidance
                                                                </h4>
                                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                                    {prediction.guidance}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl p-12 border-2 border-slate-100 text-center">
                                        <Target className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-slate-600 mb-2">
                                            KP Analysis Not Available
                                        </h3>
                                        <p className="text-slate-500">
                                            KP predictions require precise birth time. Please ensure your birth time is accurate.
                                        </p>
                                    </div>
                                )}

                                {/* KP Methodology Info */}
                                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                                    <h3 className="text-lg font-black text-primary uppercase tracking-tight mb-4">
                                        About KP Astrology
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <h4 className="font-bold text-blue-700 mb-1">Sub-Lord Theory</h4>
                                            <p className="text-slate-600">
                                                The sub-lord of house cusps determines the final outcome of events.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-purple-700 mb-1">Ruling Planets</h4>
                                            <p className="text-slate-600">
                                                Ascendant lord, Moon star lord, and Day lord indicate timing and answers.
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-indigo-700 mb-1">Significators</h4>
                                            <p className="text-slate-600">
                                                Planets connected to specific houses through lordship, occupation, or aspect.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div >
    );
};

export default function ConsolidatedReportWithBoundary() {
    return (
        <ErrorBoundary>
            <ConsolidatedReport />
        </ErrorBoundary>
    );
}
