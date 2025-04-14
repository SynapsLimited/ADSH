'use client'

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import '@/css/products.css';

const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

const Products: React.FC = () => {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const products = [
    {
      category: 'Dairy',
      name: t('productsPage.section.productsCards.Dairy.name'),
      imageUrl: '/assets/Homepage - Hero.jpg',
      link: `/products/category/${slugify('Dairy')}`,
    },
    {
      category: 'Ice Cream',
      name: t('productsPage.section.productsCards.IceCream.name'),
      imageUrl: '/assets/Product - Ice Cream.jpg',
      link: `/products/category/${slugify('Ice Cream')}`,
    },
    {
      category: 'Pastry',
      name: t('productsPage.section.productsCards.Pastry.name'),
      imageUrl: '/assets/Product - Pastry.jpg',
      link: `/products/category/${slugify('Pastry')}`,
    },
    {
      category: 'Bakery',
      name: t('productsPage.section.productsCards.Bakery.name'),
      imageUrl: '/assets/Product - Bakery.jpg',
      link: `/products/category/${slugify('Bakery')}`,
    },
    {
      category: 'Packaging',
      name: t('productsPage.section.productsCards.Packaging.name'),
      imageUrl: '/assets/Product - Packaging.jpg',
      link: `/products/category/${slugify('Packaging')}`,
    },
    {
      category: 'Equipment',
      name: t('productsPage.section.productsCards.Equipment.name'),
      imageUrl: '/assets/Product - Equipment.jpg',
      link: `/products/category/${slugify('Equipment')}`,
    },
    {
      name: t('productsPage.section.productsCards.allProducts.name'),
      imageUrl: '/assets/About - Hero.jpg',
      link: '/products/full-catalog',
    },
  ];

  return (
    <div>
      <div
        className="hero-container hero-container-products"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }}
      >
        <div className="hero-content">
          <h1 className="hero-title-h1">{t('productsPage.hero.heading')}</h1>
          <p className="hero-description">{t('productsPage.hero.description')}</p>
          <Link href="/contact" className="btn btn-primary">
            {t('productsPage.hero.contactButton')}
          </Link>
        </div>
      </div>
      <section data-aos="fade-up" className="container products-section">
        <span>{t('productsPage.section.catalog')}</span>
        <h2>{t('productsPage.section.heading')}</h2>
        <p>{t('productsPage.section.description')}</p>
        <span className="bg-watermark">{t('productPage.section.watermark')}</span>
        <div className="products-cards">
          {products.map((product, index) => (
            <div className="products-card" key={index}>
              <img src={product.imageUrl} alt={product.name} loading="lazy" />
              <div className="products-card-content">
                <h3>{product.name}</h3>
                <Link href={product.link} className="btn btn-primary">
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
};

export default Products;