'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PostItem from '@/blog/components/PostItem';
import Loader from '@/components/Loader';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '@/css/blog.css';

type Category = 'Dairy' | 'Ice Cream' | 'Pastry' | 'Bakery' | 'Packaging' | 'Equipment' | 'Other';

interface Post {
  _id: string;
  thumbnail?: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  creator: { _id: string; name: string; avatar?: string }; // Updated to match PostItemProps
  createdAt: string;
  category: Category;
}

const CategoryPosts = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const category = params.category as Category;

  const categoryKeyMap: Record<Category, string> = {
    Dairy: 'categoryPosts.category_Dairy',
    'Ice Cream': 'categoryPosts.category_Ice_Cream',
    Pastry: 'categoryPosts.category_Pastry',
    Bakery: 'categoryPosts.category_Bakery',
    Packaging: 'categoryPosts.category_Packaging',
    Equipment: 'categoryPosts.category_Equipment',
    Other: 'categoryPosts.category_Other',
  };

  const categoryDisplayName = t(categoryKeyMap[category] || 'categoryPosts.category_Other');

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/posts/categories/${category}`
        );
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: Expected an array');
        }
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        if (axios.isAxiosError(err)) {
          console.log('Error response:', err.response?.data);
          setError(
            err.response?.status === 404
              ? t('categoryPosts.noPosts')
              : `${t('categoryPosts.errorFetchingPosts')}: ${err.response?.data?.message || err.message}`
          );
        } else {
          setError(t('categoryPosts.errorFetchingPosts'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (category) {
      fetchPosts();
    } else {
      setError(t('categoryPosts.invalidCategory'));
      setIsLoading(false);
    }
  }, [category, t]);

  if (isLoading) return <Loader />;

  return (
    <section data-aos="fade-up" className="posts">
      <div className="blog-title-filtered">
        <h1>{categoryDisplayName}</h1>
      </div>
      {error ? (
        <h1 className="error-blog-not-found">{error}</h1>
      ) : posts.length > 0 ? (
        <div className="container posts-container">
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <h1 className="error-blog-not-found">{t('categoryPosts.noPosts')}</h1>
      )}
      <section data-aos="fade-up" className="container blog-categories-section">
        <div className="blog-title">
          <h1>{t('categoryPosts.categoriesTitle')}</h1>
        </div>
        <ul className="blog-categories">
          {Object.keys(categoryKeyMap).map((key) => (
            <li key={key} className="btn btn-secondary">
              <Link href={`/blog/posts/categories/${key}`}>
                {t(categoryKeyMap[key as Category])}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};

export default CategoryPosts;