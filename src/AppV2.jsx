import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Onboarding from './pages/v2/Onboarding';
import HomeDashboard from './pages/v2/HomeDashboard';
import KundaliScreen from './pages/v2/KundaliScreen';
import RashifalScreen from './pages/v2/RashifalScreen';
import ConsultScreen from './pages/v2/ConsultScreen';
import MatchingScreen from './pages/v2/MatchingScreen';
import PanchangScreen from './pages/v2/PanchangScreen';
import ProfileScreen from './pages/v2/ProfileScreen';

const AppV2 = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');

  if (!hasCompletedOnboarding) {
    return (
      <ThemeProvider>
        <Onboarding onComplete={() => setHasCompletedOnboarding(true)} />
      </ThemeProvider>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'home': return <HomeDashboard onTabChange={setCurrentTab} />;
      case 'kundali': return <MatchingScreen />; // Defaulting kundali tab to matching for variety, or keep as KundaliScreen
      case 'horoscope': return <RashifalScreen />;
      case 'consult': return <ConsultScreen />;
      case 'profile': return <ProfileScreen />;
      case 'panchang': return <PanchangScreen />;
      case 'kundali_main': return <KundaliScreen />;
      default: return <HomeDashboard onTabChange={setCurrentTab} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="v2-preview">
        {renderContent()}
      </div>
    </ThemeProvider>
  );
};

export default AppV2;
