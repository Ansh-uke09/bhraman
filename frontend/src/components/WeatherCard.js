// Enhanced WeatherCard.js
import React from 'react';
import '../styles/WeatherCard.css';

const WeatherCard = ({ weather }) => {
  return (
    <div className="weather-card">
      <h3>Weather</h3>
      <div className="weather-main">
        <div className="temp">{weather?.temperature || '--'}°C</div>
        <div className="conditions">{weather?.conditions || '--'}</div>
      </div>
      <div className="details">
        <p>Humidity: {weather?.humidity || '--'}%</p>
        <p>Wind Speed: {weather?.wind_speed || '--'} km/h</p>
        <p>Pressure: {weather?.pressure || '--'} hPa</p>
        <p>Visibility: {weather?.visibility || '--'} m</p>
        <p>UV Index: {weather?.uv_index || '--'}</p>
        <p className="updated">Updated: {new Date(weather?.last_updated).toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default WeatherCard;