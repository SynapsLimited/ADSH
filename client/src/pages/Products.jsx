import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './../css/products.css';

import dairyImage from './../assets/About - Hero.jpg';
import iceCreamImage from './../assets/Blog - Hero.jpg';
import PastryImage from './../assets/Contact - Hero.jpg';
import bakeryImage from './../assets/Products - Hero.jpg'; 
import packagingImage from './../assets/About - Hero.jpg';

function Products() {
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

  const products = [
    {
      name: 'Dairy',
      imageUrl: dairyImage,
      link: '/products/category/Dairy',
    },
    {
      name: 'Ice Cream',
      imageUrl: iceCreamImage,
      link: '/products/category/Ice Cream',
    },
    {
      name: 'Pastry',
      imageUrl: PastryImage,
      link: '/products/category/Pastry',
    },
    {
      name: 'Bakery',
      imageUrl: bakeryImage,
      link: '/products/category/Bakery',
    },
    {
      name: 'Packaging',
      imageUrl: packagingImage,
      link: '/products/category/Packaging',
    },

    {
      name: 'All Products',
      imageUrl: packagingImage,
      link: '/full-catalog',
    },
  ];

  return (
    <div>
      <Helmet>
        <title>ADSH - Products</title>
      </Helmet>
      {/* Hero Section */}
      <div
        className="hero-container-products"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Adjusted for subtle parallax
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">Products</h1>
          <p className="hero-description">
            Lorem ipsum dolor sit amet consectetur. Maecenas mollis mus ut risus at aenean dignissim. Patea tempor vitae suspendisse pellentesque.
          </p>

          {/* Contact Button */}
          <Link to="/contact" className="btn btn-primary">Contact</Link>
        </div>
      </div>

      <section data-aos="fade-up" className="container products-section">
        <span>Our</span>
        <h2>Products</h2>
        <p>Discover our range of delicious products.</p>
        <span className="bg-watermark">products</span>
        <div className="products-cards">
          {products.map((product, index) => (
            <div className="products-card" key={index}>
              <img src={product.imageUrl} alt={product.name} loading="lazy" />
              <div className="products-card-content">
                <h3>{product.name}</h3>
                <Link to={product.link} className="btn btn-primary">
                  {product.name} Catalog
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  );
}

export default Products;
