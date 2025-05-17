import React, { useState, useEffect, useRef } from 'react';
import AirQualityCard from './AirQualityCard';
import WeatherCard from './WeatherCard';
import Recommendation from './Recommendation';
import CitySelector from './CitySelector';
import PollutionChart from './PollutionChart';
import WeatherForecast from './WeatherForecast';
import { fetchCities, fetchCityData, fetchCityRecommendation } from './api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [selectedCity, setSelectedCity] = useState('agra');
  const [data, setData] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState({});
  const dashboardRef = useRef(null);

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const scrollElements = document.querySelectorAll('[data-scroll]');
    scrollElements.forEach((el) => observer.observe(el));

    return () => {
      scrollElements.forEach((el) => observer.unobserve(el));
    };
  }, [data, recommendation]);

  // Data fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const citiesResponse = await fetchCities();
        setCities(citiesResponse.details);

        const [cityData, recData] = await Promise.all([
          fetchCityData(selectedCity),
          fetchCityRecommendation(selectedCity)
        ]);
        
        setData(cityData);
        setRecommendation(recData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    const interval = setInterval(async () => {
      const [cityData, recData] = await Promise.all([
        fetchCityData(selectedCity),
        fetchCityRecommendation(selectedCity)
      ]);
      setData(cityData);
      setRecommendation(recData);
    }, 300000);

    return () => clearInterval(interval);
  }, [selectedCity]);

  const handleCityChange = async (city) => {
    setLoading(true);
    try {
      const [cityData, recData] = await Promise.all([
        fetchCityData(city),
        fetchCityRecommendation(city)
      ]);
      setData(cityData);
      setRecommendation(recData);
      setSelectedCity(city);
      
      // Smooth scroll to top on city change
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } catch (error) {
      console.error("Failed to load city data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container" ref={dashboardRef}>
      <header className="dashboard-header" data-scroll="fadeIn">
        <h1>Bhraman Climate Dashboard</h1>
        <CitySelector 
          cities={cities} 
          selectedCity={selectedCity} 
          onChange={handleCityChange}
        />
      </header>

      <div className="dashboard-grid">
        <div className="main-cards">
          <div data-scroll="fadeIn" style={{ animationDelay: '0.1s' }}>
            <AirQualityCard 
              airQuality={data?.air_quality} 
              city={selectedCity} 
            />
          </div>
          <div data-scroll="fadeIn" style={{ animationDelay: '0.2s' }}>
            <WeatherCard 
              weather={data?.weather} 
              city={selectedCity} 
            />
          </div>
        </div>

        <div className="secondary-cards">
          <div data-scroll="fadeIn" style={{ animationDelay: '0.3s' }}>
            <Recommendation 
              recommendation={recommendation} 
            />
          </div>
          <div data-scroll="fadeIn" style={{ animationDelay: '0.4s' }}>
            <PollutionChart 
              data={data?.air_quality} 
            />
          </div>
        </div>

        <div className="forecast-section" data-scroll="fadeIn" style={{ animationDelay: '0.5s' }}>
          <WeatherForecast 
            city={selectedCity} 
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;