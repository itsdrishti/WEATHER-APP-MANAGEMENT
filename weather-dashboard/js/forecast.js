import { formatDate, getWeatherIconUrl } from './utils.js';

/**
 * Processes raw forecast data from API into daily chunks
 * The API returns 3-hour chunks (40 items total for 5 days)
 */
export function processForecastData(forecastData) {
    const dailyData = [];
    const processedDays = new Set();
    
    for (const item of forecastData.list) {
        // Use local date from unix timestamp to group by day
        const dateObj = new Date((item.dt + forecastData.city.timezone) * 1000);
        // Get day of week string
        const dayString = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
        
        // We take the first item of each day as the representative for that day
        // (Alternatively, we could find the max/min of the day)
        if (!processedDays.has(dayString) && dailyData.length < 5) {
            processedDays.add(dayString);
            dailyData.push({
                day: dayString,
                temp: Math.round(item.main.temp),
                icon: getWeatherIconUrl(item.weather[0].icon),
                desc: item.weather[0].main
            });
        }
    }
    
    return dailyData;
}

/**
 * Extracts temperature trend data for the Chart
 */
export function extractChartData(forecastData) {
    // Take the next 8 chunks (24 hours)
    const next24Hours = forecastData.list.slice(0, 8);
    
    const labels = next24Hours.map(item => {
        const date = new Date((item.dt + forecastData.city.timezone) * 1000);
        let hours = date.getUTCHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours} ${ampm}`;
    });
    
    const temps = next24Hours.map(item => Math.round(item.main.temp));
    
    return { labels, temps };
}
