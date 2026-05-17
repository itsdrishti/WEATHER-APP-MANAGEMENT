import { formatDate, formatTime, getWeatherIconUrl, getAqiText, getBackgroundClass } from './utils.js';
import { isFavorite } from './storage.js';

export const UI = {
    elements: {},

    initElements() {
        // Main sections
        this.elements.loadingSpinner = document.getElementById('loading-spinner');
        this.elements.errorMessage = document.getElementById('error-message');
        this.elements.errorText = document.getElementById('error-text');
        this.elements.dashboardContent = document.getElementById('dashboard-content');
        
        // Current Weather
        this.elements.cwCity = document.getElementById('cw-city');
        this.elements.cwDate = document.getElementById('cw-date');
        this.elements.cwIcon = document.getElementById('cw-icon');
        this.elements.cwTemp = document.getElementById('cw-temp');
        this.elements.cwDesc = document.getElementById('cw-desc');
        this.elements.cwFeelsLike = document.getElementById('cw-feels-like');
        this.elements.cwHumidity = document.getElementById('cw-humidity');
        this.elements.cwWind = document.getElementById('cw-wind');
        this.elements.cwPressure = document.getElementById('cw-pressure');
        this.elements.cwSunrise = document.getElementById('cw-sunrise');
        this.elements.cwSunset = document.getElementById('cw-sunset');
        this.elements.cwAqi = document.getElementById('cw-aqi');
        
        // Buttons/Inputs
        this.elements.saveCityBtn = document.getElementById('save-city-btn');
        this.elements.saveIcon = document.getElementById('save-icon');
        this.elements.saveText = document.getElementById('save-text');
        this.elements.searchInput = document.getElementById('search-input');
        
        // Forecast
        this.elements.forecastGrid = document.getElementById('forecast-grid');
    },

    showLoading() {
        this.elements.loadingSpinner.classList.remove('hidden');
        this.elements.dashboardContent.classList.add('hidden');
        this.elements.errorMessage.classList.add('hidden');
    },

    hideLoading() {
        this.elements.loadingSpinner.classList.add('hidden');
    },

    showError(message) {
        this.hideLoading();
        this.elements.dashboardContent.classList.add('hidden');
        this.elements.errorMessage.classList.remove('hidden');
        this.elements.errorText.textContent = message;
    },

    showDashboard() {
        this.hideLoading();
        this.elements.errorMessage.classList.add('hidden');
        this.elements.dashboardContent.classList.remove('hidden');
    },

    updateCurrentWeather(data, aqiData) {
        // Update background
        document.body.className = getBackgroundClass(data.weather[0].id);

        this.elements.cwCity.textContent = `${data.name}, ${data.sys.country}`;
        this.elements.cwDate.textContent = formatDate(data.dt, data.timezone);
        
        this.elements.cwIcon.src = getWeatherIconUrl(data.weather[0].icon);
        this.elements.cwIcon.alt = data.weather[0].description;
        this.elements.cwIcon.classList.remove('hidden');
        
        this.elements.cwTemp.textContent = Math.round(data.main.temp);
        this.elements.cwDesc.textContent = data.weather[0].description;
        this.elements.cwFeelsLike.textContent = Math.round(data.main.feels_like);
        
        this.elements.cwHumidity.textContent = `${data.main.humidity}%`;
        this.elements.cwWind.textContent = `${data.wind.speed} m/s`;
        this.elements.cwPressure.textContent = `${data.main.pressure} hPa`;
        
        this.elements.cwSunrise.textContent = formatTime(data.sys.sunrise, data.timezone);
        this.elements.cwSunset.textContent = formatTime(data.sys.sunset, data.timezone);
        
        if (aqiData) {
            this.elements.cwAqi.textContent = getAqiText(aqiData);
        } else {
            this.elements.cwAqi.textContent = 'N/A';
        }

        this.updateSaveButton(data.name);
    },

    updateSaveButton(cityName) {
        if (isFavorite(cityName)) {
            this.elements.saveCityBtn.classList.add('saved');
            this.elements.saveIcon.classList.remove('far');
            this.elements.saveIcon.classList.add('fas');
            this.elements.saveText.textContent = 'Saved';
        } else {
            this.elements.saveCityBtn.classList.remove('saved');
            this.elements.saveIcon.classList.remove('fas');
            this.elements.saveIcon.classList.add('far');
            this.elements.saveText.textContent = 'Save';
        }
    },

    renderForecast(dailyData) {
        this.elements.forecastGrid.innerHTML = '';
        
        dailyData.forEach(day => {
            const el = document.createElement('div');
            el.className = 'forecast-item';
            el.innerHTML = `
                <div class="fc-day">${day.day}</div>
                <img src="${day.icon}" alt="${day.desc}" class="fc-icon">
                <div class="fc-temp">${day.temp}°C</div>
                <div class="fc-temp-min">${day.desc}</div>
            `;
            this.elements.forecastGrid.appendChild(el);
        });
    },

    renderFavoritesList(favorites, onSelectCallback, onRemoveCallback) {
        const list = document.getElementById('favorites-list');
        list.innerHTML = '';

        if (favorites.length === 0) {
            list.innerHTML = '<div style="padding: 10px; text-align: center; color: var(--text-muted);">No saved cities</div>';
            return;
        }

        favorites.forEach(city => {
            const item = document.createElement('div');
            item.className = 'favorite-item';
            
            const citySpan = document.createElement('span');
            citySpan.textContent = city;
            citySpan.onclick = () => onSelectCallback(city);
            
            const removeBtn = document.createElement('i');
            removeBtn.className = 'fas fa-trash fav-delete';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                onRemoveCallback(city);
            };

            item.appendChild(citySpan);
            item.appendChild(removeBtn);
            list.appendChild(item);
        });
    }
};
