FILE = "c:/Users/rahul/Desktop/Antigravity/AstroPinch/src/pages/ConsolidatedReport.jsx"

with open(FILE, "r", encoding="utf-8") as f:
    content = f.read()

# ── Find start and end markers ──────────────────────────────────────────────
START = "{/* NUMEROLOGY TAB */}"
END   = "{/* LOCATIONAL TAB */}"

si = content.find(START)
ei = content.find(END)

if si == -1 or ei == -1:
    print("ERROR: markers not found")
    exit(1)

NEW_NUMEROLOGY = r"""{/* NUMEROLOGY TAB */}
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
                                                            const rawText = report.numerology?.ai_insights || report.predictions_summary?.best_prediction || "";
                                                            if (!rawText) return null;
                                                            const sections = rawText.split(/(?=\d\.\s)/).filter(s => s.trim());
                                                            if (sections.length <= 1) {
                                                                return (<p className="md:col-span-2 text-base md:text-lg text-slate-600 font-medium italic opacity-90">"{rawText}"</p>);
                                                            }
                                                            const firstSection = sections[0].replace(/^\d\.\s+/, "");
                                                            const hasIntro = firstSection.length < 150 && !firstSection.includes(':') && !firstSection.includes('**');
                                                            const introText = hasIntro ? firstSection : null;
                                                            const insightSections = hasIntro ? sections.slice(1) : sections;
                                                            return (
                                                                <>
                                                                    {introText && (
                                                                        <div className="md:col-span-2 p-6 md:p-8 rounded-3xl bg-violet-50 border-l-4 border-violet-400 mb-2">
                                                                            <p className="text-base md:text-lg text-slate-700 font-medium italic opacity-90 leading-relaxed">"{introText.replace(/\*\*/g, '')}"</p>
                                                                        </div>
                                                                    )}
                                                                    {insightSections.map((section, idx) => {
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
                                                                    })}
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

"""

# Replace the numerology section
new_content = content[:si] + NEW_NUMEROLOGY + content[ei:]

with open(FILE, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Done! Light modern numerology theme applied.")
