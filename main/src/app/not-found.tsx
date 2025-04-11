'use client'

import React from 'react';
import Link from 'next/link'; // Use Next.js Link instead of react-router-dom
import { useTranslation } from 'react-i18next';

const ErrorPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section data-aos="fade-up" className="container error-page">
      <div className="center">
        <Link href="/" className="btn btn-primary">
          {t('errorPage.backButton')}
        </Link>
        <h3>{t('errorPage.message')}</h3>
      </div>
    </section>
  );
};

export default ErrorPage;