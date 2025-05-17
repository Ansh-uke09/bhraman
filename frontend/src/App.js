import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Complete mock data with all required fields
    const mockData = {
      air_quality: {
        aqi: 72,
        pm25: 23,
        pm10: 45,
        co: 1.2,
        last_updated: new Date().toISOString()
      },
      weather: {
        temperature: 28,
        humidity: 65,
        conditions: "Sunny",
        wind_speed: 12,
        last_updated: new Date().toISOString()
      },
      recommendation: "Good conditions for outdoor activities"
    };
    
    setData(mockData);
  }, []);

  return (
    <div className="App">
      {data ? <Dashboard data={data} /> : <div>Loading...</div>}
    </div>
  );
}

export default App;