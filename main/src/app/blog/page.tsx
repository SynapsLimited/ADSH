'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import Posts from './components/Posts';
import Authors from './components/Authors';
import '@/css/blog.css';
import '@/css/products.css';


const Blog = () => {
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

  const categories = [
    { key: 'Dairy', value: t('blog.categories.items.Dairy') },
    { key: 'IceCream', value: t('blog.categories.items.IceCream') },
    { key: 'Pastry', value: t('blog.categories.items.Pastry') },
    { key: 'Bakery', value: t('blog.categories.items.Bakery') },
    { key: 'Packaging', value: t('blog.categories.items.Packaging') },
    { key: 'Equipment', value: t('blog.categories.items.Equipment') },
    { key: 'Other', value: t('blog.categories.items.Other') },
  ];

  return (
    <div>
      <Head>
        <title>{t('blog.helmetTitle')}</title>
      </Head>
      <div
        className="hero-container hero-container-blog"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }}
      >
        <div className="hero-content">
          <h1 className="hero-title-h1">{t('blog.hero.heading')}</h1>
          <p className="hero-description">{t('blog.hero.description')}</p>
          <Link href="/contact" className="btn btn-primary">
            {t('blog.hero.contactButton')}
          </Link>
        </div>
      </div>
      <div className="blog-title">
        <h1>{t('blog.intro.heading')}</h1>
        <p>{t('blog.intro.description')}</p>
      </div>
      <section data-aos="fade-up" className="container blog-categories-section">
        <ul className="blog-categories">
          {categories.map(({ key, value }) => (
            <li key={key} className="btn btn-secondary">
              <Link href={`/blog/posts/categories/${key}`}>{value}</Link>
            </li>
          ))}
        </ul>
      </section>
      <Posts limit={6} />
      <section data-aos="fade-up" className="blog-authors-section">
        <Authors />
      </section>
    </div>
  );
};

export default Blog;