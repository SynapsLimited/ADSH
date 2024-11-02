// src/components/ProductDetail.jsx

import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './../css/products.css';
import Loader from '../components/Loader';
import DeleteProduct from './DeleteProduct';
import { UserContext } from '../context/userContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useTranslation } from 'react-i18next';

// Mapping from English category names to translations
const categoryTranslationMap = {
  Dairy: { sq: 'Bulmetore', en: 'Dairy' },
  'Ice Cream': { sq: 'Akullore', en: 'Ice Cream' },
  Pastry: { sq: 'Pastiçeri', en: 'Pastry' },
  Bakery: { sq: 'Furra', en: 'Bakery' },
  Packaging: { sq: 'Paketime', en: 'Packaging' },
  'Dried Fruits': { sq: 'Fruta të thata', en: 'Dried Fruits' },
  Equipment: { sq: 'Pajisje', en: 'Equipment' },
  Other: { sq: 'Të tjera', en: 'Other' },
  'All Products': { sq: 'Të gjitha produktet', en: 'All Products' }
};

const ProductDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const currentLanguage = i18n.language;

  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products/${id}`);
        const data = await response.json();
        if (data) {
          setProduct(data);
        } else {
          setError(t('productNotFound'));
        }
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };
    getProduct();
  }, [id, t]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!product) {
    return <p className="error">{t('productNotFound')}</p>;
  }

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

  // Get translations
  const name = currentLanguage === 'en' ? product.name_en || product.name : product.name;
  const description = currentLanguage === 'en' ? product.description_en || product.description : product.description;
  const variations =
    currentLanguage === 'en' ? product.variations_en || product.variations : product.variations;

  const categoryName =
    categoryTranslationMap[product.category][currentLanguage] || product.category;

  return (
    <div className="product-detail-section">
      <section data-aos="fade-up" className="container product-detail">
        <div className="product-detail-container">
          <div className="product-detail-header">
            <h1>{name}</h1>

            {/* Only show edit and delete buttons if the current user is the product creator */}
            {currentUser?.id === (product.creator._id || product.creator) && (
              <div className="product-detail-buttons">
                <Link to={`/products/${product._id}/edit`} className="btn btn-primary">
                  {t('edit')}
                </Link>
                <DeleteProduct productId={product._id} />
              </div>
            )}
          </div>

          {/* Product images */}
          <div className="product-detail-images">
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

          {/* Product details */}
          <h3>
            {t('categoryLabel')}: {categoryName}
          </h3>
          {variations.length > 0 && (
            <h4>
              {t('variationsLabel')}: {variations}
            </h4>
          )}
          <p>{description}</p>
        </div>

        {/* Back to products button */}
        <Link to="/full-catalog" className="btn btn-secondary product-detail-btn">
          {t('backToProducts')}
        </Link>
      </section>
    </div>
  );
};

export default ProductDetail;
