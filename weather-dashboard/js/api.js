// Configuration
const API_KEY = 'YOUR_API_KEY'; // Replace with actual key or rely on mock data if missing
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * Fetches current weather data for a given city
 */
export async function getWeatherData(city) {
    try {
        const response = await fetch(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
}

/**
 * Fetches 5-day forecast data for a given city
 */
export async function getForecastData(city) {
    try {
        const response = await fetch(`${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Forecast not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching forecast:', error);
        throw error;
    }
}

/**
 * Fetches weather by geographical coordinates
 */
export async function getWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Location weather not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching location weather:', error);
        throw error;
    }
}

/**
 * Fetches air quality index using coordinates
 */
export async function getAirQuality(lat, lon) {
    try {
        const response = await fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        if (!response.ok) {
            throw new Error('AQI not found');
        }
        const data = await response.json();
        return data.list[0].main.aqi; // Returns 1 (Good) to 5 (Very Poor)
    } catch (error) {
        console.error('Error fetching AQI:', error);
        return null;
    }
}
