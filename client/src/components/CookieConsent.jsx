// src/components/CookieConsent.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './../css/cookieconsent.css';
import { useTranslation } from 'react-i18next';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('adshCookieConsent');
    if (consent === undefined) setShowConsent(true);
  }, []);

  const acceptCookies = () => {
    Cookies.set('adshCookieConsent', 'true', { expires: 365 });
    setShowConsent(false);
  };

  const declineCookies = () => {
    Cookies.set('adshCookieConsent', 'false', { expires: 365 });
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="cookie-consent">
      <div className="cookie-consent__content">
        <p>
          {t('cookieConsent.text')}{' '}
          <Link to="/privacy-policy" className="cookie-consent__link">
            {t('footer.privacyPolicy')}
          </Link>
        </p>
        <div className="cookie-consent__buttons">
          <button className="cookie-consent__button accept" onClick={acceptCookies}>
            {t('cookieConsent.accept')}
          </button>
          <button className="cookie-consent__button decline" onClick={declineCookies}>
            {t('cookieConsent.decline')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
