import React from 'react';
import '../styles/CitySelector.css';

const CitySelector = ({ cities, selectedCity, onChange }) => {
  if (!cities || Object.keys(cities).length === 0) {
    return <div className="city-selector">Loading cities...</div>;
  }

  return (
    <div className="city-selector">
      <label htmlFor="city-select">Select City: </label>
      <select 
        id="city-select"
        value={selectedCity}
        onChange={(e) => onChange(e.target.value)}
        className="city-dropdown"
      >
        {Object.keys(cities).map(city => (
          <option key={city} value={city}>
            {city.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CitySelector;
