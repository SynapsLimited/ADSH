// src/components/FullCatalog.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../css/products.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SearchBar from '../components/SearchBar';
import { useTranslation } from 'react-i18next';

// Helper function to slugify text (e.g. "Ice Cream" -> "ice-cream")
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       
    .replace(/&/g, '-and-')     
    .replace(/[^\w\-]+/g, '')   
    .replace(/\-\-+/g, '-');    

const FullCatalog = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  // Mapping from English category names to translations
  const categoryTranslationMap = {
    Dairy: { sq: 'Bulmetore', en: 'Dairy' },
    'Ice Cream': { sq: 'Akullore', en: 'Ice Cream' },
    Pastry: { sq: 'Pastiçeri', en: 'Pastry' },
    Bakery: { sq: 'Furra', en: 'Bakery' },
    Packaging: { sq: 'Ambalazhe', en: 'Packaging' },
    'Dried Fruits': { sq: 'Fruta të thata', en: 'Dried Fruits' },
    Equipment: { sq: 'Pajisje', en: 'Equipment' },
    'All Products': { sq: 'Të gjitha produktet', en: 'All Products' },
  };

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        const data = await response.json();
        const sortedProducts = data.sort((a, b) => {
          const nameA = currentLanguage === 'en' ? a.name_en || a.name : a.name;
          const nameB = currentLanguage === 'en' ? b.name_en || b.name : b.name;
          const nameCompare = nameA.localeCompare(nameB);
          if (nameCompare !== 0) return nameCompare;
          const variationsA = currentLanguage === 'en'
            ? a.variations_en || a.variations
            : a.variations;
          const variationsB = currentLanguage === 'en'
            ? b.variations_en || b.variations
            : b.variations;
          const variationA = variationsA[0] || '';
          const variationB = variationsB[0] || '';
          return variationA.localeCompare(variationB);
        });
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [currentLanguage]);

  // Update filtered products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const normalizedSearchQuery = searchQuery.toLowerCase();
      const filtered = products.filter((product) => {
        const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
        const variations = currentLanguage === 'en'
          ? product.variations_en || product.variations
          : product.variations;
        const searchFields = [name.toLowerCase(), ...variations.map(v => v.toLowerCase())];
        return searchFields.some((field) => field.includes(normalizedSearchQuery));
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products, currentLanguage]);

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  const suggestions = [];

  if (searchQuery.trim()) {
    const normalizedSearchQuery = searchQuery.toLowerCase();
    products.forEach((product) => {
      const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
      const variations = currentLanguage === 'en'
        ? product.variations_en || product.variations
        : product.variations;
      const nameMatches = name.toLowerCase().includes(normalizedSearchQuery);
      const matchingVariations = variations.filter(variation =>
        variation.toLowerCase().includes(normalizedSearchQuery)
      );
      if (nameMatches) {
        suggestions.push({ product, displayText: name });
      } else if (matchingVariations.length > 0) {
        matchingVariations.forEach(variation => {
          suggestions.push({ product, displayText: `${name} - ${variation}` });
        });
      }
    });
  }

  // Use product slug (not _id) for navigation consistency
  const handleSuggestionClick = (suggestion) => {
    navigate(`/products/${suggestion.product.slug}`);
  };

  // Helper function to truncate description
  const truncateDescription = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero-container hero-container-products-all"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }}
      >
        <div className="hero-content">
          <h1 className="hero-title-h1">
            {t('fullCatalog.heroTitle')}
          </h1>
          <p className="hero-description">
            {t('fullCatalog.heroDescription')}
          </p>
          <a href="/contact" className="btn btn-primary">
            {t('fullCatalog.contact')}
          </a>
        </div>
      </div>

      {/* Category Navigation Buttons */}
      <div className="category-buttons">
        {Object.keys(categoryTranslationMap).map(
          (key) =>
            key !== 'All Products' && (
              <Link
                key={key}
                to={`/products/category/${slugify(key)}`}
                className="btn btn-primary"
              >
                {categoryTranslationMap[key][currentLanguage]}
              </Link>
            )
        )}
        <Link to="/full-catalog" className="btn btn-primary">
          {categoryTranslationMap['All Products'][currentLanguage]}
        </Link>
      </div>

      {/* Download Catalog Link */}
      <div style={{ textAlign: 'center', marginBottom: '0px', marginTop: '40px' }}>
        <Link to={`/download-catalog`} className="btn btn-primary">
          {t('fullCatalog.downloadCatalog')}
        </Link>
      </div>

      <p className="center-p">
        {currentLanguage === 'en'
          ? 'Browse our extensive catalog of products, sorted alphabetically for your convenience.'
          : 'Shfletoni katalogun tonë të gjerë të produkteve, të renditur alfabetikisht për komoditetin tuaj.'}
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
            filteredProducts.map((product) => {
              const name = currentLanguage === 'en'
                ? product.name_en || product.name
                : product.name;
              const description = currentLanguage === 'en'
                ? product.description_en || product.description
                : product.description;
              const variations = currentLanguage === 'en'
                ? product.variations_en || product.variations
                : product.variations;

              return (
                <div className="product-catalog-card" key={product._id}>
                  {/* Image Container */}
                  <div className="product-image-container">
                    {product.images.length > 1 ? (
                      <Slider {...sliderSettings}>
                        {product.images.map((image, index) => (
                          <img key={index} src={image} alt={name} />
                        ))}
                      </Slider>
                    ) : (
                      <img src={product.images[0]} alt={name} />
                    )}
                  </div>
                  <div className="product-catalog-card-content">
                    <h3>{name}</h3>
                    {variations.length > 0 && (
                      <h4>{variations.join(', ')}</h4>
                    )}
                    <p>{truncateDescription(description, 20)}</p>
                    <Link
                      to={`/products/${product.slug}`}
                      className="btn btn-secondary"
                    >
                      {t('common.viewDetails')}
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p>{t('fullCatalog.noProductsFound')}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default FullCatalog;
