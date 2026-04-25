import React from 'react';
import Layout from '../../components/v2/Layout';
import { Card, SectionHeader, Badge } from '../../components/v2/UI';
import { MapPin, Sun, Moon, Zap, Star, ShieldAlert, Timer } from 'lucide-react';

const PanchangCard = ({ title, value, sub, icon: Icon, color = 'var(--primary)' }) => (
  <Card className="flex flex-col gap-2 relative overflow-hidden">
    <div className={`absolute -right-4 -top-4 w-16 h-16 opacity-5 flex items-center justify-center`}>
      <Icon size={48} />
    </div>
    <div className="flex items-center gap-2 mb-1">
      <Icon size={14} style={{ color }} />
      <span className="text-[10px] font-black text-[var(--text-sub)] uppercase tracking-widest">{title}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-base font-black text-[var(--text-main)]">{value}</span>
      <span className="text-[10px] font-bold text-[var(--text-sub)] mt-0.5">{sub}</span>
    </div>
  </Card>
);

const PanchangScreen = () => {
  return (
    <Layout activeTab="horoscope">
      <div className="px-4 pt-6 pb-8">
        {/* Header with Location */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-xl mb-1">Panchang Today</h1>
            <div className="flex items-center gap-1.5 text-[var(--text-sub)]">
              <MapPin size={12} />
              <span className="text-xs font-bold uppercase tracking-wider">New Delhi, India</span>
            </div>
          </div>
          <div className="text-right">
             <span className="text-xs font-black text-[var(--secondary)] block">Vikram Samvat 2081</span>
             <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase">Chaitra • Shukla Paksha</span>
          </div>
        </div>

        {/* Sunrise/Sunset Strip */}
        <div className="grid grid-cols-2 gap-3 mb-8">
           <div className="bg-orange-50 border border-orange-100 p-3 rounded-2xl flex items-center gap-3">
              <Sun className="text-orange-500" size={18} />
              <div>
                 <span className="text-[10px] font-bold text-orange-800 uppercase block">Sunrise</span>
                 <span className="text-sm font-black text-orange-900">06:12 AM</span>
              </div>
           </div>
           <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl flex items-center gap-3">
              <Moon className="text-blue-500" size={18} />
              <div>
                 <span className="text-[10px] font-bold text-blue-800 uppercase block">Sunset</span>
                 <span className="text-sm font-black text-blue-900">06:48 PM</span>
              </div>
           </div>
        </div>

        {/* 5 Key Elements */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <PanchangCard title="Tithi" value="Purnima" sub="Full Moon" icon={Moon} color="#3B82F6" />
          <PanchangCard title="Nakshatra" value="Chitra" sub="Spiritual" icon={Star} color="#8A7ACC" />
          <PanchangCard title="Yoga" value="Vyaghata" sub="Intense" icon={Zap} color="#EF4444" />
          <PanchangCard title="Karana" value="Bava" sub="Growing" icon={Zap} color="#10B981" />
        </div>

        {/* Rahu Kaal (Caution) */}
        <SectionHeader title="Inauspicious Timing" hindiTitle="राहु काल" />
        <Card className="bg-rose-50 border-rose-100 flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                 <ShieldAlert size={24} />
              </div>
              <div>
                 <h3 className="text-rose-900">Rahu Kaal</h3>
                 <p className="text-xs font-bold text-rose-800/60 uppercase">09:15 AM - 10:45 AM</p>
              </div>
           </div>
           <div className="text-right">
              <div className="flex items-center gap-1.5 text-rose-600 mb-1 justify-end">
                 <Timer size={14} className="animate-pulse" />
                 <span className="text-[10px] font-black uppercase">Starts in</span>
              </div>
              <span className="text-sm font-black text-rose-900">2h 15m</span>
           </div>
        </Card>

        {/* Auspicious Timeline */}
        <SectionHeader title="Auspicious Muhurats" hindiTitle="शुभ मुहूर्त" />
        <div className="space-y-3">
           <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                 <h3 className="text-emerald-900 text-sm">Abhijit Muhurat</h3>
                 <span className="text-[10px] font-bold text-emerald-800/60 uppercase">Best for all activities</span>
              </div>
              <span className="text-xs font-black text-emerald-700">11:45 AM - 12:35 PM</span>
           </div>
           <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                 <h3 className="text-emerald-900 text-sm">Amrit Kaal</h3>
                 <span className="text-[10px] font-bold text-emerald-800/60 uppercase">Best for travel</span>
              </div>
              <span className="text-xs font-black text-emerald-700">03:20 PM - 04:50 PM</span>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default PanchangScreen;
