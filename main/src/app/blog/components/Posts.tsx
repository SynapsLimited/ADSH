'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PostItem from './PostItem';
import Loader from '@/components/Loader';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '@/css/blog.css';


interface PostsProps {
  limit?: number;
}

const Posts = ({ limit }: PostsProps) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/posts`);
        setPosts(response?.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) return <Loader />;

  const displayedPosts = limit ? posts.slice(0, limit) : posts;

  return (
    <section data-aos="fade-up" className="posts">
      {displayedPosts.length > 0 ? (
        <div className="container posts-container">
          {displayedPosts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <h1 className="error-blog-not-found">{t('posts.noPostsFound')}</h1>
      )}
      {limit && posts.length > limit && (
        <div className="read-more-container">
          <Link href="blog/posts" className="btn btn-secondary">
            {t('posts.readMore')}
          </Link>
        </div>
      )}
    </section>
  );
};

export default Posts;