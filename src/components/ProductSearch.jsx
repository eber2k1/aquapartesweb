import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

export const ProductSearch = ({ onSearch, initialValue = '' }) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  // Handle search with debounce, but update immediately when clearing
  useEffect(() => {
    // If search is being cleared, update immediately
    if (searchTerm === '') {
      onSearch('');
      return;
    }
    
    // Otherwise, debounce the search
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  return (
    <div className="relative w-full max-w-md mx-auto mb-8">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="search"
          id="product-search-input"
          name="search"
          className={`block w-full pl-10 pr-3 py-2 border ${
            isFocused ? 'border-sky-500 ring-1 ring-sky-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm`}
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Buscar productos"
          autoComplete="off"
        />
      </div>
    </div>
  );
};
