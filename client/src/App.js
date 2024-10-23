import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FixedMenu from './components/FixedMenu';
import ThemeToggle from './components/ThemeToggle'; // Import ThemeToggle
import UserProvider, { UserContext } from './context/userContext';
import LoadingScreen from './components/LoadingScreen';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

import ScrollToTop from './components/ScrollToTop';
import BackgroundAnimation from './components/BackgroundAnimation';
import Layout from './components/Layout';

// Blog pages
import ErrorPage from './blog/ErrorPage';
import PostDetail from './blog/PostDetail';
import Register from './blog/Register';
import Login from './blog/Login';
import UserProfile from './blog/UserProfile';
import Authors from './blog/Authors';
import CreatePost from './blog/CreatePost';
import EditPost from './blog/EditPost';
import DeletePost from './blog/DeletePost';
import CategoryPosts from './blog/CategoryPosts';
import AuthorPosts from './blog/AuthorPosts';
import Dashboard from './blog/Dashboard';
import Logout from './blog/Logout';
import Posts from './components/Posts';

// Product components
import ProductCatalog from './components/ProductCatalog';
import FullCatalog from './components/FullCatalog';
import DownloadCatalog from './components/DownloadCatalog';


// Product pages
import ProductDashboard from './products/ProductDashboard';
import CreateProduct from './products/CreateProduct';
import DeleteProduct from './products/DeleteProduct';
import EditProduct from './products/EditProduct';
import ProductDetail from './products/ProductDetail';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    AOS.refresh();
  }, []);

  // Theme state management
  const [currentTheme, setCurrentTheme] = useState('normal');

  useEffect(() => {
    // Load saved theme from localStorage if available
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      // If no theme is saved, set 'normal' as default
      setCurrentTheme('normal');
      localStorage.setItem('theme', 'normal');
    }
  }, []);

  // Function to update theme
  const updateTheme = (themeClass) => {
    setCurrentTheme(themeClass);
    localStorage.setItem('theme', themeClass);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });

    AOS.refresh();

    // Simulate a loading time (e.g., fetching data)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <HelmetProvider>
      <UserContext.Consumer>
        {({ currentUser }) => (
          <>
            {/* Fixed Elements Routes */}
            <Navbar currentTheme={currentTheme} /> {/* Navbar outside theme-container */}
            <ThemeToggle updateTheme={updateTheme} currentTheme={currentTheme} />
            <FixedMenu currentTheme={currentTheme} /> {/* FixedMenu outside theme-container */}

            {/* Themed Content */}
            <div className={`theme-container ${currentTheme}`}>


              {/* Technical Routes */}
              <BackgroundAnimation />
              <ScrollToTop />
              <Layout>
                <div className="content">
                  <Routes>

                    {/* Main Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* User Routes */}
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<Login />} />
                    <Route path="profile/:id" element={<UserProfile />} />

                    {/* Blog Routes */}
                    <Route path="posts/:id" element={<PostDetail />} />
                    <Route path="authors" element={<Authors />} />
                    <Route path="create" element={<CreatePost />} />
                    <Route path="posts" element={<Posts />} />
                    <Route path="posts/:categories/:category" element={<CategoryPosts />} />
                    <Route path="posts/users/:id" element={<AuthorPosts />} />
                    <Route path="myposts/:id" element={<Dashboard />} />
                    <Route path="posts/:id/edit" element={<EditPost />} />
                    <Route path="posts/:id/delete" element={<DeletePost />} />
                    <Route path="logout" element={<Logout />} />
                    <Route path="*" element={<ErrorPage />} />

                    {/* Product Routes */}
                    <Route path="/products/category/:category" element={<ProductCatalog />} />
                    <Route path="/download-catalog/:category" element={<DownloadCatalog />} />
                    <Route path="/download-catalog" element={<DownloadCatalog />} />
                    <Route path="/full-catalog" element={<FullCatalog />} />
                    <Route path="/products-dashboard" element={<ProductDashboard />} />
                    <Route path="/create-product" element={<CreateProduct />} />
                    <Route path="/delete-product/:id" element={<DeleteProduct />} />
                    <Route path="/products/:id/edit" element={<EditProduct />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                  </Routes>
                </div>
                <Footer />
              </Layout>
            </div>
          </>
        )}
      </UserContext.Consumer>
    </HelmetProvider>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <UserProvider>
        <App />
      </UserProvider>
    </Router>
  );

}