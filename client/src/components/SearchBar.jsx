// src/components/SearchBar.jsx

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './../css/searchbar.css';
import { useTranslation } from 'react-i18next';

const SearchBar = ({ query, setQuery, suggestions, onSuggestionClick }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
      // Optionally prevent form submission or page refresh
      e.preventDefault();
    }
  };

  return (
    <div className="search-bar-container">
      <div className="search-icon">
        <Search className="search-icon-svg" />
      </div>
      <input
        type="search"
        className="search-input"
        placeholder={t('searchBar.placeholder')}
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="search-dropdown">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.product._id}-${index}`}
                onClick={() => onSuggestionClick(suggestion)}
              >
                <Search className="dropdown-icon" />
                <span>{suggestion.displayText}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
