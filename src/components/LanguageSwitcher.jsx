import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', label: 'EN', name: 'English' },
        { code: 'hi', label: 'HI', name: 'हिन्दी' },
        { code: 'ta', label: 'TA', name: 'தமிழ்' },
        { code: 'te', label: 'TE', name: 'తెలుగు' },
        { code: 'mr', label: 'MR', name: 'मराठी' }
    ];

    useEffect(() => {
        const savedLang = localStorage.getItem('i18nextLng');
        if (savedLang && languages.some(l => l.code === savedLang)) {
            i18n.changeLanguage(savedLang);
        }
    }, [i18n]);

    const handleLanguageChange = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('i18nextLng', code);
    };

    return (
        <div className="relative group">
            <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all group/btn"
                title="Change Language"
            >
                <Languages className="w-4 h-4 text-purple-400 group-hover/btn:text-purple-300 transition-colors" />
                <span className="text-xs font-bold uppercase tracking-wide">
                    {languages.find(l => l.code === i18n.language)?.label || 'EN'}
                </span>
            </button>
            
            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-2 w-32 bg-[#0a0a20] border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[60] shadow-2xl">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left text-xs font-bold transition-colors hover:bg-white/5 ${
                            i18n.language === lang.code ? 'text-purple-400 bg-white/5' : 'text-slate-400'
                        }`}
                    >
                        {lang.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSwitcher;
