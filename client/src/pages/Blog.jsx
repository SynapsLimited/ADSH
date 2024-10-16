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
    { key: 'Dairy', value: 'Dairy' },
    { key: 'Ice Cream', value: 'Ice Cream' },
    { key: 'Pastry', value: 'Pastry' },
    { key: 'Bakery', value: 'Bakery' },
    { key: 'Packaging', value: 'Packaging' },
    { key: 'Other', value: 'Other' },
  ];

  return (
    <div>
      <Helmet>
        <title>ADSH - Blog</title>
      </Helmet>
      
      {/* Hero Section */}
      <div
        className="hero-container-blog"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">Blog</h1>
          <p className="hero-description">
            Stay updated with the latest trends, tips, and insights in dairy, ice cream, bakery, and more.
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">Contact</a>
        </div>
      </div>

      {/* Blog Intro */}
      <div className="blog-title">
        <h1>Welcome to Our Blog</h1>
        <p>Explore articles, news, and updates about our products, services, and industry insights.</p>
      </div>

      {/* Blog Categories Section */}
      <section data-aos="fade-up" className="container blog-categories-section">
        <div className="blog-title">
          <h1>Categories</h1>
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
