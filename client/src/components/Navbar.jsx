// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../css/navbar.css';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState({ label: 'AL', languageCode: 'al', countryCode: 'AL' });

  const languages = [
    { label: 'AL', languageCode: 'al', countryCode: 'AL' },
    { label: 'EN', languageCode: 'en', countryCode: 'US' },
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
      dropdownMenu.classList.add('hide');
      setTimeout(() => {
        setIsLanguageDropdownOpen(false);
        dropdownMenu.classList.remove('hide');
      }, 700); // Adjust the timeout based on the animation duration
    } else {
      setIsLanguageDropdownOpen(true);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', JSON.stringify(lang)); // Save language as JSON
    setIsLanguageDropdownOpen(false);
    setIsMobileMenuOpen(false); // Close the mobile menu when a language is selected
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      try {
        const lang = JSON.parse(savedLanguage);
        setLanguage(lang);
      } catch (error) {
        console.error('Failed to parse saved language:', error);
        // If parsing fails, set to default AL
        const defaultLang = languages.find((lang) => lang.languageCode === 'al');
        if (defaultLang) {
          setLanguage(defaultLang);
          i18n.changeLanguage(defaultLang.languageCode);
          localStorage.setItem('preferredLanguage', JSON.stringify(defaultLang));
        }
      }
    } else {
      // If no language is saved, set 'AL' as default
      const defaultLang = languages.find((lang) => lang.languageCode === 'al');
      if (defaultLang) {
        setLanguage(defaultLang);
        i18n.changeLanguage(defaultLang.languageCode);
        localStorage.setItem('preferredLanguage', JSON.stringify(defaultLang));
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [i18n]);


  return (
    <div className={`page-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <div className={`nav-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="navbar">
          <Link to="/" onClick={handleMenuClose}>
            <img
              src="/assets/Logo-Red.png"
              alt="ADSH Logo"
              className={isScrolled ? 'scrolled' : ''}
            />
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
              <Link to="/" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>
                {t('navbar.home')}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>
                {t('navbar.about')}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/products" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>
                {t('navbar.products')}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/blog" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>
                {t('navbar.blog')}
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>
                {t('navbar.contact')}
              </Link>
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
      {/* Hidden Google Translate element */}
    </div>
  );
};

export default Navbar;
