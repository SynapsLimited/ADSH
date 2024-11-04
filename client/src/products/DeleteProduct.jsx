// src/components/DeleteProduct.jsx

import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const DeleteProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { slug } = useParams(); // Extract slug from URL
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const removeProduct = async () => {
    const confirmDeletion = window.confirm(
      t('Are you sure you want to delete this product? This action cannot be undone.')
    );

    if (!confirmDeletion) {
      return;
    }

    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/products/${slug}/delete`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        console.log(t('Product deleted successfully.'));
        alert(t('Product deleted successfully.'));
        navigate('/products-dashboard'); // Redirect after successful deletion
      }
    } catch (error) {
      console.error(t("Couldn't delete product."), error);
      alert(t("Couldn't delete product."));
    }
  };

  return (
    <div className="delete-product-container">
      <h2>{t('Are you sure you want to delete this product?')}</h2>
      <button
        className="btn btn-danger"
        style={{ fontFamily: 'Righteous, sans-serif', marginRight: '10px' }}
        onClick={removeProduct}
      >
        {t('Yes, Delete')}
      </button>
      <button
        className="btn btn-secondary"
        style={{ fontFamily: 'Righteous, sans-serif' }}
        onClick={() => navigate(-1)} // Navigate back to the previous page
      >
        {t('Cancel')}
      </button>
    </div>
  );
};

export default DeleteProduct;
