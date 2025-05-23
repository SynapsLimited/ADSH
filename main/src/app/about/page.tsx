'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head'; // Replace react-helmet-async with next/head
import { useTranslation } from 'react-i18next';
import '@/css/about.css';

interface Card {
  key: string;
  title: string;
  icon: string;
  alt: string;
  text: string;
}

const About: React.FC = () => {
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

  const cards: Card[] = [
    {
      key: 'mission',
      title: t('about.cards.mission.title'),
      icon: '/assets/Flour.png',
      alt: t('about.cards.mission.alt'),
      text: t('about.cards.mission.text'),
    },
    {
      key: 'vision',
      title: t('about.cards.vision.title'),
      icon: '/assets/Tetra Pak.png',
      alt: t('about.cards.vision.alt'),
      text: t('about.cards.vision.text'),
    },
    {
      key: 'values',
      title: t('about.cards.values.title'),
      icon: '/assets/Cheese.png',
      alt: t('about.cards.values.alt'),
      text: t('about.cards.values.text'),
    },
  ];

  return (
    <div>
      <Head>
        <title>{t('about.helmetTitle')}</title>
      </Head>
      <div
        className="hero-container hero-container-about"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }}
      >
        <div className="hero-content">
          <h1 className="hero-title-h1">{t('about.hero.heading')}</h1>
          <p className="hero-description">{t('about.hero.description')}</p>
          <a href="/contact" className="btn btn-primary">
            {t('about.hero.contactButton')}
          </a>
        </div>
      </div>

      <section data-aos="fade-up" className="about-section">
        <h2 className="about-title">{t('about.historySection.heading')}</h2>
        <div className="about-content">
          <div className="about-text">
            <p>{t('about.historySection.text')}</p>
          </div>
          <div className="about-image">
            <img src="/assets/Slideshow 5.png" alt={t('about.historySection.imageAlt')} />
          </div>
        </div>
      </section>

      <section data-aos="fade-up" className="card-container container">
        {cards.map((card) => (
          <div key={card.key} className="card">
            <h2 className="card-title">{card.title}</h2>
            <p className="card-text">{card.text}</p>
            <div className="icon-wrapper">
              <img src={card.icon} alt={card.alt} className="card-icon" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default About;