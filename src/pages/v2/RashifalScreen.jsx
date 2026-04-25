import React, { useState } from 'react';
import Layout from '../../components/v2/Layout';
import { Card, SectionHeader, Badge } from '../../components/v2/UI';
import { Share2, Zap, Heart, Briefcase, Pill } from 'lucide-react';

const RashifalScreen = () => {
  const [selectedRashi, setSelectedRashi] = useState('Mesh');
  const [period, setPeriod] = useState('Today');

  const rashis = [
    { id: 'Mesh', name: 'मेष', en: 'Aries', color: '#EF4444' },
    { id: 'Vrishabh', name: 'वृषभ', en: 'Taurus', color: '#10B981' },
    { id: 'Mithun', name: 'मिथुन', en: 'Gemini', color: '#F59E0B' },
    { id: 'Kark', name: 'कर्क', en: 'Cancer', color: '#3B82F6' },
  ];

  return (
    <Layout activeTab="horoscope">
      <div className="px-4 pt-6">
        <h1 className="mb-6">Daily Rashifal</h1>

        {/* Rashi Selector Scroll */}
        <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 -mx-4 px-4 pb-2">
          {rashis.map((r) => (
            <button 
              key={r.id}
              onClick={() => setSelectedRashi(r.id)}
              className={`flex flex-col items-center gap-2 shrink-0 transition-all
                ${selectedRashi === r.id ? 'scale-110' : 'opacity-40 grayscale'}`}
            >
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2"
                style={{ backgroundColor: `${r.color}10`, borderColor: selectedRashi === r.id ? r.color : 'transparent' }}
              >
                {r.id === 'Mesh' ? '♈' : r.id === 'Vrishabh' ? '♉' : r.id === 'Mithun' ? '♊' : '♋'}
              </div>
              <div className="text-center">
                <span className="font-hindi text-xs block">{r.name}</span>
                <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-wider">{r.en}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Time Selector Chips */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {['Today', 'Tomorrow', 'This Week', 'This Month'].map((t) => (
            <button 
              key={t}
              onClick={() => setPeriod(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap border transition-all
                ${period === t ? 'bg-[var(--secondary)] border-[var(--secondary)] text-white shadow-md' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-sub)]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Main Horoscope Card */}
        <Card className="border-l-4 border-l-red-500 mb-8 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
             <h2 className="text-[var(--text-main)]">Daily Projection</h2>
             <button className="text-[var(--primary)]"><Share2 size={18} /></button>
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--text-main)] mb-6">
            Mars, your ruling planet, is positioned strongly today. This brings a surge of energy to your professional life. Avoid impulsive decisions in personal relationships. A favorable day for physical activities and clearing pending tasks.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"><Heart size={16} /></div>
              <div>
                <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block">Love</span>
                <span className="text-sm font-bold">Excellent</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><Briefcase size={16} /></div>
              <div>
                <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block">Career</span>
                <span className="text-sm font-bold">Stable</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Lucky Indicators */}
        <div className="grid grid-cols-3 gap-2 mb-8">
           <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] text-center">
              <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Lucky No</span>
              <span className="text-sm font-black text-[var(--secondary)]">9</span>
           </div>
           <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] text-center">
              <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Lucky Color</span>
              <span className="text-sm font-black text-red-500">Red</span>
           </div>
           <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] text-center">
              <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Direction</span>
              <span className="text-sm font-black text-[var(--primary)]">East</span>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default RashifalScreen;
