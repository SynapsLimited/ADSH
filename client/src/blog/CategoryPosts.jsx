// src/components/CategoryPosts.jsx

import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PostItem from '../components/PostItem';
import './../css/blog.css';
import Authors from '../blog/Authors';
import Loader from './../components/Loader';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const CategoryPosts = () => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { category } = useParams();

  // Mapping from category keys to translation keys
  const categoryKeyMap = {
    "Dairy": "categoryPosts.category_Dairy",
    "Ice Cream": "categoryPosts.category_Ice_Cream",
    "Pastry": "categoryPosts.category_Pastry",
    "Bakery": "categoryPosts.category_Bakery",
    "Packaging": "categoryPosts.category_Packaging",
    "Dried Fruits": "categoryPosts.category_Dried_Fruits",
    "Equipment": "categoryPosts.category_Equipment",
    "Other": "categoryPosts.category_Other"
  };

  // Get the display name via translation
  const categoryDisplayName = t(categoryKeyMap[category] || 'categoryPosts.category_Other');

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
        <h1 className="error-blog-not-found">{t('categoryPosts.noPosts')}</h1>
      )}

      {/* Blog Categories Section */}
      <section data-aos="fade-up" className="container blog-categories-section">
        <div className="blog-title">
          <h1>{t('categoryPosts.categoriesTitle')}</h1>
        </div>
        <ul className="blog-categories">
          {Object.keys(categoryKeyMap).map((key) => (
            <li key={key} className="btn btn-secondary">
              <Link to={`/posts/categories/${key}`}>{t(categoryKeyMap[key])}</Link>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};

export default CategoryPosts;
