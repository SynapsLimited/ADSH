// src/components/ProductCatalog.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './../css/products.css';
import SearchBar from './SearchBar'; // Import the SearchBar component

const ProductCatalog = () => {
  const { category } = useParams(); // Get the category from the URL
  const navigate = useNavigate(); // For navigation after clicking a suggestion
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Products to display
  const [searchQuery, setSearchQuery] = useState(''); // Search input value
  const [scrollPosition, setScrollPosition] = useState(0);

  // Mapping from category to CSS class name
  const categoryClassMap = {
    "Dairy": "hero-container hero-container-products-dairy",
    "Ice Cream": "hero-container hero-container-products-ice-cream",
    "Pastry": "hero-container hero-container-products-pastry",
    "Bakery": "hero-container hero-container-products-bakery",
    "Packaging": "hero-container hero-container-products-packaging",
    "Equipment": "hero-container hero-container-products-equipment",
    "All Products": "hero-container hero-container-products-all"
  };

  // Mapping from English category names to Albanian translations
  const categoryTranslationMap = {
    "Dairy": "Bulmetore",
    "Ice Cream": "Akullore",
    "Pastry": "Pastiçeri",
    "Bakery": "Furra",
    "Packaging": "Paketime",
    "Equipment": "Pajisje",
    "All Products": "Të gjitha produktet"
  };

  // Normalize the category name to match the keys in the mapping
  const normalizedCategory = category
    .replace('-', ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const heroClassName =
    categoryClassMap[normalizedCategory] || 'hero-container-products';

  // Get the display name in Albanian
  const categoryDisplayName =
    categoryTranslationMap[normalizedCategory] || normalizedCategory;

  // Fetch products by category from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/products`
        );
        const data = await response.json();
        // Filter products by category using English category name
        const filtered = data.filter(
          (product) => product.category === normalizedCategory
        );
        // Sort products alphabetically by name
        const sortedProducts = filtered.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts); // Initialize with all products
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [category, normalizedCategory]);

  // Update filtered products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

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

  // Generate suggestions based on search query
  const suggestions = searchQuery.trim()
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    navigate(`/products/${product._id}`);
  };

  // Helper function to capitalize the first letter
  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Helper function to truncate description after 16 words
  const truncateDescription = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className={heroClassName}
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }}
      >
        <div className="hero-content">
          <h1 className="hero-title-h1">
            Produkte për {categoryDisplayName}
          </h1>
          <p className="hero-description">
            Zbuloni dhe shfletoni produktet tona për {categoryDisplayName.toLowerCase()}.
          </p>
          <a href="/contact" className="btn btn-primary">
            Kontakto
          </a>
        </div>
      </div>

      {/* Category Navigation Buttons */}
      <div className="category-buttons">
        <Link to="/products/category/Dairy" className="btn btn-primary">
          Bulmetore
        </Link>
        <Link to="/products/category/Ice Cream" className="btn btn-primary">
          Akullore
        </Link>
        <Link to="/products/category/Pastry" className="btn btn-primary">
          Pastiçeri
        </Link>
        <Link to="/products/category/Packaging" className="btn btn-primary">
          Paketime
        </Link>
        <Link to="/products/category/Bakery" className="btn btn-primary">
          Furra
        </Link>
        <Link to="/products/category/Equipment" className="btn btn-primary">
          Pajisje
        </Link>
        <Link to="/full-catalog" className="btn btn-primary">
          Të gjitha produktet
        </Link>
      </div>

      {/* Download Catalog Link */}
      <div
        style={{ textAlign: 'center', marginBottom: '0px', marginTop: '40px' }}
      >
        <Link to={`/download-catalog/${category}`} className="btn btn-primary">
          Shkarko katalog për {categoryDisplayName}
        </Link>
      </div>

      <p className="center-p">
        Shfletoni produktet tona për {categoryDisplayName.toLowerCase()}, të renditura alfabetikisht për komoditetin tuaj.
      </p>

      <SearchBar
        query={searchQuery}
        setQuery={setSearchQuery}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />

      {/* Product Catalog Section */}
      <section className="container product-catalog-section">
        <div className="product-catalog-cards">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
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
                  {/* Truncated Description */}
                  <p>{truncateDescription(product.description, 20)}</p>
                  <Link
                    to={`/products/${product._id}`}
                    className="btn btn-secondary"
                  >
                    Shiko Detajet
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Nuk u gjetën produkte në këtë kategori.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductCatalog;
