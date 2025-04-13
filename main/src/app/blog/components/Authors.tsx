'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';

const Authors = () => {
  const { t } = useTranslation();
  const [authors, setAuthors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultAvatar = '/assets/Avatar-default.png';

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users`);
        setAuthors(response.data || []);
      } catch (error: any) {
        console.error('Error fetching authors:', error.response?.status, error.message);
        setError(t('authors.fetchError'));
      }
      setIsLoading(false);
    };
    getAuthors();
  }, [t]);

  if (isLoading) return <Loader />;
  if (error) return <h2 className="error-blog-not-found">{error}</h2>;

  return (
    <section data-aos="fade-up" className="authors">
      <div className="blog-title">
        <h1>{t('authors.title')}</h1>
      </div>
      {authors.length > 0 ? (
        <div className="authors-container">
          {authors.map(({ _id: id, avatar, name, posts }) => (
            <Link key={id} href={`/blog/posts/users/${id}`} className="author">
              <div className="author-avatar">
                <img src={avatar || defaultAvatar} alt={t('authors.avatarAlt', { name })} />
              </div>
              <div className="author-info">
                <h4>{name}</h4>
                <p>
                  {posts} {posts === 1 ? t('authors.post') : t('authors.posts')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2 className="error-blog-not-found">{t('authors.noAuthors')}</h2>
      )}
    </section>
  );
};

export default Authors;