import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchCities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const fetchCityData = async (city) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data`, {
      params: { city }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching city data:', error);
    throw error;
  }
};

export const fetchCityRecommendation = async (city) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recommendation`, {
      params: { city }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }
};