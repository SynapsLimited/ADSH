import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DisplacementSlider from './../components/DisplacementSlider';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Import your custom CSS after Swiper styles
import './../css/home.css'; // Import the CSS file

const stats = [
  { title: "Products", value: 100 },
  { title: "Partners", value: 30 },
  { title: "Experience", value: 30 },
  { title: "Happy Clients", value: 350 },
];

function Home() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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

  // Observe when stats section comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const target = document.getElementById("stats-section");
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  // Array of images for the slider
  const slideImages = [
    {
      src: '/assets/About - Hero.jpg',
      alt: 'Image 1 description',
    },
    {
      src: '/assets/Blog - Hero.jpg',
      alt: 'Image 2 description',
    },
    {
      src: '/assets/Homepage - Hero.jpg',
      alt: 'Image 3 description',
    },
    {
      src: '/assets/Contact - Hero.jpg',
      alt: 'Image 4 description',
    },
  ];

  const categories = [
    {
      title: "Dairy",
      image: "assets/About - Hero.jpg",
      description: "Fresh and creamy dairy products from local farms.",
      link: "#dairy",
    },
    {
      title: "Ice Cream",
      image: "assets/Homepage - Hero.jpg",
      description: "Delicious, handcrafted ice cream in various flavors.",
      link: "#ice-cream",
    },
    {
      title: "Patisserie",
      image: "assets/Products - Hero.jpg",
      description: "Exquisite French pastries and desserts.",
      link: "#patisserie",
    },
    {
      title: "Bakery",
      image: "/assets/Contact - Hero.jpg",
      description: "Freshly baked bread, cakes, and pastries.",
      link: "#bakery",
    },
  ];

  return (
    <div>
      <Helmet>
                <title>ADSH - Home</title>
            </Helmet>
      {/* Hero Section */}
      <div
        className="hero-container-home"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Logo Image */}
          <img src="/assets/Logo-White.png" alt="ADSH Logo" className="hero-logo" />

          {/* Text Section */}
          <h3 className="hero-title">Albanian Dairy & Supply Hub</h3>
          <p className="hero-description">
            Lorem ipsum dolor sit amet consectetur. Maecenas mollis mus ut risus at aenean dignissim. Patea tempor vitae suspendisse pellentesque.
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">Contact</a>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats-section" className="stats-section-container">
        <h2 className="stats-title">Why ADSH?</h2>
        <div className="stats-blobs">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="stat-box"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="stat-title-container">
                <h3 className="stat-title">{stat.title}</h3>
                <div className="stat-underline"></div>
              </div>
              <motion.span
                className="stat-value"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                {isVisible ? <Counter from={0} to={stat.value} /> : "0"}
              </motion.span>
            </motion.div>
          ))}
        </div>
        <p className="stats-paragraph">
          Lorem ipsum dolor sit amet consectetur. Dictum arcu porttitor tincidunt sagittis odio integer elementum.
        </p>
      </div>

      {/* "Who are we?" Section */}
      <section data-aos="fade-up"  className="who-we-are-section">
        <div className="who-we-are-container container">
          <div className="who-we-are-content">
            {/* Text Section */}
            <div className="who-we-are-text">
              <h2 className="who-we-are-title">Who are we?</h2>
              <p className="who-we-are-description">
                Lorem ipsum dolor sit amet consectetur. Purus tellus leo in nullam non ullamcorper leo semper. Dui donec
                est urna ac bibendum nullam blandit euismod. Ullamcorper vitae nibh ante cursus tristique euismod
                bibendum id nunc. Leo turpis enim tristique vulputate sed sit et.
              </p>
              <a href="/about" className="btn btn-primary" >About</a>
            </div>
            {/* Swiper Section */}
            <div className="who-we-are-swiper">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={30}
                slidesPerView={1}
                className="swiper-container"
              >
                {slideImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-slide-content">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="swiper-slide-image"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>

      {/* Add the Displacement Slider Section */}
      <section data-aos="fade-up"  className="displacement-slider-section">
        <DisplacementSlider />
      </section>

      {/* Product Categories Section */}
      <section data-aos="fade-up"  className="product-categories">
        <div className="container">
          <h2>Product Categories</h2>
          <div className="category-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <img
                  src={category.image}
                  alt={category.title}
                  width={200}
                  height={200}
                />
                <div className="category-content">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <a href={category.link} className="btn btn-primary">
                    {category.title}
                  </a>
                </div>
              </div>
            ))}
          </div>
          {/* Added Paragraph and Button */}
          <div className="catalog-download container">
            <p>
              Too lazy to roam around the website and look at the built-in catalog on the website? You can download our product catalog to have a physical copy of all our products.
            </p>
            <a href="/path/to/catalog.pdf" className="btn btn-primary">
              Download Catalog
            </a>
          </div>
        </div>
      </section>


      <section data-aos="fade-up"  className="blog-section">
  <div className="container">
    <div className="blog-container">
      <div className="blog-card">
        <img
          src="/assets/Blog - Hero.jpg"
          alt="Blog post thumbnail"
          width={400}
          height={300}
        />
        <div className="blog-card-content">
          <h3>Latest Blog Post Title</h3>
          <p>
            This is a short description of the latest blog post. It provides a brief overview of the content to entice readers.
          </p>
          <Link href="/blog/latest-post" className="btn btn-primary">Read more</Link>
        </div>
      </div>
      <div className="blog-content container">
        <h2>Blog</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus tellus leo in nullam non ullamcorper leo semper. Dui donec est urna ac bibendum nullam blandit euismod. Ullamcorper vitae nibh ante cursus tristique quismod bibendum id nunc. Leo turpis enim tristique vulputate sed sit et.
        </p>
        <a href="/blog" className="btn btn-primary blog-button">
          Blog
        </a>
      </div>
    </div>
  </div>
</section>


            
    </div>
  );
}

function Counter({ from, to }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (count < to) {
      // Adjusting the speed based on the target value
      const duration = to <= 99 ? 100 : 20; // If the value is small (like 30), slow it down
      const timer = setTimeout(() => setCount(count + 1), duration);
      return () => clearTimeout(timer);
    }
  }, [count, to]);

  return <>{count}+</>;
}


export default Home;
