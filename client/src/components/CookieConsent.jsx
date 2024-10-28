// src/components/CookieConsent.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../css/cookieconsent.css';

const CookieConsent = () => {
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
          Ne përdorim cookies për të përmirësuar përvojën tuaj në faqen tonë. Duke vazhduar të shfletoni këtë faqe, ju pranoni përdorimin e cookies.
          <Link to="/privacy-policy" className="cookie-consent__link">Mëso më shumë</Link>
        </p>
        <div className="cookie-consent__buttons">
          <a className="cookie-consent__button accept" onClick={acceptCookies}>
            Pranoni
          </a>
          <a className="cookie-consent__button decline" onClick={declineCookies}>
            Refuzo
          </a>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
