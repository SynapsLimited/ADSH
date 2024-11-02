// src/components/Blog.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Posts from './../components/Posts';
import Authors from './../blog/Authors';

function Blog() {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track scroll position to apply parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const categories = [
    { key: 'Dairy', value: t('blog.categories.items.Dairy') },
    { key: 'IceCream', value: t('blog.categories.items.IceCream') },
    { key: 'Pastry', value: t('blog.categories.items.Pastry') },
    { key: 'Bakery', value: t('blog.categories.items.Bakery') },
    { key: 'Packaging', value: t('blog.categories.items.Packaging') },
    { key: 'DriedFruits', value: t('blog.categories.items.DriedFruits') },
    { key: 'Equipment', value: t('blog.categories.items.Equipment') },
    { key: 'Other', value: t('blog.categories.items.Other') },
  ];

  return (
    <div>
      <Helmet>
        <title>{t('blog.helmetTitle')}</title>
      </Helmet>
      
      {/* Hero Section */}
      <div
        className="hero-container hero-container-blog"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">{t('blog.hero.heading')}</h1>
          <p className="hero-description">
            {t('blog.hero.description')}
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">{t('blog.hero.contactButton')}</a>
        </div>
      </div>

      {/* Blog Intro */}
      <div className="blog-title">
        <h1>{t('blog.intro.heading')}</h1>
        <p>{t('blog.intro.description')}</p>
      </div>

      {/* Blog Categories Section */}
      <section data-aos="fade-up" className="container blog-categories-section">
        <div className="blog-title">
          <h1>{t('blog.categories.heading')}</h1>
        </div>
        <ul className="blog-categories">
          {categories.map(({ key, value }) => (
            <li key={key} className="btn btn-secondary">
              <Link to={`/posts/categories/${key}`}>{value}</Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Blog Posts Section */}
      <Posts limit={6} />

      {/* Blog Authors Section */}
      <section data-aos="fade-up" className="blog-authors-section">
        <Authors />
      </section>
    </div>
  );
}

export default Blog;
