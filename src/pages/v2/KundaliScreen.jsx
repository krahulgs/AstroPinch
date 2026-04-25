import React, { useState } from 'react';
import Layout from '../../components/v2/Layout';
import { Card, SectionHeader, Button } from '../../components/v2/UI';
import { Share2, Download, ChevronRight, Activity } from 'lucide-react';

const KundaliScreen = () => {
  const [chartStyle, setChartStyle] = useState('North');

  return (
    <Layout activeTab="kundali">
      <div className="px-4 pt-6 pb-4">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl">My Kundali</h1>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-main)]">
              <Share2 size={18} />
            </button>
            <button className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-main)]">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Chart Style Toggle */}
        <div className="flex bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)] mb-6 shadow-sm">
          <button 
            onClick={() => setChartStyle('North')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all
              ${chartStyle === 'North' ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text-sub)]'}`}
          >
            North Indian
          </button>
          <button 
            onClick={() => setChartStyle('South')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all
              ${chartStyle === 'South' ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--text-sub)]'}`}
          >
            South Indian
          </button>
        </div>

        {/* SVG Chart Placeholder (Stylized) */}
        <Card className="aspect-square flex items-center justify-center border-2 border-[var(--primary)]/10 bg-white mb-6 relative overflow-hidden">
          {/* Faux Chart Lines */}
          <div className="absolute inset-4 border border-[var(--primary)]/40 rotate-45"></div>
          <div className="absolute inset-4 border border-[var(--primary)]/40 -rotate-45"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 border-2 border-[var(--secondary)]/30 rounded-full flex items-center justify-center">
                <span className="text-[var(--primary)] font-bold text-lg">Lagna</span>
             </div>
          </div>
          {/* Faux Planets */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 text-[var(--text-main)] font-bold text-xs">Su · Me</div>
          <div className="absolute bottom-12 right-12 text-[var(--text-main)] font-bold text-xs">Ju (R)</div>
          <div className="absolute top-1/2 left-8 -translate-y-1/2 text-[var(--text-main)] font-bold text-xs">Ma</div>
        </Card>

        {/* Primary Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] text-center shadow-sm">
            <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Rashi</span>
            <span className="text-sm font-black text-[var(--primary)]">Mesh</span>
          </div>
          <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] text-center shadow-sm">
            <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Nakshatra</span>
            <span className="text-sm font-black text-[var(--primary)]">Ashwini</span>
          </div>
          <div className="bg-[var(--surface)] p-3 rounded-xl border border-[var(--border)] text-center shadow-sm">
            <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase block mb-1">Lagna</span>
            <span className="text-sm font-black text-[var(--primary)]">Mesh</span>
          </div>
        </div>

        {/* Vimshottari Dasha */}
        <SectionHeader title="Vimshottari Dasha" hindiTitle="विंशोत्तरी दशा" />
        <Card className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-[var(--primary)] mb-0.5">Ketu Mahadasha</h3>
              <p className="text-[10px] font-bold text-[var(--text-sub)] uppercase">Ends: 18 Jun 2024</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-[var(--teal)]">Active Now</span>
            </div>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] w-[75%] rounded-full shadow-[0_0_8px_var(--primary)]"></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-widest">
            <span>2017</span>
            <span>2024</span>
          </div>
        </Card>

        {/* Detailed Reading CTA */}
        <Card className="bg-[var(--primary)] text-white border-none shadow-lg shadow-[var(--primary)]/20 mb-4">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white">Get Detailed Reading</h3>
                <p className="text-white/70 text-xs mt-1">Chat with our top verified astrologers</p>
              </div>
              <ChevronRight size={24} />
           </div>
        </Card>
      </div>
    </Layout>
  );
};

export default KundaliScreen;
