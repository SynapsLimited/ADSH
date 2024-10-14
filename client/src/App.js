import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import axios from 'axios';


import Navbar from './components/Navbar';
import Footer from './components/Footer';


import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Blog from './pages/Blog';
import Contact from './pages/Contact';


import ScrollToTop from './components/ScrollToTop';
import BackgroundAnimation from './components/BackgroundAnimation';
import Layout from './components/Layout';
import FixedMenu from './components/FixedMenu';
import Posts from './components/Posts';
import UserProvider from './context/userContext';


// Import blog pages

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





function App() {

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      once: true,     // Whether animation should happen only once
      mirror: false,  // Whether elements should animate out while scrolling past them
    });

    // Refresh AOS on route change
    // This ensures that AOS detects new elements on page navigation
    AOS.refresh();
  }, []);



  return (
    <HelmetProvider>
      <Router>
      <BackgroundAnimation />
        <ScrollToTop />
        <Navbar />
        <Layout>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />


            {/* Blog routes */}
            <Route path="posts/:id" element={<PostDetail />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="profile/:id" element={<UserProfile />} />
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


          </Routes>
        </div>
        <Footer />
        </Layout>
      </Router>
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
