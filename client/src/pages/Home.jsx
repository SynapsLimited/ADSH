import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DisplacementSlider from './../components/DisplacementSlider';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
  { title: "Produkte", value: 100 },
  { title: "Partnerët", value: 30 },
  { title: "Eksperiencë", value: 30 },
  { title: "Klientë të kënaqur", value: 350 },
];

function Home() {
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
          setError('Nuk ka postime.');
        }
      } catch (err) {
        console.error('Error fetching latest post:', err);
        setError('Error fetching latest post');
      }
      setIsLoading(false);
    };
    fetchLatestPost();
  }, []);
  



  // Array of images for the slider
  const slideImages = [
    {
      src: '/assets/Slideshow 1.png',
      alt: 'Bulmet / Dairy',
    },
    {
      src: '/assets/Slideshow 2.png',
      alt: 'Akullore / Ice Cream',
    },
    {
      src: '/assets/Slideshow 3.png',
      alt: 'Pasticeri / Pastry',
    },
    {
      src: '/assets/Slideshow 4.png',
      alt: 'Paketime / Packaging',
    },
    {
      src: '/assets/Slideshow 5.png',
      alt: 'ADSH / ADSH',
    },
  ];

  const categories = [
    {
      title: "Bulmetore",
      image: "/assets/Homepage - Hero.jpg", // Updated image source
      description: "Lëndë e parë për bulmetore për të asistuar klinetët tanë ne prodhimin e një produkti me kualitet sa më të lartë!",
      link: "/products/category/Dairy",
    },
    {
      title: "Akullore",
      image: "/assets/Product - Ice Cream.jpg", // Updated image source
      description: "Lëndë përbërëse për prodhimin e akullores për ti dhënë një freski jetës në muajt e nxehtë të verës!",
      link: "/products/category/Ice Cream",
    },
    {
      title: "Pastiçeri",
      image: "/assets/Product - Pastry.jpg", // Updated image source
      description: "Produkte për pastiçeri, torta, kruasant, dhe më shumë!",
      link: "/products/category/Pastry",
    },
    {
      title: "Paketime",
      image: "/assets/Product - Packaging.jpg", // Updated image source
      description: "Paketime plastike për bulmet, akullore, ose pastiçeri.",
      link: "/products/category/Packaging",
    },
    {
      title: "Fruta të thata",
      image: "/assets/Product - Dried Fruits.jpg", // Updated image source
      description: "Lloje të ndryshme frutash të thata për klientët tanë.",
      link: "/products/category/Dried Fruits",
    },
    {
      title: "Furra",
      image: "/assets/Product - Bakery.jpg", // Updated image source
      description: "Përbërës të ndryshëm për furra buke.",
      link: "/products/category/Bakery",
    },
    {
      title: "Pajisje",
      image: "/assets/Product - Equipment.jpg", // Updated image source
      description: "Pajisje dhe veshje pune për ushqimoret.",
      link: "/products/category/Equipment",
    },
  ];

  return (
    <div>
      <Helmet>
                <title>ADSH - Kryesore</title>
            </Helmet>
      {/* Hero Section */}
      <div
        className="hero-container hero-container-home"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Logo Image */}
          <img src="/assets/Logo-White.png" alt="ADSH Logo" className="hero-logo" />

          {/* Text Section */}
          <h3 className="hero-title">Albanian Dairy & Supply Hub</h3>
          <p className="hero-description">
          Fuqizojmë krijimet tuaja kulinare me përbërës dhe furnizime cilësore. Nga kënaqësitë e bulmetit deri te përsosmëria e pastiçerisë, ne jemi partneri juaj i besueshëm në ekselencën kulinare.
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">Kontakto</a>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats-section" className="stats-section-container">
        <h2 className="stats-title">Përse duhet të zgjidhni ADSH-n?</h2>
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
          Këto janë disa prej statistikave që ADSH ka arritur gjatë viteve që ka qënë ne treg. 
         </p>
      </div>

      {/* "Who are we?" Section */}
      <section data-aos="fade-up"  className="who-we-are-section">
        <div className="who-we-are-container container">
          <div className="who-we-are-content">
            {/* Text Section */}
            <div className="who-we-are-text">
              <h2 className="who-we-are-title">Kush jemi ne?</h2>
              <p className="who-we-are-description">
              ADSH-2014 është një kompani që është krijuar në vitin 2014. Kompania zotëron mbi 26 vite eksperiencë në fushën e lëndëve të para për bulmetore dhe pastiçeri.
              </p>
              <a href="/about" className="btn btn-primary" >Rreth Nesh</a>
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
          <h2>Kategoritë e produkteve</h2>
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
            Shfletoni kataloget tanë digjital në website-n tonë në bazë të kategorisë. Nuk jeni të sigurt ç'farë produkti po kërkoni? Shfletoni katalogun e plotë ose shkarkoni katalogun e plotë për një eksperiencë me të rehatshme. Katalogët e çdo kategorie mund të shkarkohen gjithashtu për thjeshtimin e eksperiencës tuaj!
            </p>
            <div className="category-buttons">
            <Link to="/full-catalog" className="btn btn-primary">
              Shfleto Katalogun e plotë
            </Link>
            <Link to="/download-catalog" className="btn btn-primary">
            Shkarko Katalogun e plotë
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
        <p>Duke ngarkuar postimin...</p>
      ) : error ? (
        <p>{error}</p>
      ) : latestPost ? (
        <div className="blog-card">
          <PostItem post={latestPost} />
        </div>
      ) : (
        <p>Nuk ka postime.</p>
      )}

      <div className="blog-content container">
        <h2>Artikuj</h2>
        <p>
          Shfletoni artikujt tanë për të mësuar më shumë rreth produkteve tona dhe përdorimit të tyre në krijimet tuaja kulinare. Ne mbulojmë të gjitha kategoritë e produkteve, duke ju ofruar këshilla, receta, dhe trendet më të fundit në industri. Qëndroni të informuar dhe të frymëzuar me përmbajtjen tonë të përditësuar rregullisht.
        </p>
        <Link to="/blog" className="btn btn-primary blog-button">
          Artikujt
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
