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
    {
      title: 'Misioni',
      icon: '/assets/Flour.png',
      alt: 'Ikona e Misionit',
      text: 'Të furnizojmë partnerët tanë me lëndë të para dhe pajisje të cilësisë së lartë, duke ndihmuar në përmirësimin e produkteve të tyre dhe rritjen e suksesit në tregun konkurrues.',
    },
    {
      title: 'Vizioni',
      icon: '/assets/Tetra Pak.png',
      alt: 'Ikona e Vizionit',
      text: 'Të jemi lider në tregun shqiptar në furnizimin me lëndë të para dhe pajisje për industrinë ushqimore, duke sjellë inovacion dhe standarde të larta cilësie.',
    },
    {
      title: 'Vlerat',
      icon: '/assets/Cheese.png',
      alt: 'Ikona e Vlerave',
      text: 'Cilësia, Integriteti, Përkushtimi ndaj klientit, Inovacioni, Eksperienca.',
    },
  ];

  return (
    <div>
      <Helmet>
        <title>ADSH - Rreth Nesh</title>
      </Helmet>
      {/* Hero Section */}
      <div
        className="hero-container hero-container-about"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">Rreth Nesh</h1>
          <p className="hero-description">
            Njihuni me ADSH, historikun e kompanisë dhe vizionin, misionin, dhe vlerat të cilat kompania reflekton dhe mundohet të transmetojë në tregun e përgjithshëm!
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">Kontakto</a>
        </div>
      </div>

      <section data-aos="fade-up" className="about-section">
        <h2 className="about-title">Historiku i ADSH</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              ADSH-2014 është një kompani që është krijuar në vitin 2014. Stafi ka operuar që në vitin 1995 nën kompaninë D&A. Kompania zotëron mbi 26 vite eksperiencë në fushën e lëndëve të para për bulmetore, akullore, pastiçeri, furra, ambalazhe, pajisje pune, etj. Produktet tona kanë cilësi të lartë dhe çmime konkurruese në treg. ADSH ka rreth 200 produkte në disponim.
            </p>
          </div>
          <div className="about-image">
            <img src="/assets/Slideshow 5.png" alt="ADSH History" />
          </div>
        </div>
      </section>

      {/*========================= Mission Section ========================*/}

      <section data-aos="fade-up" className="card-container container">
        <p className="card-text-mission container">
          Me një trashëgimi mbi 26 vjet eksperiencë në industrinë e lëndëve të para për bulmetore, akullore, pastiçeri, furra dhe më shumë, ADSH-2014 synon të ofrojë produkte me cilësi të lartë dhe çmime konkurruese. Ne jemi të përkushtuar të mbështesim klientët tanë në prodhimin e produkteve cilësore, duke u ofruar një gamë të gjerë prej rreth 200 artikujsh.
        </p>
        {cards.map((card, index) => (
          <div key={index} className="card">
            <h2 className="card-title">{card.title}</h2>
            <p className="card-text">
              {card.text}
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
