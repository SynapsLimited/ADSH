import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './../css/products.css';
import SearchBar from './SearchBar';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

// Helper function to slugify text (e.g. "Ice Cream" -> "ice-cream")
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -

// Convert a URL slug back to title case (e.g. "ice-cream" -> "Ice Cream")
const normalizeCategory = (slug) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const ProductCatalog = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Convert URL slug to normalized category title
  const normalizedCategory = category ? normalizeCategory(category) : '';

  // Mapping from category names to hero CSS classes
  const categoryClassMap = {
    Dairy: 'hero-container hero-container-products-dairy',
    'Ice Cream': 'hero-container hero-container-products-ice-cream',
    Pastry: 'hero-container hero-container-products-pastry',
    Bakery: 'hero-container hero-container-products-bakery',
    Packaging: 'hero-container hero-container-products-packaging',
    'Dried Fruits': 'hero-container hero-container-products-nuts',
    Equipment: 'hero-container hero-container-products-equipment',
    'All Products': 'hero-container hero-container-products-all',
  };

  // Display name mapping for translations
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

  const heroClassName =
    categoryClassMap[normalizedCategory] || 'hero-container-products';
  const categoryDisplayName =
    categoryTranslationMap[normalizedCategory] !== undefined
      ? categoryTranslationMap[normalizedCategory][currentLanguage]
      : normalizedCategory;

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  // Fetch products from backend and filter by category (case-insensitive)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        const data = await response.json();
        // Filter by exact match of product.category with normalizedCategory (ignoring case)
        const filtered = data.filter(
          (product) =>
            product.category &&
            product.category.toLowerCase() === normalizedCategory.toLowerCase()
        );
        // Sort alphabetically by product name (using language fallback)
        const sortedProducts = filtered.sort((a, b) => {
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
        console.error(error);
      }
    };
    fetchProducts();
  }, [normalizedCategory, currentLanguage]);

  // Update filtered products when search query changes
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

  // Parallax scroll effect
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

  // Generate search suggestions
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

  const handleSuggestionClick = (suggestion) => {
    navigate(`/products/${suggestion.product.slug}`);
  };

  const truncateDescription = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
  };

  return (
    <div>
      <Helmet>
        <title>{`${t('productCatalog.catalogFor')} ${categoryDisplayName} | ADSH`}</title>
        <meta
          name="description"
          content={`Browse our extensive catalog of ${categoryDisplayName} products at Albanian Dairy & Supply Hub. Find high-quality ${categoryDisplayName} products curated just for you.`}
        />
      </Helmet>
      {/* Hero Section */}
      <div className={heroClassName} style={{ backgroundPositionY: `${scrollPosition * 0}px` }}>
        <div className="hero-content">
          <h1 className="hero-title-h1">
            {t('productCatalog.catalogFor')} {categoryDisplayName}
          </h1>
          <p className="hero-description">
            {t('productCatalog.discoverProducts', { categoryDisplayName })}
          </p>
          <a href="/contact" className="btn btn-primary">
            {t('productCatalog.contact')}
          </a>
        </div>
      </div>
      {/* Category Navigation Buttons */}
      <div className="category-buttons">
        {Object.keys(categoryTranslationMap).map((key) =>
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
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <Link to={`/download-catalog/${slugify(normalizedCategory)}`} className="btn btn-primary">
          {t('productCatalog.downloadCatalogFor', { categoryDisplayName })}
        </Link>
      </div>
      <p className="center-p">
        {t('productCatalog.browseProducts', { categoryDisplayName })}
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
              const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
              const description = currentLanguage === 'en'
                ? product.description_en || product.description
                : product.description;
              const variations = currentLanguage === 'en'
                ? product.variations_en || product.variations
                : product.variations;
              return (
                <div className="product-catalog-card" key={product._id}>
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
                    {variations.length > 0 && <h4>{variations.join(', ')}</h4>}
                    <p>{truncateDescription(description, 20)}</p>
                    <Link to={`/products/${product.slug}`} className="btn btn-secondary">
                      {t('common.viewDetails')}
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p>{t('productCatalog.noProductsFound')}</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductCatalog;
