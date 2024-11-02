// src/components/Posts.jsx

import React, { useState, useEffect } from 'react';
import PostItem from './PostItem';
import Loader from './Loader';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Posts = ({ limit }) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`);
        setPosts(response?.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const displayedPosts = limit ? posts.slice(0, limit) : posts;

  return (
    <section data-aos="fade-up" className="posts">
      <div className="blog-title-filtered">
        <h1>{t('posts.title')}</h1>
      </div>
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
          <Link to="/posts" className="btn btn-secondary">{t('posts.readMore')}</Link>
        </div>
      )}
    </section>
  );
};

export default Posts;
