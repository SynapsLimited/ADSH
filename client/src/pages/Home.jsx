// src/components/Home.jsx

import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import DisplacementSlider from './../components/DisplacementSlider';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostItem from './../components/PostItem';

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
  { title: "products", value: 100 },
  { title: "partners", value: 30 },
  { title: "experience", value: 30 },
  { title: "satisfiedCustomers", value: 350 },
];

function Home() {
  const { t } = useTranslation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [latestPost, setLatestPost] = useState(null); // State for latest post
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

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


   // Fetch the latest post
   useEffect(() => {
    const fetchLatestPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts`);
        const posts = response.data;
  
        if (posts.length > 0) {
          setLatestPost(posts[0]);
        } else {
          setError(t('blog.posts.noPosts'));
        }
      } catch (err) {
        console.error('Error fetching latest post:', err);
        setError(t('blog.posts.error'));
      }
      setIsLoading(false);
    };
    fetchLatestPost();
  }, [t]);
  


  // Array of images for the slider
  const slideImages = [
    {
      src: '/assets/Slideshow 1.png',
      alt: t('home.whoWeAre.swiperAlt1') // Add corresponding keys in translation.json
    },
    {
      src: '/assets/Slideshow 2.png',
      alt: t('home.whoWeAre.swiperAlt2')
    },
    {
      src: '/assets/Slideshow 3.png',
      alt: t('home.whoWeAre.swiperAlt3')
    },
    {
      src: '/assets/Slideshow 4.png',
      alt: t('home.whoWeAre.swiperAlt4')
    },
    {
      src: '/assets/Slideshow 5.png',
      alt: t('home.whoWeAre.swiperAlt5')
    },
  ];

  const categories = [
    {
      title: t('home.productCategories.categories.Dairy'),
      image: "/assets/Homepage - Hero.jpg",
      description: t('home.productCategories.categories.DairyDescription'),
      link: "/products/category/Dairy",
    },
    {
      title: t('home.productCategories.categories.IceCream'),
      image: "/assets/Product - Ice Cream.jpg",
      description: t('home.productCategories.categories.IceCreamDescription'),
      link: "/products/category/Ice Cream",
    },
    {
      title: t('home.productCategories.categories.Pastry'),
      image: "/assets/Product - Pastry.jpg",
      description: t('home.productCategories.categories.PastryDescription'),
      link: "/products/category/Pastry",
    },
    {
      title: t('home.productCategories.categories.Packaging'),
      image: "/assets/Product - Packaging.jpg",
      description: t('home.productCategories.categories.PackagingDescription'),
      link: "/products/category/Packaging",
    },
    {
      title: t('home.productCategories.categories.DriedFruits'),
      image: "/assets/Product - Nuts.jpg",
      description: t('home.productCategories.categories.DriedFruitsDescription'),
      link: "/products/category/Dried Fruits",
    },
    {
      title: t('home.productCategories.categories.Bakery'),
      image: "/assets/Product - Bakery.jpg",
      description: t('home.productCategories.categories.BakeryDescription'),
      link: "/products/category/Bakery",
    },
    {
      title: t('home.productCategories.categories.Equipment'),
      image: "/assets/Product - Equipment.jpg",
      description: t('home.productCategories.categories.EquipmentDescription'),
      link: "/products/category/Equipment",
    },
  ];

  return (
    <div>
      <Helmet>
        <title>{t('home.helmetTitle')}</title>
      </Helmet>
      {/* Hero Section */}
      <div
        className="hero-container hero-container-home"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Logo Image */}
          <img src="/assets/Logo-White.png" alt={t('home.hero.logoAlt')} className="hero-logo" />

          {/* Text Section */}
          <h3 className="hero-title">{t('home.hero.subheading')}</h3>
          <p className="hero-description">
            {t('home.hero.description')}
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">{t('home.hero.contactButton')}</a>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats-section" className="stats-section-container">
        <h2 className="stats-title">{t('home.stats.sectionTitle')}</h2>
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
                <h3 className="stat-title">{t(`home.stats.stats.${stat.title.toLowerCase()}`)}</h3>
                <div className="stat-underline"></div>
              </div>
              <motion.span
                className="stat-value"
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              >
                {isVisible ? <Counter from={0} to={stat.value} /> : "0+"}
              </motion.span>
            </motion.div>
          ))}
        </div>
        <p className="stats-paragraph">
          {t('home.stats.paragraph')}
        </p>
      </div>

      {/* "Who are we?" Section */}
      <section data-aos="fade-up"  className="who-we-are-section">
        <div className="who-we-are-container container">
          <div className="who-we-are-content">
            {/* Text Section */}
            <div className="who-we-are-text">
              <h2 className="who-we-are-title">{t('home.whoWeAre.sectionTitle')}</h2>
              <p className="who-we-are-description">
                {t('home.whoWeAre.description')}
              </p>
              <a href="/about" className="btn btn-primary" >{t('home.whoWeAre.button')}</a>
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
          <h2>{t('home.productCategories.sectionTitle')}</h2>
          <div className="category-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <img
                  src={category.image}
                  alt={category.title}
                  loading="lazy"
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
              {t('home.productCategories.downloadCatalogParagraph')}
            </p>
            <div className="category-buttons">
              <Link to="/full-catalog" className="btn btn-primary">
                {t('home.productCategories.buttons.viewFullCatalog')}
              </Link>
              <Link to="/download-catalog" className="btn btn-primary">
                {t('home.productCategories.buttons.downloadFullCatalog')}
              </Link>
            </div>
          </div>
        </div>
      </section>


 {/* Blog Section */}
<section data-aos="fade-up" className="blog-section">
  <div className="container">
    <div className="blog-container">
      {isLoading ? (
        <p>{t('blog.posts.loading')}</p>
      ) : error ? (
        <p>{error}</p>
      ) : latestPost ? (
        <div className="blog-card">
          <PostItem post={latestPost} />
        </div>
      ) : (
        <p>{t('blog.posts.noPosts')}</p>
      )}

      <div className="blog-content container">
        <h2>{t('home.blogSection.heading')}</h2>
        <p>
          {t('home.blogSection.description')}
        </p>
        <Link to="/blog" className="btn btn-primary blog-button">
          {t('home.blogSection.button')}
        </Link>
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
