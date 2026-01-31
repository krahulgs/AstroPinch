import React from 'react';

const AstroLogo = ({ className = "w-10 h-10" }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="logoGradient" x1="0" y1="0" x2="100" y2="100">
                    <stop offset="0%" stopColor="#9333ea" /> {/* Purple 600 */}
                    <stop offset="100%" stopColor="#7c3aed" /> {/* Violet 600 */}
                </linearGradient>
                <linearGradient id="moonGradient" x1="20" y1="20" x2="80" y2="80">
                    <stop offset="0%" stopColor="#fbbf24" /> {/* Amber 400 */}
                    <stop offset="100%" stopColor="#d97706" /> {/* Amber 600 */}
                </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />

            {/* Crescent Moon */}
            <path
                d="M65 25C65 25 35 35 35 65C35 85 55 85 55 85C40 85 25 70 25 50C25 30 40 20 65 25Z"
                fill="url(#moonGradient)"
                filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))"
            />

            {/* Pinched Star */}
            <path
                d="M70 45 L73 52 L80 55 L73 58 L70 65 L67 58 L60 55 L67 52 Z"
                fill="#fff"
                filter="drop-shadow(0px 0px 4px rgba(255,255,255,0.8))"
            />

            {/* Small accent stars */}
            <circle cx="40" cy="35" r="1.5" fill="#fff" opacity="0.6" />
            <circle cx="30" cy="65" r="1" fill="#fff" opacity="0.4" />
        </svg>
    );
};

export default AstroLogo;
