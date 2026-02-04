import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChartProvider } from './context/ChartContext';
import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import Horoscope from './pages/Horoscope';
import Predictions from './pages/Predictions';
import InputForm from './pages/InputForm';
import BirthChart from './pages/BirthChart';
import LunarChart from './pages/LunarChart';
import Kundali from './pages/Kundali';
import Numerology from './pages/Numerology';
import ConsolidatedReport from './pages/ConsolidatedReport';
import CalendarPage from './pages/CalendarPage';
import { ProfileProvider } from './context/ProfileContext';
import ProfileManagement from './pages/ProfileManagement';
import DailyInsights from './pages/DailyInsights';
import Login from './pages/Login';
import Register from './pages/Register';
import { useProfile } from './context/ProfileContext';
import { Navigate } from 'react-router-dom';

// Company Pages
import AboutUs from './pages/company/AboutUs';
import HowItWorks from './pages/company/HowItWorks';
import ContactUs from './pages/company/ContactUs';
import HelpCenter from './pages/company/HelpCenter';
import Partnership from './pages/company/Partnership';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import Terms from './pages/legal/Terms';
import Disclaimer from './pages/legal/Disclaimer';
import RefundPolicy from './pages/legal/RefundPolicy';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useProfile();
  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <ChartProvider>
        <ProfileProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/horoscope" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><Horoscope /></div>} />
              <Route path="/horoscope/:sign" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><Horoscope /></div>} />
              <Route path="/predictions" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><Predictions /></div>} />
              <Route path="/chart" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><InputForm /></div>} />
              <Route path="/birth-chart" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><BirthChart /></div>} />
              <Route path="/lunar-chart" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><LunarChart /></div>} />
              <Route path="/kundali" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><Kundali /></div>} />
              <Route path="/numerology" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><Numerology /></div>} />
              <Route path="/report/consolidated" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><ConsolidatedReport /></div>} />
              <Route path="/calendar" element={<div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><CalendarPage /></div>} />
              <Route path="/profiles" element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><ProfileManagement /></div>
                </ProtectedRoute>
              } />
              <Route path="/daily-guidance" element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto px-6 pt-24 pb-12"><DailyInsights /></div>
                </ProtectedRoute>
              } />

              {/* Company Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/partnership" element={<Partnership />} />

              {/* Legal Pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
            </Routes>
          </AppLayout>
        </ProfileProvider>
      </ChartProvider>
    </Router>
  );
}

export default App;
