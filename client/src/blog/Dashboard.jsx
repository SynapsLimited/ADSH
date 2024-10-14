import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';
import DeletePost from './DeletePost';
import { useTranslation } from 'react-i18next'; // Importing useTranslation hook

const Dashboard = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };

    fetchPosts();
  }, [id, token]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section data-aos="fade-up"   className="dashboard">
      <div  className="blog-title-filtered">
        <h1>{t('Dashboard.dashboard')}</h1>
      </div>

      {posts.length ? (
        <div  className="container dashboard-container">
          {posts.map((post) => (
            <article key={post._id}  className="dashboard-post">
              <div  className="dashboard-post-info">
                <div  className="dashboard-post-thumbnail">
                  {/* Directly use post.thumbnail since it now contains the full URL */}
                  <img src={post.thumbnail} alt={post.title} />
                </div>
                <h4>{post.title}</h4>
              </div>
              <div  className="dashboard-post-actions">
                <Link to={`/posts/${post._id}`} className="btn btn-background">{t('Dashboard.viewButton')}</Link>
                <Link to={`/posts/${post._id}/edit`} className="btn btn-primary">{t('Dashboard.editButton')}</Link>
                <DeletePost postId={post._id} /> {/* Pass the postId here */}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2  className="center">{t('Dashboard.noPosts')}</h2>
      )}
    </section>
  );
};

export default Dashboard;
