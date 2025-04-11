// src/pages/ErrorPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <section data-aos="fade-up" className="container error-page">
      <div className="center">
        <Link to="/" className="btn btn-primary">{t('errorPage.backButton')}</Link>
        <h3>{t('errorPage.message')}</h3>
      </div>
    </section>
  );
};

export default ErrorPage;
