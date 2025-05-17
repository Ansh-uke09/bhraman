// WeatherForecast.js
import React, { useEffect, useState } from 'react';
import '../styles/WeatherForecast.css';
import { fetchCityData } from './api';

const WeatherForecast = ({ city }) => {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const loadForecast = async () => {
      try {
        const data = await fetchCityData(city);
        const currentWeather = data.weather;
        const generatedForecast = [];

        for (let i = 1; i <= 5; i++) {
          const tempShift = Math.random() * 6 - 3;
          const temp = Math.max(-10, Math.min(40, currentWeather.temperature + tempShift));
          const conditions = [
            "Sunny", "Cloudy", "Rain", "Thunderstorm", "Snow", "Clear"
          ][Math.floor(Math.random() * 6)];

          const date = new Date();
          date.setDate(date.getDate() + i);

          generatedForecast.push({
            date: date.toDateString(),
            temperature: temp.toFixed(1),
            conditions
          });
        }

        setForecast(generatedForecast);
      } catch (err) {
        console.error('Failed to load forecast', err);
      }
    };

    loadForecast();
  }, [city]);

  return (
    <div className="forecast-card">
      <h3>5-Day Weather Forecast</h3>
      <div className="forecast-grid">
        {forecast.map((day, idx) => (
          <div key={idx} className="forecast-day">
            <div className="date">{day.date}</div>
            <div className="temp">{day.temperature}°C</div>
            <div className="cond">{day.conditions}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;
