import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
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
          </Routes>
        </div>
        <Footer />
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
