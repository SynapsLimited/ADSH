// src/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import translationAL from './../locales/sq/translation.json';
import translationEN from './../locales/en/translation.json';

// Define the resources
const resources = {
  sq: {
    translation: translationAL,
  },
  en: {
    translation: translationEN,
  },
};

// Initialize i18next
i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'sq', // Set Albanian as fallback language
    debug: false, // Set to false in production

    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      // Options for language detection
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
