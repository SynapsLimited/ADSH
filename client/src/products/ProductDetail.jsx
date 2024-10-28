import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './../css/products.css';
import Loader from '../components/Loader';
import DeleteProduct from './DeleteProduct';
import { UserContext } from '../context/userContext';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Mapping from English category names to Albanian translations
const categoryTranslationMap = {
  "Dairy": "Bulmetore",
  "Ice Cream": "Akullore",
  "Pastry": "Pastiçeri",
  "Bakery": "Furra",
  "Packaging": "Paketime",
  "Nuts": "Fruta të thata",
  "Equipment": "Pajisje",
  "All Products": "Të gjitha produktet"
};

const ProductDetail = () => {
  const { id } = useParams();
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
          setError('Nuk u gjetën të dhëna të produktit.');
        }
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };
    getProduct();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!product) {
    return <p className="error">Produkti nuk u gjet.</p>;
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

  return (
    <div className="product-detail-section">
      <section data-aos="fade-up" className="container product-detail">
        <div className="product-detail-container">
          <div className="product-detail-header">
            <h1>{product.name}</h1>

            {/* Only show edit and delete buttons if the current user is the product creator */}
            {currentUser?.id === (product.creator._id || product.creator) && (
              <div className="product-detail-buttons">
                <Link to={`/products/${product._id}/edit`} className="btn btn-primary">
                  Ndrysho
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
                  <img key={index} src={image} alt={product.name} />
                ))}
              </Slider>
            ) : (
              <img src={product.images[0]} alt={product.name} />
            )}
          </div>

          {/* Product details */}
          <h3>Kategoria: {categoryTranslationMap[product.category] || product.category}</h3> {/* Use translated category name */}
          {product.variations.length > 0 && (
            <h4>Variacionet: {product.variations.join(', ')}</h4>
          )}
          <p>{product.description}</p>
        </div>

        {/* Back to products button */}
        <Link to="/full-catalog" className="btn btn-secondary product-detail-btn">
          Kthehu te Produktet
        </Link>
      </section>
    </div>
  );
};

export default ProductDetail;
