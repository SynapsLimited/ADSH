'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationSQ from '@/locales/sq/translation.json';
import translationEN from '@/locales/en/translation.json';

const resources = {
  sq: {
    translation: translationSQ,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'sq',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React handles escaping
    },
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  })
  .catch((error) => {
    console.error('Failed to initialize i18next:', error);
  });

export default i18n;