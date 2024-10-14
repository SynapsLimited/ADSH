import React, { useEffect, useState } from 'react';
import './../css/blog.css'; 
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const defaultAvatar = `${process.env.PUBLIC_URL}/assets/Avatar-default.png`; // Default avatar path

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`);
        setAuthors(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    getAuthors();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section data-aos="fade-up"   className="authors">
      <div  className="blog-title">
        <h1>Authors</h1>
      </div>
      {authors.length > 0 ? (
        <div  className="authors-container">
          {authors.map(({ _id: id, avatar, name, posts }) => (
            <Link 
              key={id} 
              to={`/posts/users/${id}`} 
              className="author"
              state={{ authorName: name }}
            >
              <div className="author-avatar">
                <img 
                  src={avatar || defaultAvatar}  // Use default avatar if none exists
                  alt={`Image of ${name}`} 
                />
              </div>
              <div className="author-info">
                <h4>{name}</h4>
                <p>{posts} {posts === 1 ? 'post' : 'posts'}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2 className="error-blog-not-found">No authors found</h2>
      )}
    </section>
  );
};

export default Authors;
