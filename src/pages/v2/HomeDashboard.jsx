import React from 'react';
import Layout from '../../components/v2/Layout';
import { Card, Badge, SectionHeader, Button } from '../../components/v2/UI';
import { Moon, Sun, Star, Calendar, Users, Zap, MessageSquare, ChevronRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const HomeDashboard = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Layout activeTab="home">
      <div className="px-4 pt-8 pb-4">
        {/* Header with Theme Toggle */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mb-1">Namaste, Rahul</h1>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-sub)] text-sm font-medium">Saturday, 25 April</span>
              <span className="font-hindi text-[var(--text-sub)] opacity-60 text-xs">शनिवार, २५ अप्रैल</span>
            </div>
          </div>
          <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shadow-sm active:scale-95 transition-all"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* User Stats/Badges */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
          <Badge icon={Star}>Mesh (Aries)</Badge>
          <Badge icon={Zap}>Ashwini</Badge>
          <Badge icon={Moon}>Shukla Paksha</Badge>
        </div>

        {/* 2x2 Quick Access Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Card className="flex flex-col gap-3 group active:bg-[var(--primary)] active:text-white transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-active:bg-white/20 group-active:text-white">
              <Star size={20} />
            </div>
            <div>
              <h3 className="text-sm">My Kundali</h3>
              <p className="text-[10px] text-[var(--text-sub)] uppercase font-bold tracking-wider mt-1 group-active:text-white/70">Detailed Chart</p>
            </div>
          </Card>
          <Card className="flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--secondary)]/10 flex items-center justify-center text-[var(--secondary)]">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-sm">Today's Rashifal</h3>
              <p className="text-[10px] text-[var(--text-sub)] uppercase font-bold tracking-wider mt-1">Daily Predictions</p>
            </div>
          </Card>
          <Card className="flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--teal)]/10 flex items-center justify-center text-[var(--teal)]">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-sm">Compatibility</h3>
              <p className="text-[10px] text-[var(--text-sub)] uppercase font-bold tracking-wider mt-1">Kundali Matching</p>
            </div>
          </Card>
          <Card className="flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-sm">Panchang</h3>
              <p className="text-[10px] text-[var(--text-sub)] uppercase font-bold tracking-wider mt-1">Tithi & Timing</p>
            </div>
          </Card>
        </div>

        {/* AI Insight Card */}
        <SectionHeader title="Today's Cosmic Insight" hindiTitle="आज की दिव्य दृष्टि" />
        <Card className="bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] border-2 border-[var(--primary)]/20 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <p className="text-sm leading-relaxed text-[var(--text-main)] italic">
              "Align with the wisdom of Jupiter today for growth. Embrace new opportunities before 5 PM. A positive transit in your 5th house suggests creative breakthroughs."
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse"></div>
              <span className="text-[10px] font-bold text-[var(--teal)] uppercase tracking-widest">Guru Gochar Active</span>
            </div>
          </div>
        </Card>

        {/* Consult Section */}
        <SectionHeader title="Talk to an Astrologer" actionLabel="View All" />
        <Card className="flex gap-4 items-center">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden border-2 border-[var(--primary)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=astro1" alt="Astrologer" />
            </div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--teal)] border-2 border-[var(--surface)] rounded-full"></div>
          </div>
          <div className="flex-1">
            <h3 className="text-sm">Acharya Shastri</h3>
            <p className="text-xs text-[var(--text-sub)] mt-0.5">Vedic, KP Astrology • 15 yrs</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={10} className="fill-[var(--secondary)] text-[var(--secondary)]" />
              <span className="text-[10px] font-bold">4.9 (2.1k reviews)</span>
            </div>
          </div>
          <Button variant="secondary" className="!h-10 !px-4 !text-xs !rounded-xl">
            <MessageSquare size={14} className="mr-2" />
            Chat
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default HomeDashboard;
