import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import './../css/blog.css';
import Loader from '../components/Loader';
import DeletePost from './DeletePost';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const PostDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const currentLanguage = i18n.language;

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        if (response.data) {
          setPost(response.data);
        } else {
          setError(t('postDetail.postNotFound'));
        }
      } catch (error) {
        setError(t('postDetail.postNotFound'));
      }
      setIsLoading(false);
    };
    getPost();
  }, [id, t]);

  if (isLoading) {
    return <Loader />;
  }

  if (error || !post) {
    return (
      <>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>{t('postDetail.postNotFound')} | ADSH Blog</title>
        </Helmet>
        <p className="error">{t('postDetail.postNotFound')}</p>
      </>
    );
  }

  const defaultThumbnail = `${process.env.PUBLIC_URL}/assets/Blog-default.webp`;
  const title = currentLanguage === 'en'
    ? post.title_en || post.title
    : post.title;
  const description = currentLanguage === 'en'
    ? post.description_en || post.description
    : post.description;
  const canonicalUrl = `https://www.adsh2014.al/posts/${post._id}`;
  const ogImage = post.thumbnail || defaultThumbnail;

  return (
    <div className="post-detail-section">
      <Helmet>
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
      </Helmet>
      <section data-aos="fade-up" className="container post-detail">
        {post && post.creator ? (
          <div className="post-detail-container">
            <div className="post-detail-header">
              <PostAuthor authorID={post.creator._id || post.creator} createdAt={post.createdAt} />
              {currentUser?.id === (post.creator._id || post.creator) && (
                <div className="post-detail-buttons">
                  <Link to={`/posts/${post._id}/edit`} className="btn btn-primary">
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
            <p dangerouslySetInnerHTML={{ __html: description }}></p>
          </div>
        ) : (
          <p className="error">{t('postDetail.authorNotFound')}</p>
        )}
        <Link to="/blog" className="btn btn-secondary post-detail-btn">
          {t('postDetail.backToArticles')}
        </Link>
      </section>
    </div>
  );
};

export default PostDetail;
