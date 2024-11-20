import react from 'react';
import './App.css';





const SearchBar = ({ onSearch, onAddClick }) => {

    return (
      <div className="search-container">
        <input
          type="text"
          placeholder="Search people"
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
        <button onClick={onAddClick} className="add-button">
          +
        </button>
      </div>
    );
  };

  export default SearchBar;