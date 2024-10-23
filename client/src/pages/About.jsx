import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './../css/about.css';

  
function About() {
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


  const cards = [
    { title: 'Mission', icon: '/assets/Flour.png', alt: 'Mission icon' },
    { title: 'Vision', icon: '/assets/Tetra Pak.png', alt: 'Vision icon' },
    { title: 'Values', icon: '/assets/Cheese.png', alt: 'Values icon' },
  ]


  return (
    <div>
            <Helmet>
                <title>ADSH - About</title>
            </Helmet>
      {/* Hero Section */}
      <div
        className="hero-container-about"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">About Us</h1>
          <p className="hero-description">
            Lorem ipsum dolor sit amet consectetur. Maecenas mollis mus ut risus at aenean dignissim. Patea tempor vitae suspendisse pellentesque.
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">Contact</a>
        </div>
      </div>


      <section data-aos="fade-up"  className="about-section">
      <h2 className="about-title">History of ADSH</h2>
      <div className="about-content">
        <div className="about-text">
          <p>
            Lorem ipsum dolor sit amet consectetur. Morbi pretium montes augue eget sapien eleifend erat ut nibh. Tristique cursus turpis sed nibh amet tristique vitae. Cras interdum feugiat senectus consectetur. Feugiat placerat ullamcorper mattis massa. Curabitur orci tellus morbi ut consectetur ut ac bibendum in. Nisi id faucibus sit in etiam. Pellentesque augue bibendum nunc ridiculus morbi.
          </p>
        </div>
        <div className="about-image">
          <img src="/assets/Slideshow 5.png" alt="ADSH History" />
        </div>
      </div>
    </section>


    {/*========================= Mission Section ========================*/}

    <section data-aos="fade-up"  className="card-container container">
    <p className="card-text-mission container">
            Lorem ipsum dolor sit amet consectetur. Maecenas mollis mus ut risus at aenean dignissim. Patea tempor vitae suspendisse pellentesque.            Lorem ipsum dolor sit amet consectetur. Maecenas mollis mus ut risus at aenean dignissim. Patea tempor vitae suspendisse pellentesque.

          </p>
      {cards.map((card, index) => (
        <div key={index} className="card">
          <h2 className="card-title">{card.title}</h2>
          <p className="card-text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis et
            tristique ac ipsum consectetur vulputate ornare. Netus sit gravida ornare porta odo a.
          </p>
          <div className="icon-wrapper">
            <img
              src={card.icon}
              alt={card.alt}
              className="card-icon"
            />
          </div>
        </div>
      ))}
    </section>
    </div>
  );
}

export default About;
