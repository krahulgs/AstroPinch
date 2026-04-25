import React from 'react';
import { Home, Grid, Compass, MessageSquare, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200
      ${active ? 'text-[var(--primary)]' : 'text-[var(--text-sub)] opacity-50'}`}
  >
    <div className="relative">
      <Icon strokeWidth={active ? 2.5 : 2} size={22} />
      {active && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--primary)] rounded-full" />
      )}
    </div>
    <span className="text-[10px] font-medium tracking-tight uppercase">{label}</span>
  </button>
);

const Layout = ({ children, activeTab = 'home', onTabChange }) => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col max-w-[480px] mx-auto shadow-2xl relative overflow-hidden">
      {/* Content */}
      <main className="flex-1 pb-[80px] safe-bottom overflow-y-auto custom-scrollbar">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-[64px] bg-[var(--surface)] border-t border-[var(--border)] flex items-center px-4 z-50 astro-glass rounded-t-2xl">
        <NavItem 
          icon={Home} 
          label="Home" 
          active={activeTab === 'home'} 
          onClick={() => onTabChange?.('home')} 
        />
        <NavItem 
          icon={Grid} 
          label="Kundali" 
          active={activeTab === 'kundali'} 
          onClick={() => onTabChange?.('kundali')} 
        />
        <NavItem 
          icon={Compass} 
          label="Horoscope" 
          active={activeTab === 'horoscope'} 
          onClick={() => onTabChange?.('horoscope')} 
        />
        <NavItem 
          icon={MessageSquare} 
          label="Consult" 
          active={activeTab === 'consult'} 
          onClick={() => onTabChange?.('consult')} 
        />
        <NavItem 
          icon={User} 
          label="Profile" 
          active={activeTab === 'profile'} 
          onClick={() => onTabChange?.('profile')} 
        />
      </nav>
    </div>
  );
};

export default Layout;
