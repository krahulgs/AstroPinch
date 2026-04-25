import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, Star, Heart, Briefcase, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';

const RashifalIndex = () => {
    const { period = 'daily' } = useParams();
    const [selectedPeriod, setSelectedPeriod] = useState(period);
    const { t } = useTranslation();

    const zodiacSigns = [
        { name: t('zodiac.signs.Aries'), id: 'aries', symbol: '♈', dates: 'Mar 21 - Apr 19', color: 'from-red-500 to-orange-500', element: t('zodiac.elements.Fire') },
        { name: t('zodiac.signs.Taurus'), id: 'taurus', symbol: '♉', dates: 'Apr 20 - May 20', color: 'from-green-500 to-emerald-500', element: t('zodiac.elements.Earth') },
        { name: t('zodiac.signs.Gemini'), id: 'gemini', symbol: '♊', dates: 'May 21 - Jun 20', color: 'from-yellow-400 to-amber-500', element: t('zodiac.elements.Air') },
        { name: t('zodiac.signs.Cancer'), id: 'cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', color: 'from-blue-400 to-indigo-500', element: t('zodiac.elements.Water') },
        { name: t('zodiac.signs.Leo'), id: 'leo', symbol: '♌', dates: 'Jul 23 - Aug 22', color: 'from-orange-500 to-red-600', element: t('zodiac.elements.Fire') },
        { name: t('zodiac.signs.Virgo'), id: 'virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', color: 'from-emerald-500 to-teal-600', element: t('zodiac.elements.Earth') },
        { name: t('zodiac.signs.Libra'), id: 'libra', symbol: '♎', dates: 'Sep 23 - Oct 22', color: 'from-pink-400 to-rose-500', element: t('zodiac.elements.Air') },
        { name: t('zodiac.signs.Scorpio'), id: 'scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', color: 'from-purple-600 to-indigo-700', element: t('zodiac.elements.Water') },
        { name: t('zodiac.signs.Sagittarius'), id: 'sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', color: 'from-amber-500 to-orange-600', element: t('zodiac.elements.Fire') },
        { name: t('zodiac.signs.Capricorn'), id: 'capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', color: 'from-slate-600 to-gray-700', element: t('zodiac.elements.Earth') },
        { name: t('zodiac.signs.Aquarius'), id: 'aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', color: 'from-cyan-500 to-blue-600', element: t('zodiac.elements.Air') },
        { name: t('zodiac.signs.Pisces'), id: 'pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', color: 'from-violet-500 to-purple-600', element: t('zodiac.elements.Water') }
    ];

    useEffect(() => {
        setSelectedPeriod(period);
    }, [period]);

    const title = selectedPeriod === 'weekly' ? 'Weekly Rashifal' : selectedPeriod === 'monthly' ? 'Monthly Rashifal' : 'Daily Rashifal';
    const description = selectedPeriod === 'weekly' 
        ? 'Discover your weekly horoscope for all 12 zodiac signs. Get insights into your career, love life, and health for the week ahead.'
        : selectedPeriod === 'monthly'
        ? 'Your monthly forecast for all 12 zodiac signs. Deep astrological insights for the month ahead.'
        : 'Check your daily rashifal for all 12 zodiac signs. Accurate Vedic predictions for love, career, and finance to guide your day.';

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <SEO 
                title={`${title} - Free Daily & Weekly Horoscope`} 
                description={description} 
                breadcrumbs={[
                    { name: 'Rashifal', path: '/rashifal' },
                    { name: title, path: `/rashifal/${selectedPeriod}` }
                ]}
            />
            
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-[10px] uppercase tracking-widest mb-4">
                        <Sparkles className="w-3 h-3" />
                        {t('rashifal.index.guidance')}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight">
                        {t(`rashifal.index.${selectedPeriod}`)}{' '}
                        <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">{t('rashifal.index.title')}</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-light">
                        {t('rashifal.index.description', { period: t(`rashifal.index.${selectedPeriod}`).toLowerCase() })}
                    </p>

                    {/* Period Selector */}
                    <div className="flex justify-center mt-10">
                        <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <Link
                                to="/rashifal/daily"
                                className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                    selectedPeriod === 'daily' 
                                    ? 'bg-indigo-600 text-white shadow-lg' 
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {t('rashifal.index.daily')}
                            </Link>
                            <Link
                                to="/rashifal/weekly"
                                className={`px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                                    selectedPeriod === 'weekly' 
                                    ? 'bg-indigo-600 text-white shadow-lg' 
                                    : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                {t('rashifal.index.weekly')}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {zodiacSigns.map((sign) => (
                        <Link 
                            key={sign.name} 
                            to={`/rashifal/${selectedPeriod}/${sign.id}`}
                            className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col items-center text-center"
                        >
                            {/* Background Glow */}
                            <div className={`absolute -right-20 -top-20 w-48 h-48 bg-gradient-to-br ${sign.color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500`}></div>
                            
                            {/* Symbol */}
                            <div className="relative mb-6">
                                <div className={`absolute inset-0 bg-gradient-to-br ${sign.color} opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700`}></div>
                                <span className="relative text-7xl block filter drop-shadow-sm group-hover:scale-110 transition-transform duration-500 group-hover:rotate-12">
                                    {sign.symbol}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="space-y-2 relative z-10">
                                <h3 className="text-2xl font-serif font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{sign.name}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">{sign.dates}</p>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${sign.color}`}></div>
                                    {sign.element} {t('nav.zodiac_signs').slice(0, -1)}
                                </div>
                            </div>

                            {/* Preview (Static for now, but looks premium) */}
                            <div className="mt-8 pt-8 border-t border-slate-50 w-full grid grid-cols-3 gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                <div className="flex flex-col items-center gap-1">
                                    <Heart className="w-4 h-4 text-rose-400" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Love</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <Briefcase className="w-4 h-4 text-indigo-400" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Career</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <Activity className="w-4 h-4 text-emerald-400" />
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Health</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className="mt-8 flex items-center justify-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                {t('rashifal.index.view_details')} <ArrowRight className="w-4 h-4" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Additional Info Section */}
                <div className="mt-32 grid md:grid-cols-2 gap-12 items-center bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                    
                    <div className="space-y-8 relative z-10">
                        <h2 className="text-4xl font-serif text-slate-900 leading-tight">
                            {t('rashifal.index.why_trust')} <br />
                            <span className="italic text-indigo-600">{t('rashifal.index.celestial_forecasts')}</span>
                        </h2>
                        <p className="text-slate-600 leading-relaxed font-light">
                            {t('rashifal.index.trust_desc', { period: t(`rashifal.index.${selectedPeriod}`).toLowerCase() })}
                        </p>
                         <div className="space-y-4">
                            {[
                                { icon: Star, text: t('rashifal.index.nasa_powered') },
                                { icon: Calendar, text: t('rashifal.index.mapping') },
                                { icon: Sparkles, text: t('rashifal.index.ai_enhanced') }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                        <item.icon className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] opacity-5 group-hover:opacity-10 transition-opacity duration-700"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?auto=format&fit=crop&q=80&w=1000" 
                            alt="Cosmic sky" 
                            className="rounded-[2rem] shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700 h-[400px] w-full object-cover"
                        />
                        <div className="absolute inset-0 border border-white/20 rounded-[2rem]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RashifalIndex;
