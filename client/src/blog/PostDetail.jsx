// src/pages/PostDetail.jsx

import React, { useContext, useEffect, useState } from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import './../css/blog.css';
import Loader from '../components/Loader';
import DeletePost from './DeletePost';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(UserContext);
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        if (response.data) {
          setPost(response.data);
        } else {
          setError('No post data found.');
        }
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
    };

    getPost();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <p className="error">
        {currentLanguage === 'en' ? 'Post not found.' : 'Postimi nuk u gjet.'}
      </p>
    );
  }

  if (!post) {
    return (
      <p className="error">
        {currentLanguage === 'en' ? 'Post not found.' : 'Postimi nuk u gjet.'}
      </p>
    );
  }

  const defaultThumbnail = `${process.env.PUBLIC_URL}/assets/Blog-default.webp`;

  const title =
    currentLanguage === 'en' ? post.title_en || post.title : post.title;
  const description =
    currentLanguage === 'en' ? post.description_en || post.description : post.description;

  return (
    <div className="post-detail-section">
      <section data-aos="fade-up" className="container post-detail">
        {post && post.creator ? (
          <div className="post-detail-container">
            <div className="post-detail-header">
              <PostAuthor authorID={post.creator._id || post.creator} createdAt={post.createdAt} />

              {currentUser?.id === (post.creator._id || post.creator) && (
                <div className="post-detail-buttons">
                  <Link to={`/posts/${post?._id}/edit`} className="btn btn-primary">
                    Edit
                  </Link>
                  <DeletePost postId={post._id} />
                </div>
              )}
            </div>

            <h1>{title}</h1>

            <div className="post-detail-thumbnail">
              <img src={post.thumbnail || defaultThumbnail} alt={title} />
            </div>

            <p dangerouslySetInnerHTML={{ __html: description }}></p>
          </div>
        ) : (
          <p className="error">
            {currentLanguage === 'en' ? 'Author not found.' : 'Autori nuk u gjet.'}
          </p>
        )}

        <a href="/blog" className="btn btn-secondary post-detail-btn">
          {currentLanguage === 'en' ? 'Back to Articles' : 'Kthehu te Artikujt'}
        </a>
      </section>
    </div>
  );
};

export default PostDetail;
