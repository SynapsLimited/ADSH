// src/components/CreateProduct.jsx

import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CreateProduct = () => {
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

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const PRODUCT_CATEGORIES = ['Dairy', 'Ice Cream', 'Pastry', 'Bakery', 'Packaging', 'Dried Fruits', 'Equipment', 'Other'];

  const createProduct = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setError(t('uploadAtLeastOneImage'));
      return;
    }

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

    // Append images to FormData
    images.forEach((image) => {
      productData.append('images', image);
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/products`, productData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 201) {
        navigate('/products-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || t('An error occurred'));
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <section data-aos="fade-up" className="create-product">
      <div className="container">
        <h2>{t('createProduct')}</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form className="form create-product-form" onSubmit={createProduct}>
          <input
            type="text"
            placeholder={t('name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat}>{t(cat)}</option>
            ))}
          </select>
          <textarea
            placeholder={t('description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
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
            {t('create')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateProduct;
