import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        // Persist language selection
        const savedLang = localStorage.getItem('i18nextLng');
        if (savedLang && ['en', 'hi'].includes(savedLang)) {
            i18n.changeLanguage(savedLang);
        }
    }, [i18n]);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'hi' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('i18nextLng', newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all group"
            title={i18n.language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
        >
            <Languages className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
            <span className="text-xs font-bold uppercase tracking-wide">
                {i18n.language === 'en' ? 'EN' : 'HI'}
            </span>
        </button>
    );
};

export default LanguageSwitcher;
