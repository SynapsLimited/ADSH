// src/components/CategoryPosts.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostItem from '../components/PostItem';
import './../css/blog.css';
import Authors from '../blog/Authors';
import Loader from './../components/Loader';
import axios from 'axios';

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { category } = useParams();

  // Mapping from English category names to Albanian translations
  const categoryTranslationMap = {
    "Dairy": "Bulmetore",
    "Ice Cream": "Akullore",
    "Pastry": "Pastiçeri",
    "Bakery": "Furra",
    "Packaging": "Paketime",
    "Dried Fruits": "Fruta të thata",
    "Equipment": "Pajisje",
    "Other": "Të tjera"
  };

  // Get the display name in Albanian
  const categoryDisplayName =
    categoryTranslationMap[category] || category;

  useEffect(() => {
    const fetchAuthorAndPosts = async () => {
      setIsLoading(true);
      try {
        // Fetch posts for the current category
        const postsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`);
        setPosts(postsResponse.data);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchAuthorAndPosts();
  }, [category]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section data-aos="fade-up" className="posts">
      <div className="blog-title-filtered">
        <h1>{categoryDisplayName}</h1>
      </div>

      {posts.length > 0 ? (
        <div className="container posts-container">
          {posts.map((post) => (
            <PostItem key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <h1 className="error-blog-not-found">Nuk u gjetën postime</h1>
      )}

      {/* Blog Categories Section */}
      <section data-aos="fade-up" className="container blog-categories-section">
        <div className="blog-title">
          <h1>Kategori</h1>
        </div>
        <ul className="blog-categories">
          {Object.keys(categoryTranslationMap).map((key) => (
            <li key={key} className="btn btn-secondary">
              <Link to={`/posts/categories/${key}`}>{categoryTranslationMap[key]}</Link>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};

export default CategoryPosts;
