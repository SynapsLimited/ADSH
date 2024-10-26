import React, { useState } from 'react';
import { Palette, ChevronUp } from 'lucide-react';
import './../css/themetoggle.css';

const colorOptions = [
  { name: 'Verë', class: 'normal' },
  { name: 'Vjeshtë', class: 'yellowish-beige' },
  { name: 'Dimër', class: 'light-blue' },
  { name: 'Pranverë', class: 'green' },

];

export default function ThemeToggle({ updateTheme, currentTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeClass) => {
    updateTheme(themeClass);
    setIsOpen(false);
  };

  return (
    <div className="theme-toggle">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toggle-button"
        aria-label="Open color changer menu"
      >
        {isOpen ? <ChevronUp className="icon" /> : <Palette className="icon" />}
      </button>

      <div className={`theme-menu ${isOpen ? 'open' : 'closed'}`}>
        <div className="menu-content">
          <h3 className="menu-title">Ndrysho stinën!</h3>
          <div className="theme-options">
            {colorOptions.map((color) => (
              <button
                key={color.name}
                className={`theme-button ${color.class} ${currentTheme === color.class ? 'active' : ''}`}
                onClick={() => handleThemeChange(color.class)}
                aria-label={`Set ${color.name} theme`}
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
