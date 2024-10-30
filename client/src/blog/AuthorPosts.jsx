// src/components/AuthorPosts.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import PostItem from '../components/PostItem';
import './../css/blog.css';
import Authors from '../blog/Authors';
import Loader from './../components/Loader';
import axios from 'axios';

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    const stateAuthorName = location.state?.authorName;
    if (stateAuthorName) {
      setAuthorName(stateAuthorName);
    } else {
      // Fetch author's name if not available in state
      const fetchAuthorName = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${id}`);
          setAuthorName(response.data.name);
        } catch (error) {
          console.log(error);
        }
      };
      fetchAuthorName();
    }
  }, [id, location.state]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`);
        setPosts(response?.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section data-aos="fade-up" className="posts">
      <div className="blog-title-filtered">
        <h1>Postime nga {authorName}</h1>
      </div>

      {posts.length > 0 ? (
        <div className="container posts-container">
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <h1 className="error-blog-not-found">Nuk ka postime!</h1>
      )}

      <Authors />
    </section>
  );
};

export default AuthorPosts;
