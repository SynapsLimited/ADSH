'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext'; // Use the custom hook
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import '@/css/blog.css';
import '@/css/products.css';

const CreateProduct: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState<string>('');
  const [nameEn, setNameEn] = useState<string>('');
  const [category, setCategory] = useState<string>('Dairy');
  const [description, setDescription] = useState<string>('');
  const [descriptionEn, setDescriptionEn] = useState<string>('');
  const [variations, setVariations] = useState<string>('');
  const [variationsEn, setVariationsEn] = useState<string>('');
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [addTranslation, setAddTranslation] = useState<boolean>(false);
  const router = useRouter();
  const { currentUser } = useUserContext(); // Use the hook instead of useContext
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  const PRODUCT_CATEGORIES = ['Dairy', 'Ice Cream', 'Pastry', 'Bakery', 'Packaging', 'Equipment', 'Other'];

  const createProduct = async (e: React.FormEvent) => {
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
    images.forEach((image) => productData.append('images', image));

    try {
      const response = await axios.post('/api/products', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        toast.success(t('Product created successfully.'));
        router.push('/products/dashboard');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || t('An error occurred');
      setError(message);
      toast.error(message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
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
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t(cat)}
              </option>
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