// components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../css/navbar.css';
import ReactCountryFlag from 'react-country-flag';


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState({ label: 'EN', languageCode: 'en' });

  const languages = [
    { label: 'EN', languageCode: 'en', countryCode: 'US' },
    { label: 'AL', languageCode: 'sq', countryCode: 'AL' },
  ];

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    const navHeight = document.querySelector('.nav-wrapper').offsetHeight;
    setIsScrolled(scrollTop > navHeight);
  };

  const handleLanguageDropdownToggle = (e) => {
    e.preventDefault();
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (isLanguageDropdownOpen) {
      // Add the 'hide' class for closing animation
      dropdownMenu.classList.add('hide');

      // Wait for the animation to finish before actually closing the menu
      setTimeout(() => {
        setIsLanguageDropdownOpen(false);
        dropdownMenu.classList.remove('hide');
      }, 700); // Adjust the timeout based on the animation duration
    } else {
      setIsLanguageDropdownOpen(true);
    }
  };

  const handleLanguageChange = (langOption) => {
    setLanguage(langOption);
    localStorage.setItem('preferredLanguage', JSON.stringify(langOption)); // Save to localStorage
    setIsLanguageDropdownOpen(false);
    setIsMobileMenuOpen(false); // Close the mobile menu when a language is selected
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      try {
        const langOption = JSON.parse(savedLanguage);
        setLanguage(langOption);
      } catch (error) {
        // If parsing fails, assume savedLanguage is a string like "EN"
        setLanguage({ label: savedLanguage, languageCode: savedLanguage.toLowerCase() });
      }
    } else {
      // Default to English
      setLanguage({ label: 'EN', languageCode: 'en' });
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
      <div className={`page-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <div className={`nav-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="navbar">
          <Link to="/" onClick={handleMenuClose}>
            <img src="/assets/Logo-Red.png" alt="ADSH Logo" className={isScrolled ? 'scrolled' : ''} />
          </Link>
          <div
            className={`menu-toggle ${isMobileMenuOpen ? 'is-active' : ''} ${isScrolled ? 'scrolled' : ''}`}
            id="mobile-menu"
            onClick={handleMenuToggle}
          >
            <span className={`bar ${isScrolled ? 'scrolled' : ''}`}></span>
            <span className={`bar ${isScrolled ? 'scrolled' : ''}`}></span>
            <span className={`bar ${isScrolled ? 'scrolled' : ''}`}></span>
          </div>
          <ul className={`nav no-search ${isMobileMenuOpen ? 'mobile-nav' : ''} ${isScrolled ? 'scrolled' : ''}`}>
            <li className="nav-item">
              <Link to="/" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>Kryesore</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>Rreth Nesh </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>Produkte</Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>Artikujt</Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>Kontakt</Link>
            </li>
            <li className="nav-item has-dropdown">
              <a href="/" className={isScrolled ? 'scrolled' : ''} onClick={handleLanguageDropdownToggle}>
                {language.label}
              </a>
              <ul className={`dropdown-menu ${isLanguageDropdownOpen ? 'show' : ''} ${isScrolled ? 'scrolled' : ''}`}>
                {languages.map((langOption, index) => (
                  <li
                    key={langOption.label}
                    className={`${isScrolled ? 'scrolled' : ''} ${index === languages.length - 1 ? 'last-link' : ''}`}
                    onClick={() => handleLanguageChange(langOption)}
                  >
                    <ReactCountryFlag countryCode={langOption.countryCode} svg className="country-flags" />{' '}
                    {langOption.label}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      </div>

  );
};

export default Navbar;
