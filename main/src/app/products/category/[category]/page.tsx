'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SearchBar from '@/components/SearchBar';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
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

const normalizeCategory = (slug: string): string =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const ProductCatalog: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'sq' | 'en';
  const normalizedCategory = category ? normalizeCategory(category) : '';
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categoryClassMap: Record<string, string> = {
    Dairy: 'hero-container hero-container-products-dairy',
    'Ice Cream': 'hero-container hero-container-products-ice-cream',
    Pastry: 'hero-container hero-container-products-pastry',
    Bakery: 'hero-container hero-container-products-bakery',
    Packaging: 'hero-container hero-container-products-packaging',
    Equipment: 'hero-container hero-container-products-equipment',
    'All Products': 'hero-container hero-container-products-all',
  };

  const categoryTranslationMap: Record<string, { sq: string; en: string }> = {
    Dairy: { sq: 'Bulmetore', en: 'Dairy' },
    'Ice Cream': { sq: 'Akullore', en: 'Ice Cream' },
    Pastry: { sq: 'Pastiçeri', en: 'Pastry' },
    Bakery: { sq: 'Furra', en: 'Bakery' },
    Packaging: { sq: 'Ambalazhe', en: 'Packaging' },
    Equipment: { sq: 'Pajisje', en: 'Equipment' },
    'All Products': { sq: 'Të gjitha produktet', en: 'All Products' },
  };

  const heroClassName = categoryClassMap[normalizedCategory] || 'hero-container-products';
  const categoryDisplayName = categoryTranslationMap[normalizedCategory]?.[currentLanguage] || normalizedCategory;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        const data = await response.json();
        const filtered = data.filter(
          (product: any) => product.category.toLowerCase() === normalizedCategory.toLowerCase()
        );
        const sortedProducts = filtered.sort((a: any, b: any) => {
          const nameA = currentLanguage === 'en' ? a.name_en || a.name : a.name;
          const nameB = currentLanguage === 'en' ? b.name_en || b.name : b.name;
          const nameCompare = nameA.localeCompare(nameB);
          if (nameCompare !== 0) return nameCompare;
          const variationsA = currentLanguage === 'en' ? a.variations_en || a.variations : a.variations;
          const variationsB = currentLanguage === 'en' ? b.variations_en || b.variations : b.variations;
          const variationA = variationsA[0] || '';
          const variationB = variationsB[0] || '';
          return variationA.localeCompare(variationB);
        });
        setProducts(sortedProducts);
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [normalizedCategory, currentLanguage]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
    } else {
      const normalizedSearchQuery = searchQuery.toLowerCase();
      const filtered = products.filter((product) => {
        const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
        const variations = currentLanguage === 'en' ? product.variations_en || product.variations : product.variations;
        const searchFields = [name.toLowerCase(), ...variations.map((v: string) => v.toLowerCase())];
        return searchFields.some((field) => field.includes(normalizedSearchQuery));
      });
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products, currentLanguage]);

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

  const suggestions = searchQuery.trim()
    ? products
        .map((product) => {
          const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
          const variations = currentLanguage === 'en' ? product.variations_en || product.variations : product.variations;
          const nameMatches = name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchingVariations = variations.filter((variation: string) =>
            variation.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (nameMatches) {
            return { product, displayText: name };
          } else if (matchingVariations.length > 0) {
            return matchingVariations.map((variation: string) => ({
              product,
              displayText: `${name} - ${variation}`,
            }));
          }
          return null;
        })
        .flat()
        .filter(Boolean)
    : [];

  const handleSuggestionClick = (suggestion: { product: any }) => {
    router.push(`/products/${suggestion.product.slug}`);
  };

  const truncateDescription = (text: string, wordLimit: number): string => {
    const words = text.split(' ');
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className={heroClassName} style={{ backgroundPositionY: `${scrollPosition * 0}px` }}>
        <div className="hero-content">
          <h1 className="hero-title-h1">{t('productCatalog.catalogFor')} {categoryDisplayName}</h1>
          <p className="hero-description">{t('productCatalog.discoverProducts', { categoryDisplayName })}</p>
          <Link href="/contact" className="btn btn-primary">
            {t('productCatalog.contact')}
          </Link>
        </div>
      </div>
      <div className="category-buttons">
        {Object.keys(categoryTranslationMap).map(
          (key) =>
            key !== 'All Products' && (
              <Link key={key} href={`/products/category/${slugify(key)}`} className="btn btn-primary">
                {categoryTranslationMap[key][currentLanguage]}
              </Link>
            )
        )}
        <Link href="/products/full-catalog" className="btn btn-primary">
          {categoryTranslationMap['All Products'][currentLanguage]}
        </Link>
      </div>
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <Link href={`/products/download-catalog/${slugify(normalizedCategory)}`} className="btn btn-primary">
          {t('productCatalog.downloadCatalogFor', { categoryDisplayName })}
        </Link>
      </div>
      <p className="center-p">{t('productCatalog.browseProducts', { categoryDisplayName })}</p>
      <SearchBar
        query={searchQuery}
        setQuery={setSearchQuery}
        suggestions={suggestions}
        onSuggestionClick={handleSuggestionClick}
      />
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
                        {product.images.map((image: string, index: number) => (
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
                    <Link href={`/products/${product.slug}`} className="btn btn-secondary">
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