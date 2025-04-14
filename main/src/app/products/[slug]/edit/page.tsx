'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const EditProduct: React.FC = () => {
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
  const { slug } = useParams<{ slug: string }>();
  const { currentUser } = useUserContext();
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      router.push('/');
    }
  }, [token, router]);

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

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${slug}`, {
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
        if (
          product.name_en ||
          product.description_en ||
          (product.variations_en && product.variations_en.length > 0)
        ) {
          setAddTranslation(true);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(t('productNotFound'));
      }
    };
    if (slug && token) {
      getProduct();
    }
  }, [slug, token, t]);

  const editProduct = async (e: React.FormEvent) => {
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
    images.forEach((image) => productData.append('images', image));

    try {
      const response = await axios.patch(`/api/products/${slug}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        toast.success(t('Product updated successfully.'));
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