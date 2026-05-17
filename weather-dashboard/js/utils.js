/**
 * Formats a Unix timestamp into a readable date string
 */
export function formatDate(unixTime, timezoneOffset = 0) {
    // Add timezone offset (in seconds) to current time
    const date = new Date((unixTime + timezoneOffset) * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

/**
 * Formats a Unix timestamp into a readable time string
 */
export function formatTime(unixTime, timezoneOffset = 0) {
    const date = new Date((unixTime + timezoneOffset) * 1000);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
}

/**
 * Maps OpenWeatherMap icon codes to internal high-res images or font-awesome classes
 */
export function getWeatherIconUrl(iconCode) {
    // We use OpenWeatherMap's default icons for simplicity, but this can be changed to custom SVGs
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

/**
 * Returns a human-readable string for Air Quality Index
 */
export function getAqiText(aqi) {
    const aqiMap = {
        1: 'Good',
        2: 'Fair',
        3: 'Moderate',
        4: 'Poor',
        5: 'Very Poor'
    };
    return aqiMap[aqi] || 'Unknown';
}

/**
 * Returns the background class based on weather condition code
 */
export function getBackgroundClass(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return 'weather-bg-thunderstorm';
    if (weatherId >= 300 && weatherId < 600) return 'weather-bg-rain';
    if (weatherId >= 600 && weatherId < 700) return 'weather-bg-snow';
    if (weatherId >= 700 && weatherId < 800) return 'weather-bg-clouds'; // Atmosphere (fog, mist)
    if (weatherId === 800) return 'weather-bg-clear';
    if (weatherId > 800) return 'weather-bg-clouds';
    return 'weather-bg-default';
}
