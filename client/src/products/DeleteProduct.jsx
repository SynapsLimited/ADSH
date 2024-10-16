// src/components/DeleteProduct.jsx

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';

const DeleteProduct = ({ productId: id }) => {
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
        console.log('Product deleted successfully.');
        navigate('/products-dashboard');
      }
    } catch (error) {
      console.log("Couldn't delete product.", error);
    }
  };

  return (
    <button
      className="btn btn-secondary"
      style={{ fontFamily: 'Righteous, sans-serif' }}
      onClick={removeProduct}
    >
      Delete
    </button>
  );
};

export default DeleteProduct;
