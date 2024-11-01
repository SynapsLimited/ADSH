// src/components/FullCatalog.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './../css/products.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SearchBar from './SearchBar';
import { useTranslation } from 'react-i18next';

const FullCatalog = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
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
    Packaging: { sq: 'Paketime', en: 'Packaging' },
    Dried Fruits: { sq: 'Fruta të thata', en: 'Dried Fruits' },
    Equipment: { sq: 'Pajisje', en: 'Equipment' },
    'All Products': { sq: 'Të gjitha produktet', en: 'All Products' },
  };

  // Helper function to normalize text
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ë/g, 'e');
  };

  // Fetch all products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/products`
        );
        const data = await response.json();

        const sortedProducts = data.sort((a, b) => {
          const nameA =
            currentLanguage === 'en' ? a.name_en || a.name : a.name;
          const nameB =
            currentLanguage === 'en' ? b.name_en || b.name : b.name;

          const nameCompare = nameA.localeCompare(nameB);
          if (nameCompare !== 0) {
            return nameCompare;
          } else {
            const variationsA =
              currentLanguage === 'en'
                ? a.variations_en || a.variations
                : a.variations;
            const variationsB =
              currentLanguage === 'en'
                ? b.variations_en || b.variations
                : b.variations;

            const variationA = variationsA[0] || '';
            const variationB = variationsB[0] || '';

            return variationA.localeCompare(variationB);
          }
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
      const normalizedSearchQuery = normalizeText(searchQuery);

      const filtered = products.filter((product) => {
        const name =
          currentLanguage === 'en' ? product.name_en || product.name : product.name;
        const variations =
          currentLanguage === 'en'
            ? product.variations_en || product.variations
            : product.variations;

        // Combine name and variations into a single array
        const searchFields = [
          normalizeText(name),
          ...variations.map((v) => normalizeText(v)),
        ];

        // Check if any field includes the normalized search query
        return searchFields.some((field) =>
          field.includes(normalizedSearchQuery)
        );
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products, currentLanguage]);

  // Track scroll position for parallax effect
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
  const suggestions = [];

  if (searchQuery.trim()) {
    const normalizedSearchQuery = normalizeText(searchQuery);

    products.forEach((product) => {
      const name =
        currentLanguage === 'en' ? product.name_en || product.name : product.name;
      const variations =
        currentLanguage === 'en'
          ? product.variations_en || product.variations
          : product.variations;

      const normalizedName = normalizeText(name);
      const normalizedVariations = variations.map((v) => normalizeText(v));

      const nameMatches = normalizedName.includes(normalizedSearchQuery);
      const matchingVariations = variations.filter((variation, index) =>
        normalizedVariations[index].includes(normalizedSearchQuery)
      );

      if (nameMatches && matchingVariations.length > 0) {
        matchingVariations.forEach((variation) => {
          suggestions.push({
            product,
            displayText: `${name} - ${variation}`,
          });
        });
      } else if (nameMatches) {
        suggestions.push({
          product,
          displayText: name,
        });
      } else if (matchingVariations.length > 0) {
        matchingVariations.forEach((variation) => {
          suggestions.push({
            product,
            displayText: `${name} - ${variation}`,
          });
        });
      }
    });
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    navigate(`/products/${suggestion.product._id}`);
  };

  // Helper function to truncate description
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
        className="hero-container hero-container-products-all"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }}
      >
        <div className="hero-content">
          <h1 className="hero-title-h1">
            {currentLanguage === 'en' ? 'All Products' : 'Të Gjitha Produktet'}
          </h1>
          <p className="hero-description">
            {currentLanguage === 'en'
              ? 'Discover our full range of products in all categories.'
              : 'Zbuloni gamën tonë të plotë të produkteve në të gjitha kategoritë.'}
          </p>
          <a href="/contact" className="btn btn-primary">
            {currentLanguage === 'en' ? 'Contact' : 'Kontakto'}
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
                to={`/products/category/${key}`}
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
      <div
        style={{ textAlign: 'center', marginBottom: '0px', marginTop: '40px' }}
      >
        <Link to={`/download-catalog`} className="btn btn-primary">
          {currentLanguage === 'en'
            ? 'Download Full Catalog'
            : 'Shkarko katalogun e plotë'}
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
              const name =
                currentLanguage === 'en'
                  ? product.name_en || product.name
                  : product.name;
              const description =
                currentLanguage === 'en'
                  ? product.description_en || product.description
                  : product.description;
              const variations =
                currentLanguage === 'en'
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
                    {/* Variations */}
                    {variations.length > 0 && (
                      <h4>{variations.join(', ')}</h4>
                    )}
                    {/* Truncated Description */}
                    <p>{truncateDescription(description, 20)}</p>
                    <Link
                      to={`/products/${product._id}`}
                      className="btn btn-secondary"
                    >
                      {currentLanguage === 'en'
                        ? 'View Details'
                        : 'Shiko Detajet'}
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p>
              {currentLanguage === 'en'
                ? 'No products found.'
                : 'Nuk u gjetën produkte.'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default FullCatalog;
