// src/components/DeletePost.jsx

import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const DeletePost = ({ postId: id }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const removePost = async () => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        console.log(t('deletePost.successDelete'));
        navigate('/blog'); // Redirect to the blog or posts page
      }
    } catch (error) {
      console.log(t('deletePost.error'), error);
    }
  };

  return (
    <button className='btn btn-secondary' style={{ fontFamily: 'Righteous, sans-serif' }} onClick={removePost}>
      {t('deletePost.delete')}
    </button>
  );
};

export default DeletePost;
