import React, { useEffect, useState } from 'react';
import './../css/contact.css'; 
import { Helmet } from 'react-helmet-async';
import ContactForm from '../components/ContactForm';

const Contact = () => {
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
                <title>ADSH - Contact</title>
            </Helmet>
 {/* Hero Section */}
 <div
        className="hero-container-contact"
        style={{ backgroundPositionY: `${scrollPosition * 0}px` }} // Apply parallax effect
      >
        <div className="hero-content">
          {/* Text Section */}
          <h1 className="hero-title-h1">Contact</h1>
          <p className="hero-description">
            Lorem ipsum dolor sit amet consectetur. Maecenas mollis mus ut risus at aenean dignissim. Patea tempor vitae suspendisse pellentesque.
          </p>

          {/* Contact Button */}
          <a href="/contact" className="btn btn-primary">Contact</a>
        </div>
      </div>

            <div className="contact-overview-title">
                <h1>Contact Details</h1>
            </div>

            <section data-aos="fade-up"  className="container contact-section">
                <div className="blob location-blob">
                    <h2>Location</h2>
                    <a href='https://maps.app.goo.gl/bumqeQ7GmkcZK42F9'>
                    <img className="location-img" src="/assets/Europe Map.png" alt="Map of Europe" />
                    </a>
                    <p>Tirana, Albania</p>
                </div>
                <div className="blob phone-mail-blob">
                    <h2>Contact</h2>
                    <img src="/assets/phone-call.png" alt="Phone Icon" />
                    <a href="tel:+355692074234"><h4>+355 69 20 74 234</h4></a>
                    <img src="/assets/email.png" alt="Email Icon" />
                    <a href="mailto:info@example.com"><h4>info@example.com</h4></a>
                </div>
                <div className="blob socials-blob">
                    <h2>Socials</h2>
                    <div className="social-icons">
                        <a href="https://www.facebook.com" className="contact-link"><img src="/assets/facebook.png" alt="Facebook Icon" /></a>
                        <a href="https://www.instagram.com" className="contact-link"><img src="/assets/instagram.png" alt="Instagram Icon" /></a>
                        <a href="https://www.linkedin.com" className="contact-link"><img src="/assets/linkedin.png" alt="LinkedIn Icon" /></a>
                    </div>
                </div>
            </section>


            <div className="contact-overview-title">
                <h1>Location</h1>
            </div>

            <section data-aos="fade-up" className="map-section container">
        <div className="map-container">
        <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1498.30682134506!2d19.7912799!3d41.3172679!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x135031b2d86be505%3A0x7f9de65e08ceaa89!2sADSH-2014!5e0!3m2!1sen!2s!4v1729073480619!5m2!1sen!2s" 
              width="auto" 
              height="auto" 
              loading="lazy" 
              title="ADSH Location Google Maps"
          ></iframe>
        </div>
      </section>

            <div className="contact-overview-title">
                <h1>Contact Now</h1>
                <p>Get in touch with us for the products of your needs.</p>
            </div>

            <ContactForm />
        </div>
    );
};

export default Contact;
