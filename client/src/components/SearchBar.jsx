// src/components/SearchBar.jsx

import React from 'react';
import { Search } from 'lucide-react';
import './../css/searchbar.css'; // Import the corresponding CSS

const SearchBar = ({ query, setQuery, suggestions, onSuggestionClick }) => {
  return (
    <div className="search-bar-container">
      <div className="search-icon">
        <Search className="search-icon-svg" />
      </div>
      <input
        type="search"
        className="search-input"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="search-dropdown">
          <ul>
            {suggestions.map((suggestion) => (
              <li key={suggestion._id} onClick={() => onSuggestionClick(suggestion)}>
                <Search className="dropdown-icon" />
                <span>{suggestion.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
