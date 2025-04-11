'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head'; // Replace react-helmet-async with next/head
import { useTranslation } from 'react-i18next';
import '@/css/contact.css';
import '@/css/products.css';
import ContactForm from '@/components/ContactForm';

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div>
      <Head>
        <title>{t('contact.helmetTitle')}</title>
      </Head>
      <div
        className="hero-container hero-container-contact"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }}
      >
        <div className="hero-content">
          <h1 className="hero-title-h1">{t('contact.hero.heading')}</h1>
          <p className="hero-description">{t('contact.hero.description')}</p>
          <a href="/contact" className="btn btn-primary">
            {t('contact.hero.contactButton')}
          </a>
        </div>
      </div>

      <div className="contact-overview-title">
        <h1>{t('contact.overviewTitles.contactDetails')}</h1>
      </div>

      <section data-aos="fade-up" className="container contact-section">
        <div className="blob location-blob">
          <h2>{t('contact.overviewTitles.location')}</h2>
          <a href="https://www.google.com/maps/place/ADSH-2014/@41.3177496,19.7092078,12z/data=!4m6!3m5!1s0x135031b2d86be505:0x7f9de65e08ceaa89!8m2!3d41.31765!4d19.7916102!16s%2Fg%2F11fmt25r81?entry=tts&g_ep=EgoyMDI0MTAwNS4yIPu8ASoASAFQAw%3D%3D">
            <img className="location-img" src="/assets/Europe Map.png" alt={t('contact.location.mapAlt')} />
          </a>
          <p>{t('contact.location.address')}</p>
        </div>
        <div className="blob phone-mail-blob">
          <h2>{t('contact.overviewTitles.contact')}</h2>
          <img src="/assets/phone-call.png" alt={t('contact.contactInfo.phoneAlt')} />
          <a href="tel:+355692074234">
            <h4>{t('contact.contactInfo.phoneNumber')}</h4>
          </a>
          <img src="/assets/email.png" alt={t('contact.contactInfo.emailAlt')} />
          <a href="mailto:info@example.com">
            <h4>{t('contact.contactInfo.email')}</h4>
          </a>
        </div>
        <div className="blob socials-blob">
          <h2>{t('contact.overviewTitles.socials')}</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com/people/ADSH/61567858514013/" className="contact-link">
              <img src="/assets/facebook.png" alt={t('contact.socials.facebookAlt')} />
            </a>
            <a href="https://www.instagram.com/albaniandairysupplyhub/" className="contact-link">
              <img src="/assets/instagram.png" alt={t('contact.socials.instagramAlt')} />
            </a>
            <a href="https://www.linkedin.com/company/albanian-dairy-supply-hub" className="contact-link">
              <img src="/assets/linkedin.png" alt={t('contact.socials.linkedinAlt')} />
            </a>
            <a href="https://wa.link/oj2ybw" className="contact-link">
              <img src="/assets/whatsapp.png" alt="Whatsapp" />
            </a>
          </div>
        </div>
      </section>

      <div className="contact-overview-title">
        <h1>{t('contact.overviewTitles.location')}</h1>
      </div>

      <section data-aos="fade-up" className="map-section container">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1498.30682134506!2d19.7912799!3d41.3172679!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135031b2d86be505%3A0x7f9de65e08ceaa89!2sADSH-2014!5e0!3m2!1sen!2s!4v1729073480619!5m2!1sen!2s"
            width="auto"
            height="auto"
            loading="lazy"
            title={t('contact.map.iframeTitle')}
          ></iframe>
        </div>
      </section>

      <div className="contact-overview-title">
        <h1>{t('contact.overviewTitles.contactNow')}</h1>
        <p>{t('contact.contactNow.description')}</p>
      </div>

      <ContactForm />
    </div>
  );
};

export default Contact;