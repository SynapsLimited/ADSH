// src/components/PostItem.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';
import { useTranslation } from 'react-i18next';

// Mapping from English category names to Albanian translations
const categoryTranslationMap = {
  Dairy: { sq: 'Bulmetore', en: 'Dairy' },
  'Ice Cream': { sq: 'Akullore', en: 'Ice Cream' },
  Pastry: { sq: 'Pastiçeri', en: 'Pastry' },
  Bakery: { sq: 'Furra', en: 'Bakery' },
  Packaging: { sq: 'Ambalazhe', en: 'Packaging' },
  'Dried Fruits': { sq: 'Fruta të thata', en: 'Dried Fruits' },
  Equipment: { sq: 'Pajisje', en: 'Equipment' },
  Other: { sq: 'Të tjera', en: 'Other' },
  'All Products': { sq: 'Të gjitha produktet', en: 'All Products' },
};

const PostItem = ({ post }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const title =
    currentLanguage === 'en' ? post.title_en || post.title : post.title;
  const description =
    currentLanguage === 'en' ? post.description_en || post.description : post.description;

  const shortDescription =
    description.length > 145 ? description.substr(0, 145) + '...' : description;
  const postTitle = title.length > 30 ? title.substr(0, 30) + '...' : title;

  const defaultThumbnail = `${process.env.PUBLIC_URL}/assets/Blog-default.webp`;

  return (
    <article className="post">
      <div className="post-thumbnail">
        <img src={post.thumbnail || defaultThumbnail} alt={title} />
      </div>
      <div className="post-content">
        <Link to={`/posts/${post._id}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p className="blog-text" dangerouslySetInnerHTML={{ __html: shortDescription }} />
        <div className="post-footer">
          <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
          <Link
            to={`/posts/categories/${post.category}`}
            className="btn btn-secondary btn-postitem"
          >
            {categoryTranslationMap[post.category][currentLanguage] || post.category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
