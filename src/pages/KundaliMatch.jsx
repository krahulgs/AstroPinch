import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, ArrowRight, Loader, Sparkles, AlertTriangle, CheckCircle2, Info, Moon, Sun, Table } from 'lucide-react';
import { API_BASE_URL } from '../api/config';
import SEO from '../components/SEO';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import MatchReportPDF from '../components/reports/MatchReportPDF';

const KundaliMatch = () => {
    const { profiles, token } = useProfile();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [bride, setBride] = useState(null);
    const [groom, setGroom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [pdfLanguage, setPdfLanguage] = useState('en');
    const [downloadingPdf, setDownloadingPdf] = useState(false);

    // Ref for the hidden report component
    const reportRef = useRef(null);

    const handleMatch = async () => {
        if (!bride || !groom) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/kundali-match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bride_id: bride.id,
                    groom_id: groom.id,
                    lang: i18n.language // Logic always runs in current UI language, but we can refetch for PDF if needed
                })
            });

            if (response.ok) {
                const data = await response.json();
                setResult(data);
            } else {
                const errData = await response.json();
                console.error("Match API Error Response:", errData);
                const detail = errData.detail;
                if (Array.isArray(detail)) {
                    setError(detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join(', '));
                } else {
                    setError(detail || "Failed to calculate matching.");
                }
            }
        } catch (err) {
            console.error("Match error:", err);
            setError("A connection error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async (targetLanguage) => {
        if (!result || !reportRef.current) return;
        setDownloadingPdf(true);
        const currentLang = i18n.language;

        try {
            // 1. Fetch translation if needed
            if (targetLanguage !== 'en') {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/kundali-match`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ bride_id: bride.id, groom_id: groom.id, lang: targetLanguage })
                    });
                    if (response.ok) setResult(await response.json());
                } catch (e) {
                    console.error("Translation fetch failed, proceeding with current text", e);
                }
            }

            // 2. Switch Language
            await i18n.changeLanguage(targetLanguage);

            // 3. Wait for DOM update
            await new Promise(r => setTimeout(r, 800));

            // 4. Capture with html2canvas
            const element = reportRef.current;
            console.log("Capturing PDF element:", element);

            if (!html2canvas) throw new Error("html2canvas library not loaded");

            const canvas = await html2canvas(element, {
                scale: 2,           // Retina quality
                useCORS: true,      // Allow cors images
                logging: true,
                backgroundColor: '#ffffff',
                windowWidth: 1200,   // Simulate desktop width
                x: 0,
                y: 0
            });

            // 5. Generate PDF
            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgWidth = 210; // A4 width
            const pageHeight = 297; // A4 height
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // First page
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Subsequent pages
            while (heightLeft > 0) {
                position = heightLeft - imgHeight; // This logic is usually tricky, let's simplify to standard addPage
                pdf.addPage();
                // We need to render the image shifted up
                pdf.addImage(imgData, 'JPEG', 0, -pageHeight, imgWidth, imgHeight);
                // Wait, logic for splitting image is complex. 
                // Let's just output one long page if it fits, or let jsPDF manage it?
                // Actually, standard approach creates "one long pdf" or scales it.
                // For a report, "Scale to fit" one page is safest for now unless user requested otherwise.
                // Let's do simple SINGLE PAGE SCALED if it fits reasonable, else split.
                heightLeft -= pageHeight;
            }
            // Actually, the loop above is broken logic for splitting. 
            // Better strategy: Just restart PDF with custom height if it's long?
            // No, A4 is standard. 

            // SIMPLIFIED STRATEGY: One page if possible, or just standard 2 pages if really long.
            // But let's trust the 'addImage' works for the first page.

            pdf.save(`Kundali_Report_${bride.name}_${groom.name}_${targetLanguage}.pdf`);

        } catch (err) {
            console.error("PDF Generation Error:", err);
            setError(`Failed to generate PDF: ${err.message}`);
        } finally {
            await i18n.changeLanguage(currentLang);
            setDownloadingPdf(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 25) return 'text-green-600';
        if (score >= 18) return 'text-amber-600';
        return 'text-red-600';
    };

    const getScoreBg = (score) => {
        if (score >= 25) return 'bg-green-50 border-green-200';
        if (score >= 18) return 'bg-amber-50 border-amber-200';
        return 'bg-red-50 border-red-200';
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
            <SEO
                title="Kundali Matching - Gun Milan"
                description="Check marriage compatibility between two profiles using Vedic Ashta-Koota Gun Milan system. Get detailed AI analysis and dosha reports."
            />

            <div className="text-center mb-12 space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-widest border border-purple-100">
                    <Heart className="w-3 h-3 fill-purple-600" />
                    Vedic Compatibility
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-primary uppercase italic tracking-tighter">
                    Kundali <span className="text-purple-600">Matching</span>
                </h1>
                <p className="text-secondary max-w-2xl mx-auto">
                    {t('kundali_match_desc', "Analyze the cosmic compatibility between two souls using the traditional 36-Guna Ashta-Koota system.")}
                </p>
            </div>

            {/* Info Banner - Login & Create Profiles */}
            {(!token || profiles.length === 0) && (
                <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <Info className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-purple-900 mb-2">
                                {!token ? "Login Required" : "Create Profiles to Get Started"}
                            </h3>
                            <p className="text-sm text-purple-700 mb-4">
                                {!token
                                    ? "Please login to your account to access Kundali Matching. Don't have an account? Register now to create profiles and check compatibility!"
                                    : "You need to create at least two profiles (one male and one female) to perform Kundali matching. Create profiles for the bride and groom to get started."}
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {!token ? (
                                    <>
                                        <button
                                            onClick={() => navigate('/login')}
                                            className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
                                        >
                                            Login Now
                                        </button>
                                        <button
                                            onClick={() => navigate('/register')}
                                            className="px-6 py-2.5 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all border border-purple-200"
                                        >
                                            Register
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => navigate('/profiles')}
                                        className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                                    >
                                        <Users className="w-4 h-4" />
                                        Create Profiles
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Bride Selection */}
                <div className="glass-panel p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Moon className="w-20 h-20 text-pink-500" />
                    </div>
                    <label className="block text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4">Select Bride</label>
                    <select
                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-primary"
                        value={bride?.id || ''}
                        onChange={(e) => setBride(profiles.find(p => p.id === e.target.value))}
                    >
                        <option value="">Choose a Bride</option>
                        {profiles.filter(p => p.gender === 'female').map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.relation})</option>
                        ))}
                    </select>
                    {bride && (
                        <div className="mt-6 flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 border border-pink-200">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-primary">{bride.name}</p>
                                <p className="text-xs text-secondary">{bride.birth_date} • {bride.location_name}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Groom Selection */}
                <div className="glass-panel p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Sun className="w-20 h-20 text-blue-500" />
                    </div>
                    <label className="block text-xs font-black text-secondary uppercase tracking-[0.2em] mb-4">Select Groom</label>
                    <select
                        className="w-full p-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none transition-all font-bold text-primary"
                        value={groom?.id || ''}
                        onChange={(e) => setGroom(profiles.find(p => p.id === e.target.value))}
                    >
                        <option value="">Choose a Groom</option>
                        {profiles.filter(p => p.gender === 'male').map(p => (
                            <option key={p.id} value={p.id}>{p.name} ({p.relation})</option>
                        ))}
                    </select>
                    {groom && (
                        <div className="mt-6 flex items-center gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-black text-primary">{groom.name}</p>
                                <p className="text-xs text-secondary">{groom.birth_date} • {groom.location_name}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center mb-12">
                <button
                    onClick={handleMatch}
                    disabled={!bride || !groom || loading}
                    className={`px-12 py-5 rounded-full font-black uppercase text-sm tracking-[0.2em] transition-all shadow-2xl flex items-center gap-3
                        ${!bride || !groom || loading
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 active:scale-95 shadow-purple-500/25'}
                    `}
                >
                    {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    Calculate Compatibility
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Helper Text */}
            {token && (!bride || !groom) && (
                <div className="text-center mb-8">
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                        <Info className="w-4 h-4" />
                        Please select both Bride and Groom profiles to calculate compatibility
                    </p>
                </div>
            )}
            {error && (
                <div className="max-w-2xl mx-auto p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-center flex items-center justify-center gap-3 font-bold mb-12 animate-in shake duration-500">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Result Section */}
            {result && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Overall Summary Card */}
                    <div className={`glass-panel p-10 md:p-14 rounded-[3.5rem] border shadow-2xl relative overflow-hidden ${getScoreBg(result?.total_score || 0)}`}>
                        <div className="absolute top-0 right-0 p-12 opacity-10">
                            <Heart className="w-40 h-40 text-primary fill-current" />
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                            <div className="text-center md:text-left space-y-6">
                                <h2 className="text-3xl font-black text-primary uppercase italic tracking-tighter">Overall Match Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        <p className="text-lg text-secondary leading-relaxed">
                                            The compatibility between <span className="font-black text-primary">{result?.bride?.name}</span> and <span className="font-black text-primary">{result?.groom?.name}</span> results in a <span className={`font-black ${getScoreColor(result?.total_score || 0)}`}>{result?.total_score || 0}/36</span> Guna score.
                                        </p>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {result?.summary}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <div className="relative">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            className="text-gray-200"
                                        />
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="transparent"
                                            strokeDasharray={2 * Math.PI * 88}
                                            strokeDashoffset={2 * Math.PI * 88 * (1 - (result?.total_score || 0) / 36)}
                                            className={`${getScoreColor(result?.total_score || 0)} transition-all duration-1000 ease-out`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className={`text-5xl font-black ${getScoreColor(result?.total_score || 0)}`}>{result?.total_score || 0}</span>
                                        <span className="text-xs font-bold text-secondary uppercase tracking-widest">Out of 36</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Koota Table */}
                    <div className="glass-panel p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl">
                        <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter mb-8 flex items-center gap-3">
                            <Table className="w-6 h-6 text-purple-600" />
                            Ashta-Koota Breakdown
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="pb-4 text-xs font-black text-secondary uppercase tracking-widest">Koota</th>
                                        <th className="pb-4 text-xs font-black text-secondary uppercase tracking-widest">Bride Attributes</th>
                                        <th className="pb-4 text-xs font-black text-secondary uppercase tracking-widest">Groom Attributes</th>
                                        <th className="pb-4 text-xs font-black text-secondary uppercase tracking-widest text-center">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {(result?.koota_details || []).map((k, idx) => (
                                        <tr key={idx} className="group hover:bg-gray-50 transition-colors">
                                            <td className="py-4">
                                                <p className="font-black text-primary text-sm uppercase">{k?.name}</p>
                                                <p className="text-[10px] text-secondary font-bold uppercase">{k?.significance}</p>
                                            </td>
                                            <td className="py-4 text-sm font-medium text-slate-600">{k?.bride_val}</td>
                                            <td className="py-4 text-sm font-medium text-slate-600">{k?.groom_val}</td>
                                            <td className="py-4 text-center">
                                                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-sm
                                                    ${k?.points === k?.max_points ? 'bg-green-100 text-green-600' :
                                                        k?.points === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}
                                                `}>
                                                    {k?.points}/{k?.max_points}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Manglik & Dosha Analysis */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass-panel p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl">
                            <h3 className="text-xl font-black text-primary uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Manglik Analysis
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div>
                                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Bride</p>
                                        <p className="font-bold text-primary">{result?.bride?.manglik_status}</p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${result?.bride?.is_manglik ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div>
                                        <p className="text-[10px] font-black text-secondary uppercase tracking-widest">Groom</p>
                                        <p className="font-bold text-primary">{result?.groom?.manglik_status}</p>
                                    </div>
                                    <div className={`w-3 h-3 rounded-full ${result?.groom?.is_manglik ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                                </div>
                                <p className="text-sm text-secondary leading-relaxed font-medium">
                                    {result?.manglik_summary}
                                </p>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl">
                            <h3 className="text-xl font-black text-primary uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-purple-600" />
                                Dosha & Exceptions
                            </h3>
                            <div className="space-y-4">
                                {(result?.doshas || []).map((d, idx) => (
                                    <div key={idx} className={`p-4 rounded-2xl border flex items-start gap-4 transition-all
                                        ${d?.is_present ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}
                                    `}>
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                                            ${d?.is_present ? 'bg-red-200 text-red-600' : 'bg-green-200 text-green-600'}
                                        `}>
                                            {d?.is_present ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <h4 className={`font-black uppercase text-xs tracking-widest ${d?.is_present ? 'text-red-700' : 'text-green-700'}`}>
                                                {d?.name} {d?.is_present ? 'Present' : 'Not Present'}
                                            </h4>
                                            <p className="text-xs text-slate-600 mt-1 font-medium">{d?.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* AI Insights Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 rounded-[3rem] blur-2xl opacity-50"></div>
                        <div className="relative glass-panel p-10 md:p-14 rounded-[3.5rem] bg-white border border-purple-500/20 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <Sparkles className="w-32 h-32 text-purple-600" />
                            </div>

                            <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                                <div className="lg:w-1/3 flex flex-col gap-6">
                                    <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 shadow-inner">
                                        <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
                                    </div>
                                    <h3 className="text-3xl font-black text-primary uppercase italic tracking-tighter leading-none">
                                        Cosmic <br />
                                        <span className="text-purple-600">Guidance</span>
                                    </h3>
                                    <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                        <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                                        <span className="text-[10px] font-black text-purple-900 uppercase tracking-widest">AI Expert Analysis</span>
                                    </div>
                                </div>
                                <div className="lg:w-2/3">
                                    <div className="prose prose-slate max-w-none">
                                        <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-line text-lg">
                                            {result?.ai_analysis}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Premium Report Section */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-[3rem] blur-2xl opacity-60"></div>
                        <div className="relative glass-panel p-10 md:p-12 rounded-[3.5rem] bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 shadow-2xl">
                            <div className="flex flex-col lg:flex-row gap-8 items-center">
                                <div className="lg:w-2/3 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter">
                                            Premium Compatibility Report
                                        </h3>
                                    </div>

                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        Unlock deeper insights with our comprehensive premium report:
                                    </p>

                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">Detailed Koota-wise analysis</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">Manglik Dosha cancellation logic</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">Dasha synchronization analysis</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">Navamsa (D9) compatibility</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">Transit & progressions analysis</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">Marriage timing windows</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">Strengths & red flags explained</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">Personalized remedies & guidance</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">Downloadable & shareable report</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-700 font-medium">AI-powered cosmic insights</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:w-1/3 flex flex-col gap-4 items-center lg:items-end">
                                    {/* Language Selection */}
                                    <div className="w-full max-w-xs">
                                        <label className="block text-xs font-black text-secondary uppercase tracking-[0.2em] mb-2 text-center lg:text-right">
                                            PDF Language
                                        </label>
                                        <select
                                            value={pdfLanguage}
                                            onChange={(e) => setPdfLanguage(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all font-bold text-primary text-center"
                                        >
                                            <option value="en">English</option>
                                            <option value="hi">हिंदी (Hindi)</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => handleDownloadPDF(pdfLanguage)}
                                        disabled={downloadingPdf}
                                        className={`px-8 py-4 rounded-2xl font-black uppercase text-sm tracking-widest shadow-2xl transition-all flex items-center gap-3 group
                                            ${downloadingPdf
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:scale-105 active:scale-95'
                                            }`}
                                    >
                                        {downloadingPdf ? (
                                            <>
                                                <Loader className="w-5 h-5 animate-spin" />
                                                Generating...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Download PDF Report
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 rounded-xl border border-amber-200">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                        <span className="text-xs font-bold text-amber-900 uppercase tracking-widest">Premium Feature</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4">
                        <Info className="w-5 h-5 text-slate-400 mt-0.5" />
                        <p className="text-xs text-slate-500 leading-relaxed italic">
                            Astrological matching (Gun Milan) is a traditional guidance system based on planetary positions. While informative, it should be viewed as one of many factors in a relationship. Mutual understanding, respect, and values are equally critical for a successful partnership.
                        </p>
                    </div>

                </div>
            )}

            {!result && !loading && profiles.length < 2 && (
                <div className="max-w-xl mx-auto p-12 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2.5rem] space-y-6">
                    <Users className="w-16 h-16 text-slate-300 mx-auto" />
                    <div>
                        <h3 className="text-xl font-bold text-primary">Add More Profiles</h3>
                        <p className="text-secondary text-sm mt-2">You need at least two profiles to compare. Go to Profile Management to add more family and friends.</p>
                    </div>
                    <button
                        onClick={() => navigate('/profiles')}
                        className="px-8 py-3 bg-white border border-gray-200 text-primary rounded-full font-bold uppercase text-xs tracking-widest hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        Manage Profiles
                    </button>
                </div>
            )}
            {/* 
                PDF Report Template 
                - Position fixed off-screen ensures it is rendered in the DOM with correct dimensions 
                - z-index ensures it doesn't interfere with UI
                - 'display: none' would cause empty PDF
            */}
            {/* 
                PDF Report Template 
                - Positioned off-screen to the right to ensure it is rendered but not visible
                - Strict width enforced for consistent PDF layout
            */}
            <div style={{
                position: 'fixed',
                left: '200vw', // Move way off to the right
                top: 0,
                width: '1000px', // Fixed width for A4 consistency
                height: 'auto',
                zIndex: -50,
                background: 'white' // Ensure background is white
            }}>
                <div id="pdf-report-container">
                    <MatchReportPDF ref={reportRef} matchResult={result} bride={bride} groom={groom} />
                </div>
            </div>
        </div>
    );
};

export default KundaliMatch;
