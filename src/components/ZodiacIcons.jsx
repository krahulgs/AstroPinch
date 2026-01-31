import React from 'react';

export const AriesIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 4v16" />
        <path d="M12 4c-4-1-6 2-6 6a3 3 0 0 0 6 0" />
        <path d="M12 4c4-1 6 2 6 6a3 3 0 0 1-6 0" />
    </svg>
);

export const TaurusIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 3a6 6 0 0 0 12 0" />
        <circle cx="12" cy="15" r="6" />
    </svg>
);

export const GeminiIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 4h12" />
        <path d="M6 20h12" />
        <path d="M9 4v16" />
        <path d="M15 4v16" />
    </svg>
);

export const CancerIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 12a3 3 0 1 0 3-3" />
        <path d="M18 12a3 3 0 1 1-3 3" />
        <circle cx="6" cy="12" r="3" transform="rotate(-90 6 12)" />
        <circle cx="18" cy="12" r="3" transform="rotate(90 18 12)" />
        <path d="M6 12h12" stroke="transparent" /> {/* Spacer */}
        <path d="M6 15h0" />
        <path d="M18 9h0" />
        {/* Simplified decorative Crab symbol */}
        <path d="M6 5.5C6 5.5 12 5.5 12 12C12 18.5 18 18.5 18 18.5" opacity="0" />
        <path d="M18 5.5C18 5.5 12 5.5 12 12C12 18.5 6 18.5 6 18.5" opacity="0" />
        <path d="M5 5h14" opacity="0" />
        <path d="M5 19h14" opacity="0" />
        {/* Actual 69 symbol representation */}
        <path d="M7 12a4 4 0 1 1 5.3 3.5" />
        <path d="M17 12a4 4 0 1 0-5.3-3.5" />
    </svg>
);

// Better Cancer Icon
export const CancerIconBetter = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 12a6 6 0 0 1 6-6" />
        <path d="M18 12a6 6 0 0 0-6 6" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="12" r="3" />
    </svg>
);

export const LeoIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="6" cy="13" r="3" />
        <path d="M6 10c0-4 3-7 7-7s6 2 6 7c0 4-4 7-6 7" />
        <path d="M16 17c2.5 0 4-1.5 4-4" />
    </svg>
);

export const VirgoIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 5v14" />
        <path d="M5 8c3 0 4 3 4 5v6" />
        <path d="M9 13c3 0 4-3 4-5v3c0 4 2 5 4 5s3-3 3-5" />
        <path d="M17 16c0 3-1.5 5-4 5" />
    </svg>
);

export const LibraIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="18" x2="20" y2="18" />
        <path d="M4 14h16" />
        <path d="M12 14v-4" />
        <path d="M8 10a4 4 0 0 1 8 0" />
    </svg>
);

export const ScorpioIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 5v14" />
        <path d="M5 8c3 0 4 3 4 5v6" />
        <path d="M9 13c3 0 4-3 4-5v6" />
        <path d="M13 13c3 0 4-3 4-5v6l3 2 2-2" />
        <path d="M22 14l-2 2" />
    </svg>
);

export const SagittariusIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="20" x2="20" y2="4" />
        <path d="M12 4h8v8" />
        <line x1="8" y1="16" x2="16" y2="8" />
    </svg>
);

export const CapricornIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 14a3 3 0 0 1 3-3c3 0 2 5 5 5 2.5 0 2.5-3.5 0-3.5" />
        <path d="M12 12.5c2 0 4-2 4-6 0-3-2-3-2-3" />
        <circle cx="16.5" cy="16.5" r="3.5" />
        <path d="M13 16.5c-1 2-2 4-5 4" />
    </svg>
);

export const AquariusIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 10l3-3 3 3 3-3 3 3 3-3" />
        <path d="M4 16l3-3 3 3 3-3 3 3 3-3" />
    </svg>
);

export const PiscesIcon = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 4c6 0 9 5 9 8s-3 8-9 8" />
        <path d="M18 4c-6 0-9 5-9 8s3 8 9 8" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const ZodiacIcons = {
    Aries: AriesIcon,
    Taurus: TaurusIcon,
    Gemini: GeminiIcon,
    Cancer: CancerIconBetter,
    Leo: LeoIcon,
    Virgo: VirgoIcon,
    Libra: LibraIcon,
    Scorpio: ScorpioIcon,
    Sagittarius: SagittariusIcon,
    Capricorn: CapricornIcon,
    Aquarius: AquariusIcon,
    Pisces: PiscesIcon
};

export default ZodiacIcons;
