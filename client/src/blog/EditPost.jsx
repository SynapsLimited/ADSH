// src/pages/EditPost.jsx

import React, { useState, useEffect, useContext } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const EditPost = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [error, setError] = useState('');
  const [addTranslation, setAddTranslation] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  const POST_CATEGORIES = [
    'Uncategorized',
    'Dairy',
    'Ice Cream',
    'Bakery',
    'Pastry',
    'Packaging',
    'Dried Fruits',
    'Equipment',
    'Other',
  ];

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        const postData = response.data;
        setTitle(postData.title);
        setTitleEn(postData.title_en || '');
        setCategory(postData.category);
        setDescription(postData.description);
        setDescriptionEn(postData.description_en || '');

        // If English translation exists, check the checkbox
        if (postData.title_en || postData.description_en) {
          setAddTranslation(true);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [id]);

  const editPost = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.set('title', title);
    postData.set('category', category);
    postData.set('description', description);

    if (addTranslation) {
      postData.set('title_en', titleEn);
      postData.set('description_en', descriptionEn);
    }

    if (thumbnail) {
      postData.append('thumbnail', thumbnail);
    }

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        navigate('/blog');
      }
    } catch (err) {
      setError(t('editPost.error') + ': ' + err.response.data.message);
    }
  };

  return (
    <section data-aos="fade-up" className="create-post">
      <div className="container">
        <h2>{t('editPost.title')}</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form className="form create-post-form" onSubmit={editPost}>
          <input
            type="text"
            placeholder={t('createPost.titlePlaceholder')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {POST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t(`createPost.postCategories.${cat}`)}
              </option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
            placeholder={t('createPost.descriptionPlaceholder')}
          />

          <div className="custom-file-input-container">
            <input
              className="custom-file-input"
              type="file"
              onChange={(e) => setThumbnail(e.target.files[0])}
              accept="png, jpg, jpeg"
            />
          </div>

          <div className='custom-checkbox-container'>
            <label>
              <input
                type="checkbox"
                checked={addTranslation}
                onChange={() => setAddTranslation(!addTranslation)}
              />
              {t('createPost.addTranslation')}
            </label>
          </div>

          {addTranslation && (
            <>
              <input
                type="text"
                placeholder={t('createPost.titleEnPlaceholder')}
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
              />
              <ReactQuill
                modules={modules}
                formats={formats}
                value={descriptionEn}
                onChange={setDescriptionEn}
                placeholder={t('createPost.descriptionEnPlaceholder')}
              />
            </>
          )}

          <button type="submit" className="btn btn-primary btn-submit">
            {t('editPost.updateButton')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
