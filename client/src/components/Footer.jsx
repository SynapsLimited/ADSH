// src/components/Footer.jsx

import React from 'react';
import './../css/footer.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer" style={{ backgroundImage: `url('/assets/Footer Background.png')` }}>
      <div className="container footer-container">
        <div className="footer-top">
          <img src="/assets/Logo-White.png" alt="ADSH Logo" className="footer-logo" />
          <h2 className="footer-quote">Albanian Dairy & Supply Hub</h2>
        </div>

        <div className="footer-bottom">
          <div className="footer-column footer-location">
            <h4>{t('footer.location')}</h4>
            <div className="socials-container">
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/Europe.png`} alt="Europe" />
                <a href="https://www.google.com/maps/place/ADSH-2014/@41.3177496,19.7092078,12z/data=!4m6!3m5!1s0x135031b2d86be505:0x7f9de65e08ceaa89!8m2!3d41.31765!4d19.7916102!16s%2Fg%2F11fmt25r81?entry=tts&g_ep=EgoyMDI0MTAwNS4yIPu8ASoASAFQAw%3D%3D" 
                  className="footer-link">{t('footer.address')}</a>
              </div>
            </div>
          </div>
          <div className="footer-column footer-contact">
            <h4>{t('footer.contact')}</h4>
            <div className="socials-container">
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/phone-call.png`} alt="Phone Number" />
                <a href="tel:+355692074234" className="footer-link">{t('footer.phone')}</a>
              </div>
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/email.png`} alt="Email" />
                <a href="mailto:contact@adsh2014.com" className="footer-link">{t('footer.email')}</a>
              </div>
            </div>
          </div>
          <div className="footer-column footer-socials">
            <h4>{t('footer.socialNetworks')}</h4>
            <div className="socials-container">
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/whatsapp.png`} alt="Whatsapp" />
                <a href="https://wa.link/oj2ybw" className="footer-link">{t('footer.whatsapp')}</a>
              </div>
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/instagram.png`} alt="Instagram" />
                <a href="https://www.instagram.com" className="footer-link">{t('footer.instagram')}</a>
              </div>
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/facebook.png`} alt="Facebook" />
                <a href="https://www.facebook.com" className="footer-link">{t('footer.facebook')}</a>
              </div>
              <div className="social-row">
                <img src={`${process.env.PUBLIC_URL}/assets/linkedin.png`} alt="LinkedIn" />
                <a href="https://www.linkedin.com/company/albanian-dairy-supply-hub" className="footer-link">{t('footer.linkedin')}</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-copy">
          <p>{t('footer.allRightsReserved')}</p>
          <p>{t('footer.designedBy')} <a href="http://www.synapslimited.eu" className="footer-copy-designed-by-synaps">Synaps</a></p>
        </div>
        <Link to="/privacy-policy" className="privacy-policy">{t('footer.privacyPolicy')}</Link>

      </div>
    </footer>
  );
};

export default Footer;
