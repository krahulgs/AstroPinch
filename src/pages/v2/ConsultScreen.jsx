import React, { useState } from 'react';
import Layout from '../../components/v2/Layout';
import { Card, SectionHeader, Button, Badge } from '../../components/v2/UI';
import { Search, Filter, Phone, MessageSquare, Star, Info } from 'lucide-react';

const AstrologerCard = ({ name, specialty, exp, rating, reviews, price, status, language, free = false }) => (
  <Card className="mb-4">
    <div className="flex gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-slate-200 overflow-hidden border-2 border-[var(--primary)]/20">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} />
        </div>
        <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-[var(--surface)] rounded-full
          ${status === 'live' ? 'bg-[var(--teal)]' : status === 'online' ? 'bg-blue-500' : 'bg-slate-400'}`} />
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-bold">{name}</h3>
          {free && (
            <span className="text-[10px] font-black text-white bg-[var(--teal)] px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
              Free 5 Min
            </span>
          )}
        </div>
        <p className="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-wider mt-1">{specialty} • {exp} Yrs</p>
        
        <div className="flex items-center gap-1 mt-2">
          <Star size={12} className="fill-[var(--secondary)] text-[var(--secondary)]" />
          <span className="text-xs font-bold">{rating}</span>
          <span className="text-[10px] text-[var(--text-sub)]">({reviews})</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {language.map(lang => (
            <span key={lang} className="text-[9px] font-bold bg-[var(--bg)] px-2 py-0.5 rounded-md border border-[var(--border)] text-[var(--text-sub)]">
              {lang}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between">
      <div>
        <span className="text-sm font-black text-[var(--text-main)]">₹{price}/min</span>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 h-10 px-4 rounded-xl border border-[var(--primary)] text-[var(--primary)] flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
          <MessageSquare size={14} /> Chat
        </button>
        <button className="flex-1 h-10 px-4 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Phone size={14} /> Call
        </button>
      </div>
    </div>
  </Card>
);

const ConsultScreen = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Vedic', 'KP', 'Numerology', 'Tarot', 'Vastu'];

  return (
    <Layout activeTab="consult">
      <div className="px-4 pt-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl">Consult Astrologers</h1>
          <button className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-main)]">
            <Search size={18} />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 -mx-4 px-4">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap
                ${activeFilter === f ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-sub)]'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Astrologer List */}
        <AstrologerCard 
          name="Acharya Shastri" 
          specialty="Vedic Astrology" 
          exp={15} 
          rating={4.9} 
          reviews="2,142" 
          price={25} 
          status="live"
          language={['Hindi', 'English', 'Sanskrit']}
          free={true}
        />
        <AstrologerCard 
          name="Dr. Priya Verma" 
          specialty="KP, Nadi Astrology" 
          exp={8} 
          rating={4.8} 
          reviews="945" 
          price={20} 
          status="online"
          language={['English', 'Marathi']}
        />
        <AstrologerCard 
          name="Swami Vivekanand" 
          specialty="Vedic, Palmistry" 
          exp={22} 
          rating={5.0} 
          reviews="5,410" 
          price={50} 
          status="live"
          language={['Hindi', 'Bengali']}
        />

        {/* Trust Signal Bar (Pinned) */}
        <div className="fixed bottom-[64px] left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-2 z-40">
           <div className="bg-slate-900 text-white rounded-2xl p-3 flex items-center justify-between shadow-xl">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Info size={16} />
                 </div>
                 <span className="text-xs font-medium">How Chat Consultation Works?</span>
              </div>
              <button className="text-[var(--secondary)] text-xs font-bold uppercase tracking-widest">Learn More</button>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default ConsultScreen;
