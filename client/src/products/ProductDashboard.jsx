// src/components/ProductDashboard.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';
import DeleteProduct from './DeleteProduct';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify'; // Import toast

const ProductDashboard = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sample Product Creator
        if (response.data.length > 0) {
        }

        const userProducts = response.data.filter(
          (product) => {
            if (product.creator) {
              const creatorId = typeof product.creator === 'object' ? product.creator._id.toString() : product.creator.toString();
              const currentUserId = (currentUser.id || currentUser._id).toString();
              return creatorId === currentUserId;
            }
            return false;
          }
        );


        setProducts(userProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error(t('Failed to fetch products.')); // Show error toast
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [currentUser.id, currentUser._id, token, t]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section data-aos="fade-up" className="dashboard">
      <div className="blog-title-filtered">
        <h1>{t('productDashboard')}</h1>
      </div>

      {products.length ? (
        <div className="container dashboard-container">
          {products.map((product) => (
            <article key={product.slug} className="dashboard-post">
              <div className="dashboard-post-info">
                <div className="dashboard-post-thumbnail">
                  <img src={product.images[0]} alt={product.name} />
                </div>
                <h4>{product.name}</h4>
              </div>
              <div className="dashboard-post-actions">
                <Link to={`/products/${product.slug}`} className="btn btn-primary">
                  {t('view')}
                </Link>
                <Link to={`/products/${product.slug}/edit`} className="btn btn-primary">
                  {t('edit')}
                </Link>
                <DeleteProduct slug={product.slug} /> {/* Passed slug instead of productId */}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">{t('noProductsFound')}</h2>
      )}
    </section>
  );
};

export default ProductDashboard;
