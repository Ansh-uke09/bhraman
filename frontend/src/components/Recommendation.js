import React from 'react';
import '../styles/Recommendation.css';

const Recommendation = ({ recommendation }) => {
  if (!recommendation || !recommendation.details) {
    return (
      <div className="recommendation-card">
        <h3><span className="icon">📋</span>Travel Recommendation</h3>
        <div className="advice">No recommendation available</div>
      </div>
    );
  }

  const { air_quality, weather, uv } = recommendation.details;
  const travel = recommendation.travel;

  // Determine CSS classes based on levels
  const getAirQualityClass = (level) => {
    if (!level) return '';
    if (level.includes('Good')) return 'aq-good';
    if (level.includes('Moderate')) return 'aq-moderate';
    if (level.includes('Unhealthy')) return 'aq-unhealthy';
    if (level.includes('Hazardous')) return 'aq-hazardous';
    return '';
  };

  const getWeatherClass = (level) => {
    if (!level) return '';
    if (level.includes('Pleasant') || level.includes('Cool')) return 'weather-pleasant';
    if (level.includes('Hot') || level.includes('Freezing') || level.includes('Cold')) return 'weather-extreme';
    return '';
  };

  const getUVClass = (level) => {
    if (!level) return '';
    if (level.includes('Low')) return 'uv-low';
    if (level.includes('Moderate') || level.includes('High')) return 'uv-high';
    if (level.includes('Very High') || level.includes('Extreme')) return 'uv-extreme';
    return '';
  };

  const getTravelClass = (score) => {
    if (score >= 3) return 'travel-good';
    if (score >= 2) return 'travel-moderate';
    return 'travel-poor';
  };

  return (
    <div className="recommendation-card">
      <h3><span className="icon">📋</span>Travel Recommendation</h3>

      <div className={`section ${getAirQualityClass(air_quality?.level)}`}>
        <h4><span className="icon">🌫️</span>Air Quality: {air_quality?.level} {air_quality?.icon}</h4>
        <p>{air_quality?.message}</p>
        <ul>
          {air_quality?.activities?.map((activity, i) => (
            <li key={i}>{activity}</li>
          ))}
        </ul>
      </div>

      <div className={`section ${getWeatherClass(weather?.level)}`}>
        <h4><span className="icon">🌤️</span>Weather: {weather?.level} {weather?.icon}</h4>
        <p>{weather?.message}</p>
        <ul>
          {weather?.clothing?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>

      <div className={`section ${getUVClass(uv?.level)}`}>
        <h4><span className="icon">☀️</span>UV Index: {uv?.level} {uv?.icon}</h4>
        <p>{uv?.message}</p>
        <ul>
          {uv?.protection?.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>

      <div className="section overall">
        <h4><span className="icon">✈️</span>Overall Travel Advice</h4>
        <p className={`travel-score ${getTravelClass(travel?.score)}`}>
          {travel?.icon} {travel?.message} (Score: {travel?.score}/4)
        </p>
        {travel?.concerns && travel.concerns.length > 0 && (
          <div className="concerns">
            <strong>Concerns:</strong>
            <ul>
              {travel.concerns.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendation;