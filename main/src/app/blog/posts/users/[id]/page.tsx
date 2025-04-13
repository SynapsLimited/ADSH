'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PostItem from '@/blog/components/PostItem';
import Authors from '@/blog/components/Authors';
import Loader from '@/components/Loader';
import axios from 'axios';
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

const AuthorPosts = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchAuthorName = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`);
        setAuthorName(response.data.name || 'Unknown Author');
      } catch (err) {
        console.error('Error fetching author name:', err);
        setAuthorName('Unknown Author');
      }
    };

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/users/${id}`);
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format: Expected an array');
        }
        setPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.status === 404
              ? t('authorPosts.noPosts')
              : `${t('authorPosts.errorFetchingPosts')}: ${err.response?.data?.message || err.message}`
          );
        } else {
          setError(t('authorPosts.errorFetchingPosts'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAuthorName();
      fetchPosts();
    } else {
      setError(t('authorPosts.invalidId'));
      setIsLoading(false);
    }
  }, [id, t]);

  if (isLoading) return <Loader />;

  return (
    <section data-aos="fade-up" className="posts">
      <div className="blog-title-filtered">
        <h1>{t('authorPosts.title', { authorName })}</h1>
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
        <h1 className="error-blog-not-found">{t('authorPosts.noPosts')}</h1>
      )}
      <Authors />
    </section>
  );
};

export default AuthorPosts;