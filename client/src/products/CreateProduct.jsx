import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

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

  // Redirect to login if no token is present
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Product categories for the dropdown
  const PRODUCT_CATEGORIES = [
    'Dairy',
    'Ice Cream',
    'Pastry',
    'Bakery',
    'Packaging',
    'Dried Fruits',
    'Equipment',
    'Other',
  ];

  // Handle form submission to create a product
  const createProduct = async (e) => {
    e.preventDefault();

    // Validate that at least one image is uploaded
    if (images.length === 0) {
      setError(t('uploadAtLeastOneImage'));
      return;
    }

    // Construct FormData object
    const productData = new FormData();
    productData.append('name', name);
    productData.append('category', category);
    productData.append('description', description);
    productData.append('variations', variations);

    // Append English translations if enabled
    if (addTranslation) {
      productData.append('name_en', nameEn);
      productData.append('description_en', descriptionEn);
      productData.append('variations_en', variationsEn);
    }

    // Append each image to FormData
    images.forEach((image) => {
      productData.append('images', image);
    });

    // Log FormData entries for debugging
    console.log('Sending FormData:');
    for (let [key, value] of productData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      // Send POST request to the server
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/products`,
        productData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          }, // No 'Content-Type' header; Axios handles it
        }
      );

      // Handle successful creation
      if (response.status === 201) {
        toast.success(t('Product created successfully.'));
        navigate('/products-dashboard');
      }
    } catch (err) {
      // Handle errors with detailed feedback
      const errorMessage =
        err.response?.data?.message || t('An error occurred');
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle image file selection
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
            required
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
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
          <div className="custom-checkbox-container">
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
              required
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