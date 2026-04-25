import React, { useState, useEffect, useMemo } from 'react';
import { useChart } from '../context/ChartContext';
import { Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Download, Share2, Grid, Table, BarChart3, Settings2, Languages, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { API_BASE_URL } from '../api/config';

const BirthChart = () => {
    const { t, i18n } = useTranslation();
    const { userData: contextUserData, consolidatedReport: contextReport } = useChart();
    const navigate = useNavigate();
    const location = useLocation();

    // Local state for robustness
    const [localUserData, setLocalUserData] = useState(() => {
        if (contextUserData) return contextUserData;
        if (location.state?.userData) return location.state.userData;
        const saved = localStorage.getItem('lastReportData');
        return saved ? JSON.parse(saved) : null;
    });

    const [localReport, setLocalReport] = useState(() => {
        if (contextReport) return contextReport;
        if (location.state?.report) return location.state.report;
        if (location.state?.preFetchedReport) return location.state.preFetchedReport;
        return null;
    });

    const [fetchError, setFetchError] = useState(null);
    const [isFetchingReport, setIsFetchingReport] = useState(false);
    
    const [chartStyle, setChartStyle] = useState('north');
    const [selectedVarga, setSelectedVarga] = useState('D1');
    const [vargaImages, setVargaImages] = useState({});
    const [loadingVarga, setLoadingVarga] = useState(false);

    const vargaList = [
        { id: 'D1', name: 'Lagna (D1)', desc: 'General Life' },
        { id: 'D2', name: 'Hora (D2)', desc: 'Wealth' },
        { id: 'D3', name: 'Drekkana (D3)', desc: 'Siblings/Effort' },
        { id: 'D4', name: 'Chaturthamsha (D4)', desc: 'Fortune/Home' },
        { id: 'D7', name: 'Saptamsha (D7)', desc: 'Progeny' },
        { id: 'D9', name: 'Navamsha (D9)', desc: 'Marriage/Spouse' },
        { id: 'D10', name: 'Dashamsha (D10)', desc: 'Career/Power' },
        { id: 'D12', name: 'Dwadamsha (D12)', desc: 'Parents' },
        { id: 'D16', name: 'Shodashamsha (D16)', desc: 'Vehicles/Pleasure' },
        { id: 'D20', name: 'Vimshamsha (D20)', desc: 'Spirituality' },
        { id: 'D24', name: 'Chaturvimshamsha (D24)', desc: 'Education/Knowledge' },
        { id: 'D27', name: 'Saptavimshamsha (D27)', desc: 'Strength/Vitality' },
        { id: 'D30', name: 'Trimshamsha (D30)', desc: 'Evils/Obstacles' },
        { id: 'D40', name: 'Khavedamsha (D40)', desc: 'General Auspiciousness' },
        { id: 'D45', name: 'Akshavedamsha (D45)', desc: 'Character/Conduct' },
        { id: 'D60', name: 'Shashtiamsha (D60)', desc: 'Deep Karma/Past Life' }
    ];

    useEffect(() => {
        const fetchMissingReport = async () => {
            if (localUserData && !localReport && !isFetchingReport) {
                setIsFetchingReport(true);
                try {
                    const [year, month, day] = localUserData.date.split('-').map(Number);
                    const [hour, minute] = localUserData.time.split(':').map(Number);
                    
                    const payload = {
                        name: localUserData.name,
                        year, month, day, hour, minute,
                        lat: localUserData.lat, lng: localUserData.lng,
                        city: localUserData.place,
                        lang: i18n.language,
                        timezone: localUserData.timezone,
                        marital_status: localUserData.marital_status,
                        profession: localUserData.profession
                    };

                    const response = await fetch(`${API_BASE_URL}/api/report/consolidated`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setLocalReport(data);
                    } else {
                        setFetchError("Failed to load technical data.");
                    }
                } catch (err) {
                    console.error("Fetch Error:", err);
                    setFetchError("Connection error. Please try again.");
                } finally {
                    setIsFetchingReport(false);
                }
            }
        };

        fetchMissingReport();
    }, [localUserData, localReport, i18n.language]);

    useEffect(() => {
        if (localUserData) {
            fetchVargaChart(selectedVarga, chartStyle);
        }
    }, [localUserData, selectedVarga, chartStyle]);

    const fetchVargaChart = async (varga, style) => {
        const cacheKey = `${varga}-${style}`;
        if (vargaImages[cacheKey]) return;

        setLoadingVarga(true);
        try {
            const [year, month, day] = localUserData.date.split('-').map(Number);
            const [hour, minute] = localUserData.time.split(':').map(Number);
            
            const response = await fetch(`${API_BASE_URL}/api/chart/varga/${varga}/${style}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: localUserData.name,
                    year, month, day, hour, minute,
                    lat: localUserData.lat, lng: localUserData.lng,
                    city: localUserData.place,
                    lang: i18n.language,
                    timezone: localUserData.timezone
                })
            });
            const data = await response.json();
            setVargaImages(prev => ({ ...prev, [cacheKey]: data.image }));
        } catch (err) {
            console.error("Varga fetch error:", err);
        } finally {
            setLoadingVarga(false);
        }
    };

    if (!localUserData) {
        return <Navigate to="/chart" replace />;
    }

    if (!localReport || isFetchingReport) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Calculating Technical Metrics</h3>
                <p className="text-gray-500">Aligning 16 divisional charts and calculating Shadbala scores...</p>
                {fetchError && <p className="mt-4 text-red-500 font-medium">{fetchError}</p>}
            </div>
        );
    }

    const vedic = localReport.vedic_astrology;
    const planets = vedic.planets || [];
    const ashtakavarga = vedic.ashtakavarga || Array(12).fill(28);
    const shadbala = vedic.shadbala || {};

    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

    const handleDownloadPDF = async () => {
        try {
            const [year, month, day] = localUserData.date.split('-').map(Number);
            const [hour, minute] = localUserData.time.split(':').map(Number);
            
            const response = await fetch(`${API_BASE_URL}/api/report/pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: localUserData.name,
                    year, month, day, hour, minute,
                    lat: localUserData.lat, lng: localUserData.lng,
                    city: localUserData.place,
                    lang: i18n.language,
                    timezone: localUserData.timezone,
                    marital_status: localUserData.marital_status,
                    profession: localUserData.profession
                })
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `AstroPinch_Kundali_${localUserData.name.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (err) {
            console.error("PDF Download failed:", err);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My AstroPinch Kundali',
                text: `Check out my birth chart on AstroPinch!`,
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('Sharing link copied to clipboard!');
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="space-y-10 pb-20">
            <SEO
                title={t('birth_chart.seo_title', { name: localUserData.name })}
                description={t('birth_chart.seo_desc', { name: localUserData.name })}
                url="/birth-chart"
            />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-xs">
                        <Sparkles className="w-4 h-4" />
                        {t('birth_chart.vedic_dashboard', 'Advanced Vedic Dashboard')}
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 leading-tight">
                        {t('birth_chart.title', { name: localUserData.name })}
                    </h2>
                    <p className="text-gray-500 font-medium">
                        {localUserData.place} • {new Date(localUserData.date).toLocaleDateString(undefined, { dateStyle: 'long' })} • {localUserData.time}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button 
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-md active:scale-95"
                    >
                        <Download className="w-4 h-4" />
                        {t('common.download_pdf', 'Download PDF')}
                    </button>
                    <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:border-primary/20 transition-all shadow-sm active:scale-95"
                    >
                        <Share2 className="w-4 h-4" />
                        {t('common.share', 'Share')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column: Charts */}
                <div className="xl:col-span-8 space-y-8">
                    {/* Main Chart Viewer */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 flex gap-3">
                            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                                <button 
                                    onClick={() => setChartStyle('north')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${chartStyle === 'north' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    North
                                </button>
                                <button 
                                    onClick={() => setChartStyle('south')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${chartStyle === 'south' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    South
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-8">
                            <div className="w-full max-w-[500px] aspect-square relative group">
                                {loadingVarga ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-3xl">
                                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                    </div>
                                ) : null}
                                <div className="w-full h-full p-4 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                                    {vargaImages[`${selectedVarga}-${chartStyle}`] ? (
                                        <img 
                                            src={vargaImages[`${selectedVarga}-${chartStyle}`]} 
                                            alt={selectedVarga} 
                                            className="w-full h-full object-contain drop-shadow-2xl"
                                        />
                                    ) : (
                                        <div className="text-gray-400 animate-pulse">Loading Chart...</div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <Grid className="w-5 h-5 text-primary" />
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                                        Shodashvarga <span className="text-gray-400">(16 Divisional Charts)</span>
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                                    {vargaList.map(v => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVarga(v.id)}
                                            className={`p-3 rounded-2xl border transition-all text-center group ${selectedVarga === v.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-gray-50 border-gray-100 hover:border-primary/30 text-gray-700'}`}
                                        >
                                            <div className="text-sm font-black mb-1">{v.id}</div>
                                            <div className={`text-[9px] uppercase tracking-tighter font-bold opacity-70 truncate ${selectedVarga === v.id ? 'text-white' : 'text-gray-500'}`}>
                                                {v.name.split(' ')[0]}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ashtakavarga Table */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                        <div className="flex items-center gap-3 mb-8">
                            <Table className="w-6 h-6 text-primary" />
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                Ashtakavarga <span className="text-gray-400 text-lg">Points (SAV)</span>
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                            {signs.map((sign, idx) => (
                                <div key={sign} className="relative group overflow-hidden bg-gray-50 rounded-2xl p-4 border border-gray-100 hover:border-primary/20 transition-all">
                                    <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">{sign}</div>
                                    <div className="text-2xl font-black text-gray-900">{ashtakavarga[idx] || 0}</div>
                                    <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                                        <div className="h-full bg-primary" style={{ width: `${(ashtakavarga[idx] / 56) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-sm text-gray-500 font-medium leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <strong>Note:</strong> Ashtakavarga points (Bindus) represent the strength of planets in each sign. Points above 28 are generally considered auspicious and capable of giving positive results during transits.
                        </p>
                    </div>
                </div>

                {/* Right Column: Planetary Strength & Details */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Shadbala Scores */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
                        <div className="flex items-center gap-3 mb-8">
                            <BarChart3 className="w-6 h-6 text-primary" />
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                                Shadbala <span className="text-gray-400 text-lg">Strength</span>
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {Object.entries(shadbala).map(([planet, score]) => (
                                <div key={planet} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div className="text-sm font-black text-gray-700 uppercase tracking-widest">{planet}</div>
                                        <div className="text-sm font-black text-primary">{score}</div>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                        <div 
                                            className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full transition-all duration-1000"
                                            style={{ width: `${Math.min(100, (score / 150) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Planet Info */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-900/40">
                        <div className="flex items-center gap-3 mb-8">
                            <Settings2 className="w-6 h-6 text-primary" />
                            <h3 className="text-2xl font-black uppercase tracking-tight">
                                Planet <span className="text-gray-500 text-lg">Details</span>
                            </h3>
                        </div>
                        <div className="space-y-4">
                            {planets.map(p => (
                                <div key={p.name} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center font-black text-xs group-hover:bg-primary transition-colors">
                                            {p.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-black text-sm uppercase tracking-wide">{p.name}</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase">{p.sign}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-black text-primary text-sm">{p.position}°</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase">House {p.house}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Actions */}
                    <div className="space-y-4">
                        <button
                            onClick={() => navigate('/horoscope')}
                            className="w-full flex items-center justify-center gap-3 p-5 bg-gradient-to-br from-primary to-blue-700 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all group"
                        >
                            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                            {t('common.view_daily_guidance', 'View Daily Guidance')}
                        </button>
                        <button
                            onClick={() => navigate('/report/consolidated')}
                            className="w-full flex items-center justify-center gap-3 p-5 bg-white border-2 border-gray-100 text-gray-900 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:border-primary/20 transition-all shadow-lg shadow-gray-100"
                        >
                            {t('common.view_consolidated', 'Full Consolidated Report')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BirthChart;
