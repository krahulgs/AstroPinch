import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    // Translation function
    const t = (key) => {
        return translations[language]?.[key] || translations['en']?.[key] || key;
    };

    // Auto-detect country mapping (for city search)
    const setLanguageByCountry = (countryCode) => {
        const mapping = {
            'IN': 'hi',
            'ES': 'es',
            'MX': 'es',
            'FR': 'fr',
            'CA': 'fr', // Simple assumption for demo
            'US': 'en',
            'GB': 'en'
        };
        const lang = mapping[countryCode.toUpperCase()] || 'en';
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, setLanguageByCountry, t }}>
            {children}
        </LanguageContext.Provider>
    );
};
