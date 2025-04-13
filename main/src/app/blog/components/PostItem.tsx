'use client';

import React from 'react';
import Link from 'next/link';
import PostAuthor from './PostAuthor';
import { useTranslation } from 'react-i18next';
import '@/css/blog.css';

type Category =
  | 'Dairy'
  | 'Ice Cream'
  | 'Pastry'
  | 'Bakery'
  | 'Packaging'
  | 'Dried Fruits'
  | 'Equipment'
  | 'Other'
  | 'All Products';

interface PostItemProps {
  post: {
    _id: string;
    thumbnail?: string;
    title: string;
    title_en?: string;
    description: string;
    description_en?: string;
    creator: { _id: string; name: string; avatar?: string }; // Updated to reflect populated object
    createdAt: string;
    category: Category;
  };
}

const categoryTranslationMap: Record<Category, { sq: string; en: string }> = {
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

const PostItem = ({ post }: PostItemProps) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as 'sq' | 'en';

  const title = currentLanguage === 'en' ? post.title_en || post.title : post.title;
  const description =
    currentLanguage === 'en' ? post.description_en || post.description : post.description;
  const shortDescription =
    description.length > 145 ? description.substr(0, 145) + '...' : description;
  const postTitle = title.length > 30 ? title.substr(0, 30) + '...' : title;
  const defaultThumbnail = '/assets/Blog-default.webp';

  return (
    <article className="post">
      <div className="post-thumbnail">
        <img src={post.thumbnail || defaultThumbnail} alt={title} />
      </div>
      <div className="post-content">
        <Link href={`/blog/posts/${post._id}`}>
          <h3>{postTitle}</h3>
        </Link>
        <p className="blog-text" dangerouslySetInnerHTML={{ __html: shortDescription }} />
        <div className="post-footer">
          <PostAuthor authorID={post.creator._id} createdAt={post.createdAt} />
          <Link
            href={`/blog/posts/categories/${post.category}`}
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