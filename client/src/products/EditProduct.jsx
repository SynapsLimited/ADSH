// src/components/EditProduct.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify'; // Import toast

const EditProduct = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [variations, setVariations] = useState('');
  const [variationsEn, setVariationsEn] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [addTranslation, setAddTranslation] = useState(false);

  const navigate = useNavigate();
  const { slug } = useParams(); // Changed from 'id' to 'slug'

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const PRODUCT_CATEGORIES = ['Dairy', 'Ice Cream', 'Pastry', 'Bakery', 'Packaging', 'Dried Fruits', 'Equipment', 'Other'];

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/products/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const product = response.data;
        setName(product.name);
        setNameEn(product.name_en || '');
        setCategory(product.category);
        setDescription(product.description);
        setDescriptionEn(product.description_en || '');
        setVariations(product.variations.join(', '));
        setVariationsEn(product.variations_en ? product.variations_en.join(', ') : '');

        // If English translation exists, check the checkbox
        if (product.name_en || product.description_en || (product.variations_en && product.variations_en.length > 0)) {
          setAddTranslation(true);
        }
      } catch (error) {
        console.error(error);
        setError(t('productNotFound'));
      }
    };
    getProduct();
  }, [slug, token, t]);

  const editProduct = async (e) => {
    e.preventDefault();

    const productData = new FormData();
    productData.set('name', name);
    productData.set('category', category);
    productData.set('description', description);
    productData.set('variations', variations);

    if (addTranslation) {
      productData.set('name_en', nameEn);
      productData.set('description_en', descriptionEn);
      productData.set('variations_en', variationsEn);
    }

    // Append new images if any
    if (images.length > 0) {
      images.forEach((image) => {
        productData.append('images', image);
      });
    }

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/products/${slug}/edit`, productData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        toast.success(t('Product updated successfully.')); // Show success toast
        navigate('/products-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || t('An error occurred'));
      toast.error(err.response?.data?.message || t('An error occurred')); // Show error toast
      console.error(err);
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <section data-aos="fade-up" className="edit-product">
      <div className="container">
        <h2>{t('editProduct')}</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form className="form edit-product-form" onSubmit={editProduct}>
          <input
            type="text"
            placeholder={t('name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat}>{t(cat)}</option>
            ))}
          </select>
          <textarea
            placeholder={t('description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />
          <input
            type="text"
            placeholder={t('variations')}
            value={variations}
            onChange={(e) => setVariations(e.target.value)}
          />

          <div className='custom-checkbox-container'>
            <label>
              <input
                type="checkbox"
                checked={addTranslation}
                onChange={() => setAddTranslation(!addTranslation)}
              />
              {t('addTranslationInEnglish')}
            </label>
          </div>

          {addTranslation && (
            <>
              <input
                type="text"
                placeholder={t('nameInEnglish')}
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
              <textarea
                placeholder={t('descriptionInEnglish')}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={5}
              />
              <input
                type="text"
                placeholder={t('variationsInEnglish')}
                value={variationsEn}
                onChange={(e) => setVariationsEn(e.target.value)}
              />
            </>
          )}

          <div className="custom-file-input-container">
            <input
              className="custom-file-input"
              type="file"
              onChange={handleImageChange}
              accept="image/png, image/jpeg, image/webp"
              multiple
            />
          </div>
          <button type="submit" className="btn btn-primary btn-submit">
            {t('update')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditProduct;
