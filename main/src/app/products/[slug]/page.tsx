'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Loader from '@/components/Loader';
import DeleteProduct from '@/products/components/DeleteProduct';
import { UserContext } from '@/context/userContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from 'react-i18next';
import '@/css/products.css';

const categoryTranslationMap: Record<string, { sq: string; en: string }> = {
  Dairy: { sq: 'Bulmetore', en: 'Dairy' },
  'Ice Cream': { sq: 'Akullore', en: 'Ice Cream' },
  Pastry: { sq: 'Pastiçeri', en: 'Pastry' },
  Bakery: { sq: 'Furra', en: 'Bakery' },
  Packaging: { sq: 'Ambalazhe', en: 'Packaging' },
  'Dried Fruits': { sq: 'Fruta të thata', en: 'Dried Fruits' },
  Equipment: { sq: 'Pajisje', en: 'Equipment' },
  Other: { sq: 'Të tjera', en: 'Other' },
  'All Products': { sq: 'Të gjitha produktet', en: 'All Products' },
};

const ProductDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const currentLanguage = i18n.language as 'sq' | 'en';
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const context = useContext(UserContext);
  const currentUser = context?.currentUser;

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!data) {
          throw new Error('No product data returned');
        }
        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product:', error.message);
        setError(t('productNotFound'));
      } finally {
        setIsLoading(false);
      }
    };
    getProduct();
  }, [slug, t]);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !product) {
    return <p className="error">{error || t('productNotFound')}</p>;
  }

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

  const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
  const description = currentLanguage === 'en'
    ? product.description_en || product.description
    : product.description;
  const variations = currentLanguage === 'en'
    ? product.variations_en || product.variations
    : product.variations;
  const categoryName = categoryTranslationMap[product.category]?.[currentLanguage] || product.category;

  return (
    <div className="product-detail-section">
      <section data-aos="fade-up" className="container product-detail">
        <div className="product-detail-container">
          <div className="product-detail-header">
            <h1>{name}</h1>
            {currentUser?.id === (product.creator?._id || product.creator) && (
              <div className="product-detail-buttons">
                <Link href={`/products/${product.slug}/edit`} className="btn btn-primary">
                  {t('edit')}
                </Link>
                <DeleteProduct slug={product.slug} />
              </div>
            )}
          </div>
          <div className="product-detail-images">
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
          <h3>{t('categoryLabel')}: {categoryName}</h3>
          {variations.length > 0 && (
            <h4>{t('variationsLabel')}: {variations.join(', ')}</h4>
          )}
          <p>{description}</p>
        </div>
        <Link href="/products/full-catalog" className="btn btn-secondary product-detail-btn">
          {t('backToProducts')}
        </Link>
      </section>
    </div>
  );
};

export default ProductDetail;