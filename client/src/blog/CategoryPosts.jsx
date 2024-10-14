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

  useEffect(() => {
    const fetchAuthorAndPosts = async () => {
      setIsLoading(true);
      try {
        const authorResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`);
        setAuthorName(authorResponse.data.name);

        const postsResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`);
        setPosts(postsResponse?.data);
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
        <h1>{category}</h1>
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
        <h1 className="error-blog-not-found">No Posts Found</h1>
      )}

      <section data-aos="fade-up" className="container blog-categories-section">
        <div className="blog-title">
          <h1>Categories</h1>
        </div>
        <ul className="blog-categories">
          <li className="btn btn-secondary"><Link to="/posts/categories/Dairy">Dairy</Link></li>
          <li className="btn btn-secondary"><Link to="/posts/categories/Ice Cream">Ice Cream</Link></li>
          <li className="btn btn-secondary"><Link to="/posts/categories/Pastry">Pastry</Link></li>
          <li className="btn btn-secondary"><Link to="/posts/categories/Bakery">Bakery</Link></li>
          <li className="btn btn-secondary"><Link to="/posts/categories/Other">Other</Link></li>
        </ul>
      </section>
    </section>
  );
};

export default CategoryPosts;
