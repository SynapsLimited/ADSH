import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../css/navbar.css';
import ReactCountryFlag from 'react-country-flag';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState({ label: 'AL', languageCode: 'sq' });

  const languages = [
    { label: 'AL', languageCode: 'sq', countryCode: 'AL' },
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
      }, 700);
    } else {
      setIsLanguageDropdownOpen(true);
    }
  };

  const handleLanguageChange = (langOption) => {
    setLanguage(langOption);
    localStorage.setItem('preferredLanguage', JSON.stringify(langOption));

    // Find the Google Translate dropdown
    const googleFrame = document.querySelector('.goog-te-combo');
    if (googleFrame) {
      googleFrame.value = langOption.languageCode;
      googleFrame.dispatchEvent(new Event('change'));  // Trigger Google Translate to switch languages
    }

    setIsLanguageDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      try {
        const langOption = JSON.parse(savedLanguage);
        setLanguage(langOption);
      } catch (error) {
        setLanguage({ label: 'AL', languageCode: 'sq' });  // Default to AL
      }
    } else {
      // Default to AL (Albanian)
      setLanguage({ label: 'AL', languageCode: 'sq' });
    }

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Load Google Translate script
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        { 
          pageLanguage: 'sq',  // Set default language to Albanian
          includedLanguages: 'sq,en',  // Include both Albanian and English
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE 
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.crossOrigin = 'anonymous';  // Add crossorigin attribute
    document.body.appendChild(script);
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
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
    </div>
  );
};

export default Navbar;
