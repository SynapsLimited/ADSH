import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import './../css/products.css';


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
      name: 'Bulmetore',
      imageUrl: '/assets/Homepage - Hero.jpg', // Updated image source
      link: '/products/category/Dairy',
    },
    {
      name: 'Akullore',
      imageUrl: '/assets/Product - Ice Cream.jpg', // Updated image source
      link: '/products/category/Ice Cream',
    },
    {
      name: 'Pastiçeri',
      imageUrl: '/assets/Product - Pastry.jpg', // Updated image source
      link: '/products/category/Pastry',
    },
    {
      name: 'Furra',
      imageUrl: '/assets/Product - Bakery.jpg', // Updated image source
      link: '/products/category/Bakery',
    },
    {
      name: 'Paketime',
      imageUrl: '/assets/Product - Packaging.jpg', // Updated image source
      link: '/products/category/Packaging',
    },
    {
      name: 'Fruta të thata',
      imageUrl: '/assets/Product - Dried Fruits.jpg', // Updated image source
      link: '/products/category/Dried Fruits',
    },
    {
      name: 'Pajisje',
      imageUrl: '/assets/Product - Equipment.jpg', // Updated image source
      link: '/products/category/Equipment',
    },
    {
      name: 'Të gjitha produktet',
      imageUrl: '/assets/About - Hero.jpg', // Updated image source
      link: '/full-catalog',
    },
  ];

  return (
    <div>
      <Helmet>
        <title>ADSH - Produkte</title>
      </Helmet>
      {/* Hero Section */}
      <div
        className="hero-container hero-container-products"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Adjusted for subtle parallax
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">Produkte</h1>
          <p className="hero-description">
            ADSH ofron produkte në disa kategori të industrisë ushqimore.             
          </p>

          {/* Contact Button */}
          <Link to="/contact" className="btn btn-primary">Kontakto</Link>
        </div>
      </div>

      <section data-aos="fade-up" className="container products-section">
        <span>Katalog</span>
        <h2>Produktesh</h2>
        <p>Zbulo produktet tona ndërmjet katalogëve digjital të ndara në kategori për të përmirësuar eksperiencën tuaj përgjatë shfletimit të tyre.</p>
        <span className="bg-watermark">products</span>
        <div className="products-cards">
          {products.map((product, index) => (
            <div className="products-card" key={index}>
              <img src={product.imageUrl} alt={product.name} loading="lazy" />
              <div className="products-card-content">
                <h3>{product.name}</h3>
                <Link to={product.link} className="btn btn-primary">
                 Katalog për  {product.name}
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
