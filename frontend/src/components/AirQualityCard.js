import React from 'react';
import '../styles/AirQualityCard.css';

const AirQualityCard = ({ airQuality, city }) => {
  const getAqiLevel = (aqi) => {
    if (!aqi) return { level: 'Unknown', color: 'gray', icon: '❓' };
    if (aqi <= 50) return { level: 'Good', color: '#2ecc71', icon: '😊' };
    if (aqi <= 100) return { level: 'Moderate', color: '#f1c40f', icon: '🙂' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#e67e22', icon: '😷' };
    if (aqi <= 200) return { level: 'Unhealthy', color: '#e74c3c', icon: '😨' };
    if (aqi <= 300) return { level: 'Very Unhealthy', color: '#9b59b6', icon: '😱' };
    return { level: 'Hazardous', color: '#7D3C98', icon: '☠️' };
  };

  const aqiLevel = getAqiLevel(airQuality?.aqi);

  return (
    <div className="air-quality-card" style={{ borderColor: aqiLevel.color }}>
      <div className="card-header">
        <h3>Air Quality {city && `in ${city.replace(/_/g, ' ')}`}</h3>
        <span className="aqi-icon">{aqiLevel.icon}</span>
      </div>
      
      <div className="aqi-display" style={{ backgroundColor: aqiLevel.color }}>
        <div className="aqi-value">{airQuality?.aqi || '--'}</div>
        <div className="aqi-level">{aqiLevel.level}</div>
      </div>
      
      <div className="pollutants-grid">
        <div className="pollutant">
          <span className="pollutant-name">PM2.5</span>
          <span className="pollutant-value">{airQuality?.pm25 || '--'} µg/m³</span>
        </div>
        {/* Add more pollutants in the same format */}
      </div>
      
      <div className="card-footer">
        <p className="dominant-pollutant">
          Dominant Pollutant: {airQuality?.dominant_pollutant || '--'}
        </p>
        <p className="updated">
          Updated: {new Date(airQuality?.last_updated).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default AirQualityCard;