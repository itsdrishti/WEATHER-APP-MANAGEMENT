import { getWeatherData, getForecastData, getAirQuality } from './api.js';
import { processForecastData, extractChartData } from './forecast.js';
import { renderChart } from './chart.js';
import { getUserLocation } from './geolocation.js';
import { initVoiceSearch } from './voiceSearch.js';
import { UI } from './ui.js';
import { getTheme, setTheme, getFavorites, saveFavorite, removeFavorite, isFavorite, getLastCity, setLastCity } from './storage.js';

let currentCity = '';

/**
 * Loads HTML components dynamically to keep code modular
 */
async function loadComponents() {
    try {
        const [navbarRes, weatherCardRes, forecastCardRes, footerRes] = await Promise.all([
            fetch('./components/navbar.html'),
            fetch('./components/weatherCard.html'),
            fetch('./components/forecastCard.html'),
            fetch('./components/footer.html')
        ]);

        document.getElementById('navbar-container').innerHTML = await navbarRes.text();
        document.getElementById('weather-card-container').innerHTML = await weatherCardRes.text();
        document.getElementById('forecast-container').innerHTML = await forecastCardRes.text();
        document.getElementById('footer-container').innerHTML = await footerRes.text();
    } catch (error) {
        console.error('Error loading components:', error);
        // Fallback for simple local viewing without server (mock UI won't work well without fetch)
        document.getElementById('error-message').classList.remove('hidden');
        document.getElementById('error-text').textContent = "Could not load components. Please run on a local server (e.g. npx serve).";
    }
}

/**
 * Main application initialization
 */
async function init() {
    await loadComponents();
    
    // Set initial theme
    const savedTheme = getTheme();
    setTheme(savedTheme);

    // Init UI elements
    UI.initElements();

    // Bind Event Listeners
    bindEvents();

    // Load initial data
    const lastCity = getLastCity() || 'London'; // Default to London if nothing saved
    fetchAndDisplayWeather(lastCity);
}

function bindEvents() {
    // Search form submission
    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const city = UI.elements.searchInput.value.trim();
        if (city) {
            fetchAndDisplayWeather(city);
            UI.elements.searchInput.blur();
            UI.elements.searchInput.value = '';
        }
    });

    // Location button
    document.getElementById('location-btn').addEventListener('click', async () => {
        try {
            UI.showLoading();
            const weatherData = await getUserLocation();
            handleWeatherData(weatherData);
        } catch (error) {
            UI.showError(error.message || 'Could not get location weather.');
        }
    });

    // Voice Search
    const voiceBtn = document.getElementById('voice-btn');
    if (voiceBtn) {
        const recognition = initVoiceSearch((transcript) => {
            UI.elements.searchInput.value = transcript;
            fetchAndDisplayWeather(transcript);
        });
        
        voiceBtn.addEventListener('click', () => {
            if (recognition) {
                UI.elements.searchInput.placeholder = 'Listening...';
                recognition.start();
                recognition.onend = () => {
                    UI.elements.searchInput.placeholder = 'Search for a city...';
                };
            } else {
                alert('Voice search not supported');
            }
        });
    }

    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const currentTheme = getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        
        // Re-render chart to match theme if data is loaded
        if (currentCity) {
            // We just need to trigger a redraw, but since we don't store chart data globally here, 
            // a full refetch is an easy way out, or just let the user see it on next search.
            // For better UX, we'd store the last chart data.
        }
    });

    // Save Favorite
    UI.elements.saveCityBtn.addEventListener('click', () => {
        if (!currentCity) return;
        
        if (isFavorite(currentCity)) {
            removeFavorite(currentCity);
        } else {
            saveFavorite(currentCity);
        }
        UI.updateSaveButton(currentCity);
        renderFavoritesDropdown();
    });

    // Favorites Dropdown
    const favBtn = document.getElementById('favorites-btn');
    const favList = document.getElementById('favorites-list');
    
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderFavoritesDropdown();
        favList.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        favList.classList.remove('show');
    });
    
    // Prevent dropdown from closing when clicking inside it
    favList.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

function renderFavoritesDropdown() {
    const favorites = getFavorites();
    UI.renderFavoritesList(
        favorites,
        (city) => { // onSelect
            fetchAndDisplayWeather(city);
            document.getElementById('favorites-list').classList.remove('show');
        },
        (city) => { // onRemove
            removeFavorite(city);
            renderFavoritesDropdown(); // Re-render list
            if (currentCity.toLowerCase() === city.toLowerCase()) {
                UI.updateSaveButton(currentCity);
            }
        }
    );
}

async function fetchAndDisplayWeather(city) {
    UI.showLoading();
    try {
        const weatherData = await getWeatherData(city);
        await handleWeatherData(weatherData);
    } catch (error) {
        UI.showError(error.message === 'City not found' ? 'City not found. Please try again.' : 'Failed to fetch data.');
        
        // If it fails because of missing API key, show helpful message
        if (error.message.includes('401')) {
            UI.showError('Invalid API Key. Please add your OpenWeatherMap API key in js/api.js');
        }
    }
}

async function handleWeatherData(weatherData) {
    currentCity = weatherData.name;
    setLastCity(currentCity);

    // Fetch AQI
    const aqiData = await getAirQuality(weatherData.coord.lat, weatherData.coord.lon);
    
    // Fetch Forecast
    const forecastData = await getForecastData(currentCity);
    
    // Process Data
    const dailyForecast = processForecastData(forecastData);
    const chartData = extractChartData(forecastData);

    // Update UI
    UI.updateCurrentWeather(weatherData, aqiData);
    UI.renderForecast(dailyForecast);
    
    // Render Chart
    setTimeout(() => {
        renderChart(chartData.labels, chartData.temps, getTheme());
    }, 100); // Slight delay to ensure DOM is fully ready

    UI.showDashboard();
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', init);
