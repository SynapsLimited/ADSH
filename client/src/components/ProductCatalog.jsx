// src/components/ProductCatalog.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import productsData from '../productsData';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Helmet } from 'react-helmet-async';
import './../css/products.css';

function ProductCatalog() {
  const { category } = useParams();
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

  // Filter products by category
  const filteredProducts = productsData.filter(
    (product) => product.category.toLowerCase() === category.toLowerCase()
  );

  if (filteredProducts.length === 0) {
    return <p>No products found for this category.</p>;
  }

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true, // Add this line
    autoplaySpeed: 2000, // Add this line (2000 milliseconds = 2 seconds)
  };

  return (
    <div>
      <Helmet>
        <title>{`ADSH - ${category.charAt(0).toUpperCase() + category.slice(1)} Catalog`}</title>
      </Helmet>
      {/* Hero Section */}
      <div
        className="hero-container-products"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">{category.charAt(0).toUpperCase() + category.slice(1)} Products</h1>
          <p className="hero-description">
            Lorem ipsum dolor sit amet consectetur. Maecenas mollis mus ut risus at aenean dignissim. Patea tempor vitae suspendisse pellentesque.
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">Contact</a>
        </div>
      </div>

      <section className="container product-catalog-section">
        <p className="center-p">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates eum provident tenetur qui illo quidem nobis, laborum similique libero, totam ducimus quas veniam doloremque velit at maxime dicta rem officia nesciunt ullam rerum. Voluptatem praesentium placeat ab cum modi? Quisquam eaque ex dolores exercitationem accusantium ducimus praesentium officia provident optio quos recusandae veniam corporis et quo, eveniet molestias quia quam.
        </p>
        <div className="product-catalog-cards">
          {filteredProducts.map((product) => (
            <div className="product-catalog-card" key={product.id}>
              {/* Image Container */}
              <div className="product-image-container">
                {product.images.length > 1 ? (
                  <Slider {...sliderSettings}>
                    {product.images.map((image, index) => (
                      <img key={index} src={image} alt={product.name} />
                    ))}
                  </Slider>
                ) : (
                  <img src={product.images[0]} alt={product.name} />
                )}
              </div>
              <div className="product-catalog-card-content">
                <h3>{product.name}</h3>
                {/* Variations */}
                {product.variations.length > 0 && (
                  <h4>{product.variations.join(', ')}</h4>
                )}
                <p>{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProductCatalog;
