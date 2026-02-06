import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './i18n/translations';

// Convert our standard translations object to i18next resource format
const resources = Object.keys(translations).reduce((acc, lang) => {
    acc[lang] = { translation: translations[lang] };
    return acc;
}, {});

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;
