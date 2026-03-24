import { useState } from 'react';

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className='search-bar'>
      <span className='search-icon'>🔍</span>
      {/* Donde el usuario escribe */}
      <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      {query && (
        <button
          className="search-clear"
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
        >
          x
        </button>
      )}
    </div>
  );
}
