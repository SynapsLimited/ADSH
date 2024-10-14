import React, { useContext, useEffect, useState } from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import './../css/blog.css'; // Assuming you have a corresponding CSS file for styling
import Loader from '../components/Loader';
import DeletePost from './DeletePost';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Importing useTranslation hook

const PostDetail = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const { id } = useParams(); // Get the post ID from URL params
  const [post, setPost] = useState(null); // State to hold post data
  const [error, setError] = useState(null); // State to hold errors
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const { currentUser } = useContext(UserContext); // Get the current user from context

  // Fetch post details on component mount
  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        if (response.data) {
          setPost(response.data); // Set post data if available
        } else {
          setError('No post data found.');
        }
      } catch (error) {
        setError(error.message); // Handle errors
      }
      setIsLoading(false); // Stop loading
    };

    getPost();
  }, [id]);

  // Log post creator and current user for debugging
  useEffect(() => {
    if (post && currentUser) {

    }
  }, [post, currentUser]);

  // Show loader if the post is still loading
  if (isLoading) {
    return <Loader />;
  }

  // Show error message if there is an error
  if (error) {
    return <p  className='error'>{error}</p>;
  }

  // Show error if no post data is available
  if (!post) {
    return <p  className='error'>Post not found.</p>;
  }

  // Default thumbnail if no custom thumbnail is available for the post
  const defaultThumbnail = `${process.env.PUBLIC_URL}/assets/Blog-default.webp`;

  return (
    <div  className='post-detail-section'>
      <section data-aos="fade-up"   className="container post-detail">
        {post && post.creator ? (
          <div  className="post-detail-container">
            <div  className="post-detail-header">
              {/* Pass the creator's ID (authorID) and post createdAt date */}
              <PostAuthor authorID={post.creator._id || post.creator} createdAt={post.createdAt} />
              
              {/* Only show edit and delete buttons if the current user is the post creator */}
              {currentUser?.id === (post.creator._id || post.creator) && (
                <div  className="post-detail-buttons">
                  <Link to={`/posts/${post?._id}/edit`} className="btn btn-primary">
                    {t('Dashboard.editButton')}
                  </Link>
                  <DeletePost postId={post._id} /> {/* Pass the postId to the DeletePost component */}
                </div>
              )}
            </div>

            {/* Post title */}
            <h1>{post.title}</h1>

            {/* Post thumbnail */}
            <div  className="post-detail-thumbnail">
              <img src={post.thumbnail || defaultThumbnail} alt={post.title} />
            </div>

            {/* Post description */}
            <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
          </div>
        ) : (
          <p  className='error'>Author not found for this post.</p>
        )}

        {/* Back to blog button */}
        <a href="/blog" className="btn btn-secondary post-detail-btn">Back to Blog</a>
      </section>
    </div>
  );
};

export default PostDetail;
