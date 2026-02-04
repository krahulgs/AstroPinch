import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const AppLayout = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="min-h-screen text-primary selection:bg-purple-500/30 relative overflow-x-hidden">
            {/* Background Image with Overlay - Removed for light theme to use CSS pattern */}
            {/* <div
                className="fixed inset-0 -z-20 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url("/assets/cosmic-bg.png")' }}
            ></div> */}
            <div className={`fixed inset-0 -z-10 transition-colors duration-500 ${isHomePage ? 'bg-transparent' : 'bg-background/80 backdrop-blur-[2px]'}`}></div>

            <Navbar />
            <main className="min-h-[calc(100vh-80px)] relative z-10 w-full">
                {children}
            </main>
            <Footer />

            {/* Decorative background elements */}
            <div className="fixed top-20 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
    );
};

export default AppLayout;
