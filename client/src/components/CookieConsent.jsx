// src/components/CookieConsent.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../css/cookieconsent.css';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('adshCookieConsent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('adshCookieConsent', 'true');
    setShowConsent(false);
  };

  const declineCookies = () => {
    localStorage.setItem('adshCookieConsent', 'false');
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__content">
        <p>
          {t('cookieConsent.text')}
          <Link to="/privacy-policy" className="cookie-consent__link">{t('cookieConsent.learnMore')}</Link>
        </p>
        <div className="cookie-consent__buttons">
          <a className="cookie-consent__button accept" onClick={acceptCookies}>
            {t('cookieConsent.accept')}
          </a>
          <a className="cookie-consent__button decline" onClick={declineCookies}>
            {t('cookieConsent.decline')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
