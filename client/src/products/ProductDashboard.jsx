// src/components/ProductDashboard.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';
import DeleteProduct from './DeleteProduct';

const ProductDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
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
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/products`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter products created by the current user
        const userProducts = response.data.filter(
          (product) => product.creator === currentUser.id
        );
        setProducts(userProducts);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [currentUser.id, token]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section data-aos="fade-up" className="dashboard">
      <div className="blog-title-filtered">
        <h1>Product Dashboard</h1>
      </div>

      {products.length ? (
        <div className="container dashboard-container">
          {products.map((product) => (
            <article key={product._id} className="dashboard-post">
              <div className="dashboard-post-info">
                <div className="dashboard-post-thumbnail">
                  <img src={product.images[0]} alt={product.name} />
                </div>
                <h4>{product.name}</h4>
              </div>
              <div className="dashboard-post-actions">
                <Link to={`/products/${product._id}`} className="btn btn-primary">
                  View
                </Link>
                <Link to={`/products/${product._id}/edit`} className="btn btn-primary">
                  Edit
                </Link>
                <DeleteProduct productId={product._id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">No products found.</h2>
      )}
    </section>
  );
};

export default ProductDashboard;
