// components/ClientWrapper.tsx
'use client';
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ThemeToggle from './ThemeToggle';

const ClientWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('normal');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
    AOS.refresh();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    } else {
      setCurrentTheme('normal');
      localStorage.setItem('theme', 'normal');
    }
  }, []);

  const updateTheme = (themeClass: string) => {
    setCurrentTheme(themeClass);
    localStorage.setItem('theme', themeClass);
  };

  return (
    <>
      <ThemeToggle updateTheme={updateTheme} currentTheme={currentTheme} />
      <div className={`theme-container ${currentTheme}`}>
        {children}
      </div>
    </>
  );
};

export default ClientWrapper;