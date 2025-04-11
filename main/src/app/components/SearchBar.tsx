'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '@/css/searchbar.css';
import { useTranslation } from 'react-i18next';

interface Suggestion {
  product: { _id: string };
  displayText: string;
}

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  suggestions,
  onSuggestionClick,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleFocus = () => {
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setShowSuggestions(false);
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