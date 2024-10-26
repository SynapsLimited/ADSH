// src/components/Blog.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Posts from './../components/Posts';
import Authors from './../blog/Authors';

function Blog() {
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
    { key: 'Dairy', value: 'Bulmetore' },
    { key: 'Ice Cream', value: 'Akullore' },
    { key: 'Pastry', value: 'Pastiçeri' },
    { key: 'Bakery', value: 'Furra' },
    { key: 'Packaging', value: 'Paketime' },
    { key: 'Equipment', value: 'Pajisje' },
    { key: 'Other', value: 'Të tjera' },
  ];

  return (
    <div>
      <Helmet>
        <title>ADSH - Artikujt</title>
      </Helmet>
      
      {/* Hero Section */}
      <div
        className="hero-container hero-container-blog"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">Artikujt</h1>
          <p className="hero-description">
            Qëndroni të informuar me trendet më të fundit, këshillat, dhe njohuritë në bulmetore, akullore, furra dhe më shumë.
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">Kontakto</a>
        </div>
      </div>

      {/* Blog Intro */}
      <div className="blog-title">
        <h1>Mirë se vini në Blogun tonë</h1>
        <p>Shfletoni artikuj, lajme, dhe përditësime rreth produkteve tona, shërbimeve, dhe njohurive të industrisë.</p>
      </div>

      {/* Blog Categories Section */}
      <section data-aos="fade-up" className="container blog-categories-section">
        <div className="blog-title">
          <h1>Kategori</h1>
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
