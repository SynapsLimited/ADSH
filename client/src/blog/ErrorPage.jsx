import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useTranslation } from 'react-i18next'; // Importing useTranslation hook

const ErrorPage = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook

  return (
    <section data-aos="fade-up"   className="container error-page">
      <div  className="center">
        <Link to="/" className="btn btn-primary">{t('ErrorPage.goBackButton')}</Link>
        <h2>{t('ErrorPage.pageNotFound')}</h2>
      </div>
    </section>
  );
};

export default ErrorPage;
