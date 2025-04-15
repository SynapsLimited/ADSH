// pages/blog/posts/[id].js
'use client';

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PostAuthor from '@/blog/components/PostAuthor';
import Loader from '@/components/Loader';
import DeletePost from '@/blog/components/DeletePost';
import { useUserContext } from '@/context/userContext';
import publicApi from '@/api/lib/publicApi'; // Import the public Axios instance
import { useTranslation } from 'react-i18next';
import '@/css/blog.css';

interface Post {
  _id: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  thumbnail: string;
  creator: { _id: string } | string;
  createdAt: string;
}

const PostDetail = () => {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useUserContext();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await publicApi.get(`/posts/${id}`); // Use publicApi instead of axios
        if (response.data) {
          setPost(response.data);
        } else {
          setError(t('postDetail.postNotFound'));
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        setError(t('postDetail.postNotFound'));
      } finally {
        setIsLoading(false);
      }
    };
    getPost();
  }, [id, t]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>{t('loading')} | ADSH Blog</title>
          <meta name="robots" content="index, follow" />
        </Head>
        <Loader />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
          <title>{t('postDetail.postNotFound')} | ADSH Blog</title>
        </Head>
        <p className="error">{t('postDetail.postNotFound')}</p>
      </>
    );
  }

  const defaultThumbnail = '/assets/Blog-default.webp';
  const title = currentLanguage === 'en' ? post.title_en || post.title : post.title;
  const description = currentLanguage === 'en' ? post.description_en || post.description : post.description;
  const canonicalUrl = `https://www.adsh2014.al/posts/${post._id}`;
  const ogImage = post.thumbnail || defaultThumbnail;

  // Determine if the current user is the creator for edit/delete permissions
  const isCreator = currentUser?._id === (typeof post.creator === 'string' ? post.creator : post.creator._id);

  return (
    <div className="post-detail-section">
      <Head>
        <title>{title} | ADSH Blog</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Head>
      <section data-aos="fade-up" className="container post-detail">
        {post && post.creator ? (
          <div className="post-detail-container">
            <div className="post-detail-header">
              <PostAuthor
                authorID={typeof post.creator === 'string' ? post.creator : post.creator._id}
                createdAt={post.createdAt}
              />
              {isCreator && (
                <div className="post-detail-buttons">
                  <Link href={`/blog/posts/${post._id}/edit`} className="btn btn-primary">
                    {t('postDetail.edit')}
                  </Link>
                  <DeletePost postId={post._id} />
                </div>
              )}
            </div>
            <h1>{title}</h1>
            <div className="post-detail-thumbnail">
              <img src={ogImage} alt={title} />
            </div>
            <p dangerouslySetInnerHTML={{ __html: description }} />
          </div>
        ) : (
          <p className="error">{t('postDetail.authorNotFound')}</p>
        )}
        <Link href="/blog" className="btn btn-secondary post-detail-btn">
          {t('postDetail.backToArticles')}
        </Link>
      </section>
    </div>
  );
};

export default PostDetail;