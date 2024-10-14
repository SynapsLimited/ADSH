import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';

function Blog() {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Track scroll position to apply parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  return (
    <div>
    <Helmet>
                <title>ADSH - Blog</title>
            </Helmet>
  {/* Hero Section */}
  <div
        className="hero-container-blog"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">Blog</h1>
          <p className="hero-description">
            Lorem ipsum dolor sit amet consectetur. Maecenas mollis mus ut risus at aenean dignissim. Patea tempor vitae suspendisse pellentesque.
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">Contact</a>
        </div>
      </div>
    </div>
  );
}

export default Blog;
