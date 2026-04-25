import React, { useState } from 'react';
import Layout from '../../components/v2/Layout';
import { Card, SectionHeader, Button, Input } from '../../components/v2/UI';
import { Heart, ShieldAlert, CheckCircle2, Download, ChevronDown } from 'lucide-react';

const KootaRow = ({ name, score, max, description }) => (
  <div className="py-4 border-b border-[var(--border)] last:border-none">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-bold text-[var(--text-main)]">{name}</span>
      <span className="text-xs font-black text-[var(--primary)]">{score} / {max}</span>
    </div>
    <p className="text-[10px] text-[var(--text-sub)] font-medium leading-relaxed">{description}</p>
  </div>
);

const MatchingScreen = () => {
  const [showResult, setShowResult] = useState(false);

  return (
    <Layout activeTab="kundali">
      <div className="px-4 pt-6 pb-4">
        <h1 className="mb-6">Kundali Matching</h1>

        {!showResult ? (
          <div className="space-y-6">
            <Card>
              <SectionHeader title="Your Details" />
              <div className="space-y-4">
                <Input label="Your Name" placeholder="Enter your name" />
                <div className="grid grid-cols-2 gap-4">
                   <Input label="Birth Date" type="date" />
                   <Input label="Birth Time" type="time" />
                </div>
                <Input label="Birth City" placeholder="Enter city name" />
              </div>
            </Card>

            <div className="flex justify-center -my-3 relative z-10">
               <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center shadow-lg">
                  <Heart size={20} className="fill-white" />
               </div>
            </div>

            <Card>
              <SectionHeader title="Partner's Details" />
              <div className="space-y-4">
                <Input label="Partner's Name" placeholder="Enter name" />
                <div className="grid grid-cols-2 gap-4">
                   <Input label="Birth Date" type="date" />
                   <Input label="Birth Time" type="time" />
                </div>
                <Input label="Birth City" placeholder="Enter city name" />
              </div>
            </Card>

            <Button onClick={() => setShowResult(true)} className="w-full mt-4">
              Check Compatibility
            </Button>
          </div>
        ) : (
          <div className="space-y-8 pb-12">
            {/* Score Indicator */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                    <circle 
                      cx="96" cy="96" r="88" 
                      fill="none" stroke="var(--border)" strokeWidth="12" 
                    />
                    <circle 
                      cx="96" cy="96" r="88" 
                      fill="none" stroke="var(--primary)" strokeWidth="12" 
                      strokeDasharray="553" strokeDashoffset={553 - (553 * 28) / 36}
                      strokeLinecap="round"
                    />
                 </svg>
                 <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-black text-[var(--text-main)]">28</span>
                    <span className="text-xs font-bold text-[var(--text-sub)] uppercase">Out of 36</span>
                 </div>
              </div>
              <h2 className="mt-4 text-[var(--teal)] font-black uppercase tracking-widest">Great Match!</h2>
            </div>

            {/* Dosha Status */}
            <div className="grid grid-cols-2 gap-3">
               <Card className="bg-emerald-50 border-emerald-100 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-600" size={20} />
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Mangal Dosha</span>
                    <span className="text-xs font-black text-emerald-700">Not Present</span>
                  </div>
               </Card>
               <Card className="bg-rose-50 border-rose-100 flex items-center gap-3">
                  <ShieldAlert className="text-rose-600" size={20} />
                  <div>
                    <span className="text-[10px] font-bold text-rose-800 uppercase block">Bhakoot Dosha</span>
                    <span className="text-xs font-black text-rose-700">Present</span>
                  </div>
               </Card>
            </div>

            {/* Kootas Breakdown */}
            <Card>
              <SectionHeader title="Ashta Koota Analysis" />
              <KootaRow name="Varna" score={1} max={1} description="Mutual work and responsibility compatibility." />
              <KootaRow name="Vashya" score={2} max={2} description="Dominance and attraction level." />
              <KootaRow name="Tara" score={1.5} max={3} description="Health and destiny alignment." />
              <KootaRow name="Yoni" score={3} max={4} description="Sexual and biological compatibility." />
              <KootaRow name="Graha Maitri" score={5} max={5} description="Mental and psychological bonding." />
            </Card>

            <div className="flex flex-col gap-3">
               <Button className="w-full">
                  <Download size={18} className="mr-2" />
                  Download Matching Report — ₹99
               </Button>
               <button 
                 onClick={() => setShowResult(false)}
                 className="text-xs font-bold text-[var(--text-sub)] uppercase tracking-widest text-center"
               >
                  Modify Details
               </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MatchingScreen;
