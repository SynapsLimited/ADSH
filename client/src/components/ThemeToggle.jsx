// src/components/ThemeToggle.jsx

import React, { useState } from 'react';
import { Palette, ChevronUp } from 'lucide-react';
import './../css/themetoggle.css';
import { useTranslation } from 'react-i18next';

export default function ThemeToggle({ updateTheme, currentTheme }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  // Define colorOptions inside the component to access 't'
  const colorOptions = [
    { name: t('colors.summer'), class: 'normal' },
    { name: t('colors.autumn'), class: 'yellowish-beige' },
    { name: t('colors.winter'), class: 'light-blue' },
    { name: t('colors.spring'), class: 'green' },
  ];

  const handleThemeChange = (themeClass) => {
    updateTheme(themeClass);
    setIsOpen(false);
  };

  return (
    <div className="theme-toggle">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toggle-button"
        aria-label={t('themeToggle.changeTheme')}
      >
        {isOpen ? <ChevronUp className="icon" /> : <Palette className="icon" />}
      </button>

      <div className={`theme-menu ${isOpen ? 'open' : 'closed'}`}>
        <div className="menu-content">
          <h3 className="menu-title">{t('themeToggle.changeTheme')}</h3>
          <div className="theme-options">
            {colorOptions.map((color) => (
              <button
                key={color.class}
                className={`theme-button ${color.class} ${currentTheme === color.class ? 'active' : ''}`}
                onClick={() => handleThemeChange(color.class)}
                aria-label={t('themeToggle.setTheme', { theme: color.name })}
              >
                {color.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
