// src/components/DeleteProduct.jsx

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const DeleteProduct = ({ productId: id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  const removeProduct = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/products/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        console.log(t('Product deleted successfully.'));
        navigate('/products-dashboard');
      }
    } catch (error) {
      console.log(t("Couldn't delete product."), error);
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
