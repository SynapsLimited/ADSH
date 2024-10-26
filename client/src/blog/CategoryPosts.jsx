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
        // Merrni postimet për kategorinë aktuale
        const postsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`);
        setPosts(postsResponse.data);
        
        // Nëse keni nevojë të merrni emrin e autorit, mund të bëni një kërkesë tjetër
        // Për shembull:
        // const authorResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/authors/${authorId}`);
        // setAuthorName(authorResponse.data.name);
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
          {posts.map(({ _id: postId, thumbnail, category, title, description, creator, createdAt }) => (
            <PostItem
              key={postId}
              postID={postId}
              thumbnail={thumbnail}
              category={category}
              title={title}
              description={description}
              authorID={creator}
              createdAt={createdAt}
            />
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
          {/* Nëse keni kategori të tjera, shtoni ato këtu */}
          <li className="btn btn-secondary">
            <Link to={`/posts/categories/Other`}>Të tjera</Link>
          </li>
        </ul>
      </section>
    </section>
  );
};

export default CategoryPosts;
