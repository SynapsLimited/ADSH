// src/components/DeleteProduct.jsx

import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const DeleteProduct = ({ slug: propSlug }) => {
  const { slug: paramSlug } = useParams();
  const slug = propSlug || paramSlug; // Use propSlug if provided, else get from URL params

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const removeProduct = async () => {
    if (!slug) {
      console.error('Product slug is undefined.');
      toast.error(t("Couldn't delete product."));
      return;
    }

    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/products/${slug}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        console.log(t('Product deleted successfully.'));
        toast.success(t('Product deleted successfully.'));
        navigate('/products-dashboard');
      }
    } catch (error) {
      console.log(t("Couldn't delete product."), error);
      toast.error(t("Couldn't delete product."));
    }
  };

  return (
    <button
      className="btn btn-secondary"
      style={{ fontFamily: 'Righteous, sans-serif' }}
      onClick={removeProduct}
    >
      {t('delete')}
    </button>
  );
};

export default DeleteProduct;
