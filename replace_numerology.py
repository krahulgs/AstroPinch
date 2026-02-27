import re

with open("c:/Users/rahul/Desktop/Antigravity/AstroPinch/src/pages/ConsolidatedReport.jsx", "r", encoding="utf-8") as f:
    content = f.read()

start_marker = "{/* NUMEROLOGY TAB */}"
end_marker = "{/* LOCATIONAL TAB */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Markers not found!")
    exit(1)

numerology_content = content[start_idx:end_idx]

replacements = [
    # 1. Update wrapper and AI Synthesis header
    ("""<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">""",
     """<div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#070B14] p-4 md:p-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_150px_rgba(79,70,229,0.15)] text-white">
                                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px]"></div>
                                        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                                        <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[100px]"></div>
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] mix-blend-overlay"></div>
                                    </div>
                                    <div className="relative z-10 space-y-16">"""
    ),
    # 2. Fix the AI wrapper inner container to remove double dark padding since parent is now dark
    ("""<div className="p-6 md:p-10 rounded-[3rem] bg-slate-950 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10 opacity-50"></div>""",
     """<div className="p-6 md:p-10 rounded-[3rem] bg-white/5 backdrop-blur-3xl text-white shadow-2xl relative overflow-hidden group border border-white/10">"""
    ),
    # 3. Text color fixes in Core Numbers - Header
    ("""<h3 className="text-xl md:text-2xl font-black text-indigo-950 uppercase italic tracking-tighter">{t('numerology_page.core_numbers_title')}</h3>""",
     """<h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">{t('numerology_page.core_numbers_title')}</h3>"""
    ),
    # Core numbers icons fix for dark mode
    ("""<div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                                                    <Activity className="w-6 h-6 text-pink-600" />
                                                </div>""",
"""<div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                                                    <Activity className="w-6 h-6 text-pink-400 drop-shadow-md" />
                                                </div>"""
    ),
    # Core numbers map mapping
    ("""].map((item, idx) => {
                                                    const analysis = report.numerology?.detailed_analysis?.[item.key] || {};
                                                    return (
                                                        <div key={idx} className={`${item.bg} p-8 rounded-[2.5rem] border ${item.border} hover:shadow-xl transition-all group relative overflow-hidden`}>
                                                            <div className="flex justify-between items-start mb-6">
                                                                <div>
                                                                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-600 group-hover:text-indigo-900 transition-colors">{item.label}</h4>
                                                                    <p className="text-xs font-bold text-slate-500 italic mt-0.5">{item.subtitle}</p>
                                                                </div>
                                                                <div className={`text-4xl md:text-5xl font-black ${item.color} leading-none drop-shadow-sm`}>{item.value}</div>
                                                            </div>

                                                            <div className="space-y-4 relative z-10">
                                                                <p className="text-sm text-indigo-950 leading-relaxed font-bold">
                                                                    {analysis.text || `Your vibration ${item.value} influences your journey and unique approach to life's challenges.`}
                                                                </p>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                                                    <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-white/50">
                                                                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 block mb-1">{t('numerology_page.strength')}</span>
                                                                        <p className="text-xs text-indigo-900/80 font-bold">{analysis.strength || "Inherent natural talent"}</p>
                                                                    </div>
                                                                    <div className="bg-white/60 backdrop-blur-sm p-3 rounded-2xl border border-white/50">
                                                                        <span className="text-xs font-black uppercase tracking-widest text-amber-600 block mb-1">{t('numerology_page.caution')}</span>
                                                                        <p className="text-xs text-indigo-900/80 font-bold">{analysis.caution || "Potential area for growth"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })""",
     """].map((item, idx) => {
                                                    const analysis = report.numerology?.detailed_analysis?.[item.key] || {};
                                                    return (
                                                        <div key={idx} className={`relative p-8 rounded-[2.5rem] border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-3xl transition-all duration-500 group overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)]`}>
                                                            <div className={`absolute -inset-10 bg-gradient-to-br ${item.color.replace('text-', 'from-').replace('-600', '-500/20')} to-transparent rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen`}></div>
                                                            <div className="flex justify-between items-start mb-6 relative z-10">
                                                                <div>
                                                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">{item.label}</h4>
                                                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">{item.subtitle}</p>
                                                                </div>
                                                                <div className={`text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-500 origin-right`}>{item.value}</div>
                                                            </div>

                                                            <div className="space-y-4 relative z-10">
                                                                <p className="text-sm text-white/80 leading-relaxed font-bold">
                                                                    {analysis.text || `Your vibration ${item.value} influences your journey and unique approach to life's challenges.`}
                                                                </p>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                                                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 relative overflow-hidden group/sub">
                                                                        <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover/sub:opacity-100 transition-opacity"></div>
                                                                        <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1 drop-shadow-sm">{t('numerology_page.strength')}</span>
                                                                        <p className="relative z-10 text-xs text-white/90 font-bold">{analysis.strength || "Inherent natural talent"}</p>
                                                                    </div>
                                                                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 relative overflow-hidden group/sub">
                                                                        <div className="absolute inset-0 bg-rose-500/10 opacity-0 group-hover/sub:opacity-100 transition-opacity"></div>
                                                                        <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-rose-400 block mb-1 drop-shadow-sm">{t('numerology_page.caution')}</span>
                                                                        <p className="relative z-10 text-xs text-white/90 font-bold">{analysis.caution || "Potential area for growth"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })"""
    ),
    # 4. Birthday Number and Maturity Card text colors
    ("""<span className="text-xs font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                                                        <span className={`text-lg md:text-xl font-black ${item.color}`}>{item.value}</span>""",
     """<span className="text-xs font-black uppercase tracking-widest text-white/60">{item.label}</span>
                                                        <span className={`text-lg md:text-xl font-black text-white drop-shadow-md`}>{item.value}</span>"""
    ),
    ("""className={`${item.bg} px-6 py-4 rounded-2xl border border-transparent flex items-center justify-between`}>""",
     """className={`bg-white/5 px-6 py-4 rounded-[2rem] border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors shadow-inner`}>"""
    ),
    # 5. Temporal Cycles Title and icons
    ("""<div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                                    <Clock className="w-6 h-6 text-indigo-600" />
                                                </div>""",
    """<div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                                    <Clock className="w-6 h-6 text-indigo-400 drop-shadow-md" />
                                                </div>"""
    ),
    ("""<h3 className="text-xl md:text-2xl font-black text-indigo-950 uppercase italic tracking-tighter">{t('numerology_page.personal_cycles.title')}</h3>
                                                    <p className="text-xs font-bold text-slate-500 -mt-1 uppercase tracking-widest">{t('numerology_page.personal_cycles.subtitle')}</p>""",
     """<h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">{t('numerology_page.personal_cycles.title')}</h3>
                                                    <p className="text-xs font-bold text-white/50 -mt-1 uppercase tracking-widest">{t('numerology_page.personal_cycles.subtitle')}</p>"""
    ),
    # Personal Cycle Cards Wrapper
    ("""<div key={idx} className={`${cycle.bg} border border-white/50 rounded-[3rem] p-1 shadow-sm overflow-hidden group`}>
                                                        <div className={`bg-gradient-to-br ${cycle.color} p-8 rounded-[2.8rem] text-white shadow-lg relative overflow-hidden`}>""",
     """<div key={idx} className={`bg-white/5 border border-white/10 rounded-[3rem] p-1 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden group group-hover:bg-white/10 transition-all`}>
                                                        <div className={`bg-gradient-to-br ${cycle.color} opacity-90 p-8 rounded-[2.8rem] text-white shadow-2xl relative overflow-hidden backdrop-blur-3xl`}>"""
    ),
    # Personal Cycle Cards Text fixes in lower half
    ("""<div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50 group/item hover:bg-emerald-50 transition-colors">""",
     """<div className="flex items-start gap-4 p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 group/item hover:bg-emerald-500/20 shadow-inner transition-colors">"""
    ),
    ("""<p className="text-xs text-indigo-900/80 font-bold leading-relaxed">{cycle.analysis?.start || "Begin new ventures that align with your purpose."}</p>""",
     """<p className="text-xs text-emerald-100 font-bold leading-relaxed">{cycle.analysis?.start || "Begin new ventures that align with your purpose."}</p>"""
    ),
    ("""<span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">{t('numerology_page.personal_cycles.what_to_start')}</span>""",
     """<span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-1 drop-shadow-sm">{t('numerology_page.personal_cycles.what_to_start')}</span>"""
    ),
    
    ("""<div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50 group/item hover:bg-blue-50 transition-colors">""",
     """<div className="flex items-start gap-4 p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 group/item hover:bg-blue-500/20 shadow-inner transition-colors">"""
    ),
    ("""<p className="text-xs text-indigo-900/80 font-bold leading-relaxed">{cycle.analysis?.focus || "Maintain discipline and awareness in your daily tasks."}</p>""",
     """<p className="text-xs text-blue-100 font-bold leading-relaxed">{cycle.analysis?.focus || "Maintain discipline and awareness in your daily tasks."}</p>"""
    ),
    ("""<span className="text-[10px] font-black uppercase tracking-widest text-blue-600 block mb-1">{t('numerology_page.personal_cycles.focus_on')}</span>""",
     """<span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1 drop-shadow-sm">{t('numerology_page.personal_cycles.focus_on')}</span>"""
    ),

    ("""<div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50 group/item hover:bg-rose-50 transition-colors">""",
     """<div className="flex items-start gap-4 p-5 rounded-3xl bg-rose-500/10 border border-rose-500/20 group/item hover:bg-rose-500/20 shadow-inner transition-colors">"""
    ),
    ("""<p className="text-xs text-indigo-900/80 font-bold leading-relaxed">{cycle.analysis?.avoid || "Steer clear of impulsive decisions and unnecessary conflict."}</p>""",
     """<p className="text-xs text-rose-100 font-bold leading-relaxed">{cycle.analysis?.avoid || "Steer clear of impulsive decisions and unnecessary conflict."}</p>"""
    ),
    ("""<span className="text-[10px] font-black uppercase tracking-widest text-rose-600 block mb-1">{t('numerology_page.personal_cycles.avoid')}</span>""",
     """<span className="text-[10px] font-black uppercase tracking-widest text-rose-400 block mb-1 drop-shadow-sm">{t('numerology_page.personal_cycles.avoid')}</span>"""
    ),
    
    # 6. Career Money Inner Fix
    ("""<div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                                    <Briefcase className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-xl md:text-2xl font-black text-primary uppercase italic tracking-tighter">{t('numerology_page.career_money.title')}</h3>
                                                    <p className="text-xs font-bold text-slate-400 -mt-1 uppercase tracking-widest">{t('numerology_page.career_money.subtitle')}</p>
                                                </div>
                                            </div>""",
     """<div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                                    <Briefcase className="w-6 h-6 text-emerald-400 drop-shadow-md" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">{t('numerology_page.career_money.title')}</h3>
                                                    <p className="text-xs font-bold text-white/50 -mt-1 uppercase tracking-widest">{t('numerology_page.career_money.subtitle')}</p>
                                                </div>
                                            </div>"""
    ),
    ("""<div className="glass-panel p-8 md:p-12 rounded-[3.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden shadow-2xl border border-slate-700/50">""",
     """<div className="p-8 md:p-12 rounded-[3.5rem] bg-white/5 backdrop-blur-3xl text-white relative overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] border border-white/10 group">
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 group-hover:opacity-100 opacity-50 transition-opacity duration-1000 pointer-events-none mix-blend-screen"></div>"""
    ),
    
    # Career Money Grid Text Fix
    ("""<h5 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{t('numerology_page.career_money.prime_timing')}</h5>""",
     """<h5 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">{t('numerology_page.career_money.prime_timing')}</h5>"""
    ),

    # 7. Name Insights Title
    ("""<div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                                                    <Mic2 className="w-6 h-6 text-violet-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-xl md:text-2xl font-black text-primary uppercase italic tracking-tighter">{t('numerology_page.name_insights.title')}</h3>
                                                    <p className="text-xs font-bold text-slate-400 -mt-1 uppercase tracking-widest">{t('numerology_page.name_insights.subtitle')}</p>
                                                </div>
                                            </div>""",
     """<div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                                    <Mic2 className="w-6 h-6 text-violet-400 drop-shadow-md" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">{t('numerology_page.name_insights.title')}</h3>
                                                    <p className="text-xs font-bold text-white/50 -mt-1 uppercase tracking-widest">{t('numerology_page.name_insights.subtitle')}</p>
                                                </div>
                                            </div>"""
    ),
    # 8. Support Matrix Card in Name Insights
    ("""<div className="md:col-span-2 glass-panel p-8 rounded-[3rem] bg-white border border-gray-100 shadow-xl flex flex-col justify-between">""",
     """<div className="md:col-span-2 bg-white/5 backdrop-blur-3xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-between relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent pointer-events-none mix-blend-screen"></div>"""
    ),
    ("""].map((item, idx) => (
                                                            <div key={idx} className={`${item.bg} p-6 rounded-3xl border border-transparent hover:border-white hover:shadow-md transition-all`}>
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <item.icon className={`w-4 h-4 ${item.color}`} />
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                                                                </div>
                                                                <p className="text-sm font-bold text-slate-700 leading-snug">{item.value || "Calculating support energy..."}</p>
                                                            </div>
                                                        ))""",
     """].map((item, idx) => (
                                                            <div key={idx} className={`bg-white/5 p-6 rounded-[2rem] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all shadow-inner relative z-10 hover:-translate-y-1`}>
                                                                <div className="flex items-center gap-3 mb-4">
                                                                    <div className={`p-2 rounded-xl border border-white/10 ${item.bg.replace('-50', '-500/20')}`}>
                                                                        <item.icon className={`w-4 h-4 ${item.color.replace('text-', 'text-').replace('-600', '-400')} drop-shadow-sm`} />
                                                                    </div>
                                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{item.label}</span>
                                                                </div>
                                                                <p className="text-sm md:text-base font-bold text-white/90 leading-snug">{item.value || "Calculating support energy..."}</p>
                                                            </div>
                                                        ))"""
    ),
    ("""<div className="mt-8 p-6 bg-violet-50 rounded-3xl border border-violet-100 relative overflow-hidden group">
                                                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                                                            <Sparkles className="w-12 h-12 text-violet-600" />
                                                        </div>
                                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-violet-500 mb-2">{t('numerology_page.name_insights.simple_suggestion')}</h5>
                                                        <p className="text-sm text-indigo-900 font-bold italic relative z-10 leading-relaxed">""",
     """<div className="mt-8 p-6 lg:p-8 bg-violet-500/10 rounded-3xl border border-violet-500/20 relative overflow-hidden group hover:bg-violet-500/20 transition-colors z-10 shadow-inner">
                                                        <div className="absolute right-0 -top-4 p-4 opacity-20 group-hover:rotate-12 transition-transform blur-sm group-hover:blur-none duration-500 pointer-events-none">
                                                            <Sparkles className="w-24 h-24 text-violet-400 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
                                                        </div>
                                                        <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-300 mb-2 drop-shadow-sm">{t('numerology_page.name_insights.simple_suggestion')}</h5>
                                                        <p className="text-base text-violet-50 font-medium italic relative z-10 leading-relaxed">"""
    ),
    
    # Lucky Elements Target wrapper
    ("""<h3 className="text-xl md:text-2xl font-black text-indigo-950 uppercase italic tracking-tighter">{t('numerology_page.lucky_elements.title')}</h3>
                                                    <p className="text-xs font-bold text-slate-500 -mt-1 uppercase tracking-widest">{t('numerology_page.lucky_elements.subtitle')}</p>""",
     """<h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter drop-shadow-md">{t('numerology_page.lucky_elements.title')}</h3>
                                                    <p className="text-xs font-bold text-white/50 -mt-1 uppercase tracking-widest">{t('numerology_page.lucky_elements.subtitle')}</p>"""
    ),
    # Lucky Elements icons
    ("""<div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                                    <Sparkles className="w-6 h-6 text-amber-600" />
                                                </div>""",
     """<div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                                    <Sparkles className="w-6 h-6 text-amber-400 drop-shadow-md" />
                                                </div>"""
    ),
    # Lucky Elements Cards
    ("""].map((item, idx) => (
                                                    <div key={idx} className={`${item.bg} p-6 rounded-[2.5rem] border border-white/50 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all`}>
                                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                                            <item.icon className={`w-6 h-6 ${item.color}`} />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">{item.label}</span>
                                                        <p className="text-sm font-black text-indigo-950 leading-snug">{item.value || "Calculating..."}</p>
                                                    </div>
                                                ))""",
     """].map((item, idx) => (
                                                    <div key={idx} className={`bg-white/5 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] flex flex-col items-center text-center group hover:-translate-y-2 hover:bg-white/10 transition-all duration-500 relative overflow-hidden`}>
                                                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-screen pointer-events-none"></div>
                                                        <div className={`w-14 h-14 rounded-3xl ${item.bg.replace('-50', '-500/20')} flex items-center justify-center border border-white/5 mb-4 group-hover:scale-110 transition-transform shadow-inner relative z-10`}>
                                                            <item.icon className={`w-6 h-6 ${item.color.replace('text-', 'text-').replace('-600', '-400')} drop-shadow-md`} />
                                                        </div>
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2 relative z-10">{item.label}</span>
                                                        <p className="text-base font-black text-white leading-snug drop-shadow-lg relative z-10">{item.value || "Calculating..."}</p>
                                                    </div>
                                                ))"""
    ),
    
    # Gemstone card text colors
    ("""<div className="flex items-center gap-6 relative z-10">
                                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                                        <Star className="w-8 h-8 text-white animate-pulse" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black uppercase tracking-widest text-amber-100 mb-1">{t('numerology_page.lucky_elements.recommended_gemstone')}</h4>
                                                        <p className="text-2xl font-black tracking-tight">{report.numerology?.lucky_elements?.gemstone || "Loading..."}</p>
                                                    </div>""",
     """<div className="flex items-center gap-6 relative z-10">
                                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                                        <Star className="w-8 h-8 text-white animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-100/70 mb-1 drop-shadow-sm">{t('numerology_page.lucky_elements.recommended_gemstone')}</h4>
                                                        <p className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-2xl">{report.numerology?.lucky_elements?.gemstone || "Loading..."}</p>
                                                    </div>"""
    ),
    
    # AI Deep Dive - change to dark mode compatible glass panel
    ("""<div className="glass-panel p-8 md:p-12 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-10 opacity-5">
                                                    <Brain className="w-48 h-48 text-primary" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-4 mb-8">
                                                        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center">
                                                            <Scroll className="w-8 h-8 text-primary" />
                                                        </div>
                                                        <h3 className="text-2xl md:text-3xl font-black text-primary uppercase italic tracking-tighter">{t('numerology_page.ai_deep_dive.title')}</h3>
                                                    </div>
                                                    <div className="prose prose-slate max-w-none">
                                                        {report.numerology.ai_insights.split('\\n\\n').map((para, idx) => (
                                                            <p key={idx} className="text-slate-600 text-lg leading-relaxed mb-6 last:mb-0">
                                                                {para.startsWith('**') ? (
                                                                    <strong className="text-primary block mb-2">{para.replace(/\\*\\*/g, '')}</strong>
                                                                ) : para}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>""",
     """<div className="bg-white/5 backdrop-blur-3xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none mix-blend-screen"></div>
                                                <div className="absolute -top-32 -right-32 p-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000 pointer-events-none mix-blend-screen shadow-2xl">
                                                    <Brain className="w-96 h-96 text-white" />
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                                                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center drop-shadow-xl shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                                            <Scroll className="w-8 h-8 text-indigo-400 drop-shadow-md" />
                                                        </div>
                                                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter drop-shadow-lg">{t('numerology_page.ai_deep_dive.title')}</h3>
                                                    </div>
                                                    <div className="prose prose-invert max-w-none">
                                                        {report.numerology.ai_insights.split('\\n\\n').map((para, idx) => (
                                                            <p key={idx} className="text-white/80 text-[1.1rem] leading-loose mb-6 last:mb-0 font-medium tracking-wide">
                                                                {para.startsWith('**') ? (
                                                                    <strong className="text-indigo-300 block mb-2 text-xl font-black uppercase tracking-wide drop-shadow-md">{para.replace(/\\*\\*/g, '')}</strong>
                                                                ) : para}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>"""
    ),
    # Ensure closing divs match
    ("""</div>
                                </div>
                            )
                        }


                        {/* LOCATIONAL TAB */}""",
     """</div></div>
                                </div>
                            )
                        }


                        {/* LOCATIONAL TAB */}"""
    ) # To close the new mega wrapper `div`
]

for i, (orig, repl) in enumerate(replacements):
    if orig not in numerology_content:
        print(f"FAILED TO FIND REPLACEMENT {i}:\n{orig[:100]}...")
    numerology_content = numerology_content.replace(orig, repl)

final_content = content[:start_idx] + numerology_content + content[end_idx:]

with open("c:/Users/rahul/Desktop/Antigravity/AstroPinch/src/pages/ConsolidatedReport.jsx", "w", encoding="utf-8") as f:
    f.write(final_content)

print("Numerology CSS update done!")
