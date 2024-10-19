import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './../css/products.css';

const ProductCatalog = () => {
  const { category } = useParams(); // Get the category from the URL
  const [products, setProducts] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Fetch products by category from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        const data = await response.json();
        // Filter products by category
        const filteredProducts = data.filter((product) => product.category === category);
        // Sort products alphabetically by name
        const sortedProducts = filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(sortedProducts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [category]);

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

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero-container-products"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }}
      >
        <div className="hero-content">
          <h1 className="hero-title-h1">{category} Products</h1>
          <p className="hero-description">
            Discover our range of {category.toLowerCase()} products.
          </p>
          <a href="/contact" className="btn btn-primary">
            Contact
          </a>
        </div>
      </div>

      {/* Category Navigation Buttons */}
      <div className="category-buttons">
        <Link to="/products/category/Dairy" className="btn btn-primary">
          Dairy
        </Link>
        <Link to="/products/category/Ice Cream" className="btn btn-primary">
          Ice Cream
        </Link>
        <Link to="/products/category/Pastry" className="btn btn-primary">
          Pastry
        </Link>
        <Link to="/products/category/Packaging" className="btn btn-primary">
          Packaging
        </Link>
        <Link to="/products/category/Bakery" className="btn btn-primary">
          Bakery
        </Link>
      </div>

      {/* Product Catalog Section */}
      <section className="container product-catalog-section">
        <p className="center-p">
          Browse through our {category.toLowerCase()} products, sorted alphabetically for your convenience.
        </p>

        <div className="product-catalog-cards">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="product-catalog-card" key={product._id}>
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
                  <Link to={`/products/${product._id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No products found in this category.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductCatalog;
