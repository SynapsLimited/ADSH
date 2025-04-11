'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import '@/css/navbar.css';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';

interface LanguageOption {
  label: string;
  languageCode: string;
  countryCode: string;
}

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation(); // i18n is now provided by I18nProvider
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageOption>({
    label: 'AL',
    languageCode: 'sq',
    countryCode: 'AL',
  });

  const languages: LanguageOption[] = [
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
    const navHeight = (document.querySelector('.nav-wrapper') as HTMLElement)?.offsetHeight || 0;
    setIsScrolled(scrollTop > navHeight);
  };

  const handleLanguageDropdownToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    const dropdownMenu = document.querySelector('.dropdown-menu');
    if (isLanguageDropdownOpen) {
      dropdownMenu?.classList.add('hide');
      setTimeout(() => {
        setIsLanguageDropdownOpen(false);
        dropdownMenu?.classList.remove('hide');
      }, 700);
    } else {
      setIsLanguageDropdownOpen(true);
    }
  };

  const handleLanguageChange = (lang: LanguageOption) => {
    setLanguage(lang);
    localStorage.setItem('preferredLanguage', JSON.stringify(lang));
    i18n.changeLanguage(lang.languageCode).catch((error) =>
      console.error('Failed to change language:', error)
    );
    setIsLanguageDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const defaultLang = languages.find((lang) => lang.languageCode === 'sq') || languages[0];

    if (savedLanguage) {
      try {
        const lang = JSON.parse(savedLanguage) as LanguageOption;
        setLanguage(lang);
        i18n.changeLanguage(lang.languageCode).catch((error) =>
          console.error('Failed to change language:', error)
        );
      } catch (error) {
        console.error('Failed to parse saved language:', error);
        setLanguage(defaultLang);
        i18n.changeLanguage(defaultLang.languageCode);
        localStorage.setItem('preferredLanguage', JSON.stringify(defaultLang));
      }
    } else {
      setLanguage(defaultLang);
      i18n.changeLanguage(defaultLang.languageCode);
      localStorage.setItem('preferredLanguage', JSON.stringify(defaultLang));
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [i18n]);

  return (
    <div className={`page-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <div className={`nav-wrapper ${isScrolled ? 'scrolled' : ''}`}>
        <nav className="navbar">
          <Link href="/" onClick={handleMenuClose}>
            <img
              src="/assets/Logo-Red.png"
              alt="ADSH Logo"
              className={isScrolled ? 'scrolled' : ''}
            />
          </Link>
          <div
            className={`menu-toggle ${isMobileMenuOpen ? 'is-active' : ''} ${
              isScrolled ? 'scrolled' : ''
            }`}
            id="mobile-menu"
            onClick={handleMenuToggle}
          >
            <span className={`bar ${isScrolled ? 'scrolled' : ''}`}></span>
            <span className={`bar ${isScrolled ? 'scrolled' : ''}`}></span>
            <span className={`bar ${isScrolled ? 'scrolled' : ''}`}></span>
          </div>
          <ul
            className={`nav no-search ${isMobileMenuOpen ? 'mobile-nav' : ''} ${
              isScrolled ? 'scrolled' : ''
            }`}
          >
            <li className="nav-item">
              <Link href="/" className={isScrolled ? 'scrolled' : ''} onClick={handleMenuClose}>
                {t('navbar.home')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/about"
                className={isScrolled ? 'scrolled' : ''}
                onClick={handleMenuClose}
              >
                {t('navbar.about')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/products"
                className={isScrolled ? 'scrolled' : ''}
                onClick={handleMenuClose}
              >
                {t('navbar.products')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/blog"
                className={isScrolled ? 'scrolled' : ''}
                onClick={handleMenuClose}
              >
                {t('navbar.blog')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                href="/contact"
                className={isScrolled ? 'scrolled' : ''}
                onClick={handleMenuClose}
              >
                {t('navbar.contact')}
              </Link>
            </li>
            <li className="nav-item has-dropdown">
              <a
                href="#"
                className={isScrolled ? 'scrolled' : ''}
                onClick={handleLanguageDropdownToggle}
              >
                {language.label}
              </a>
              <ul
                className={`dropdown-menu ${isLanguageDropdownOpen ? 'show' : ''} ${
                  isScrolled ? 'scrolled' : ''
                }`}
              >
                {languages.map((langOption, index) => (
                  <li
                    key={langOption.label}
                    className={`${isScrolled ? 'scrolled' : ''} ${
                      index === languages.length - 1 ? 'last-link' : ''
                    }`}
                    onClick={() => handleLanguageChange(langOption)}
                  >
                    <ReactCountryFlag
                      countryCode={langOption.countryCode}
                      svg
                      className="country-flags"
                    />{' '}
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