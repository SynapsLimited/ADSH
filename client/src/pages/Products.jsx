// src/components/Products.jsx

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './../css/products.css';

function Products() {
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

  const products = [
    {
      category: 'Dairy',
      name: t('productsPage.section.productsCards.Dairy.name'),
      imageUrl: '/assets/Homepage - Hero.jpg',
      link: '/products/category/Dairy',
    },
    {
      category: 'IceCream',
      name: t('productsPage.section.productsCards.IceCream.name'),
      imageUrl: '/assets/Product - Ice Cream.jpg',
      link: '/products/category/Ice Cream',
    },
    {
      category: 'Pastry',
      name: t('productsPage.section.productsCards.Pastry.name'),
      imageUrl: '/assets/Product - Pastry.jpg',
      link: '/products/category/Pastry',
    },
    {
      category: 'Bakery',
      name: t('productsPage.section.productsCards.Bakery.name'),
      imageUrl: '/assets/Product - Bakery.jpg',
      link: '/products/category/Bakery',
    },
    {
      category: 'Packaging',
      name: t('productsPage.section.productsCards.Packaging.name'),
      imageUrl: '/assets/Product - Packaging.jpg',
      link: '/products/category/Packaging',
    },
    {
      category: 'DriedFruits',
      name: t('productsPage.section.productsCards.DriedFruits.name'),
      imageUrl: '/assets/Product - Nuts.jpg',
      link: '/products/category/Dried Fruits',
    },
    {
      category: 'Equipment',
      name: t('productsPage.section.productsCards.Equipment.name'),
      imageUrl: '/assets/Product - Equipment.jpg',
      link: '/products/category/Equipment',
    },
    {
      // No category for "All Products"
      name: t('productsPage.section.productsCards.allProducts.name'),
      imageUrl: '/assets/About - Hero.jpg',
      link: '/full-catalog',
    },
  ];

  return (
    <div>
      <Helmet>
        <title>{t('productsPage.helmetTitle')}</title>
      </Helmet>
      {/* Hero Section */}
      <div
        className="hero-container hero-container-products"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Adjusted for subtle parallax
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">{t('productsPage.hero.heading')}</h1>
          <p className="hero-description">
            {t('productsPage.hero.description')}
          </p>

          {/* Contact Button */}
          <Link to="/contact" className="btn btn-primary">{t('productsPage.hero.contactButton')}</Link>
        </div>
      </div>

      <section data-aos="fade-up" className="container products-section">
        <span>{t('productsPage.section.catalog')}</span>
        <h2>{t('productsPage.section.heading')}</h2>
        <p>{t('productsPage.section.description')}</p>
        <span className="bg-watermark">{t('productsPage.section.watermark')}</span>
        <div className="products-cards">
          {products.map((product, index) => (
            <div className="products-card" key={index}>
              <img src={product.imageUrl} alt={product.name} loading="lazy" />
              <div className="products-card-content">
                <h3>{product.name}</h3>
                <Link to={product.link} className="btn btn-primary">
                  {/* Use category for translation if available, else use 'allProducts' */}
                  {product.category
                    ? t(`productsPage.section.productsCards.${product.category}.button`)
                    : t('productsPage.section.productsCards.allProducts.button')}
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
