import React from 'react';
import Layout from '../../components/v2/Layout';
import { Card, SectionHeader, Badge, Button } from '../../components/v2/UI';
import { Settings, Bell, Globe, Palette, HelpCircle, LogOut, ChevronRight, Crown, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const SettingsItem = ({ icon: Icon, label, value, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between py-4 border-b border-[var(--border)] last:border-none active:opacity-60 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-[var(--bg)] flex items-center justify-center text-[var(--text-sub)]">
        <Icon size={20} />
      </div>
      <span className="text-[15px] font-medium text-[var(--text-main)]">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-widest">{value}</span>}
      <ChevronRight size={18} className="text-[var(--text-sub)] opacity-40" />
    </div>
  </button>
);

const ProfileScreen = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Layout activeTab="profile">
      <div className="px-4 pt-8 pb-12">
        {/* User Profile Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-white text-3xl font-black shadow-xl">
              RP
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--surface)] border-2 border-[var(--bg)] flex items-center justify-center text-[var(--secondary)] shadow-md">
              <Crown size={16} />
            </div>
          </div>
          <h1 className="text-xl mb-1">Rahul Pranjay</h1>
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-white bg-[var(--secondary)] px-2 py-0.5 rounded-full uppercase tracking-widest">Premium Member</span>
          </div>
        </div>

        {/* Saved Charts Section */}
        <SectionHeader title="Saved Charts" actionLabel="Add New" />
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-10 -mx-4 px-4 pb-2">
           <Card className="min-w-[140px] flex flex-col items-center gap-2 bg-[var(--surface)] border-2 border-[var(--primary)]/20">
              <div className="text-2xl">♈</div>
              <h3 className="text-xs">Self</h3>
              <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase">Mesh · Ashwini</span>
           </Card>
           <Card className="min-w-[140px] flex flex-col items-center gap-2 opacity-60">
              <div className="text-2xl">♋</div>
              <h3 className="text-xs">Anjali (Wife)</h3>
              <span className="text-[10px] font-bold text-[var(--text-sub)] uppercase">Kark · Pushya</span>
           </Card>
           <Card className="min-w-[140px] flex flex-col items-center justify-center gap-2 border-dashed border-[var(--text-sub)] opacity-40">
              <Users size={24} />
              <h3 className="text-xs">Add Family</h3>
           </Card>
        </div>

        {/* Settings Groups */}
        <Card className="mb-6">
          <SectionHeader title="Preferences" />
          <SettingsItem icon={Globe} label="Language" value="English" />
          <SettingsItem 
            icon={Palette} 
            label="Theme" 
            value={theme === 'dark' ? 'Cosmic Dark' : 'Saffron Light'} 
            onClick={toggleTheme}
          />
          <SettingsItem icon={Bell} label="Notifications" value="On" />
        </Card>

        <Card className="mb-8">
          <SectionHeader title="Support & Info" />
          <SettingsItem icon={HelpCircle} label="Help & Support" />
          <SettingsItem icon={Settings} label="About AstroPinch" />
          <SettingsItem icon={LogOut} label="Logout" />
        </Card>

        {/* Delete Account (Destructive) */}
        <div className="text-center px-4">
           <button className="text-[10px] font-black text-rose-500 uppercase tracking-widest opacity-60">
              Delete Account Permanently
           </button>
           <p className="text-[10px] text-[var(--text-sub)] mt-4">
              AstroPinch v4.2.1 • Made with ❤️ in India
           </p>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileScreen;
