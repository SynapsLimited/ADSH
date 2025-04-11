'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n'; // Import the initialized i18n instance

const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // i18n is already initialized in i18n.ts, so we just use it here
  useEffect(() => {
    if (!i18n.isInitialized) {
      console.warn('i18n was not initialized properly');
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default I18nProvider;