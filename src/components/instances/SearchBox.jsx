import { Search } from 'lucide-react';
import React, { useState } from 'react';

const SearchBox = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
      <div className="flex">
        <div className="relative w-full">
          <input
            type="search"
            id="search"
            className="block p-1 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300   pr-1   "
            placeholder="Search..."
            value={searchTerm}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="absolute inset-y-0 right-0 p-1 text-sm font-medium text-gray-900 bg-gray-50 rounded-r-lg border border-gray-300 hover:bg-gray-100" // Updated classes
          >
            <Search className="w-5 h-5 text-gray-900 dark:text-white" /> {/* Updated icon color */}
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBox;