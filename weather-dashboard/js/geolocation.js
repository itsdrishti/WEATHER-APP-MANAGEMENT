import { getWeatherByCoords } from './api.js';

/**
 * Prompts user for geolocation and returns the weather data
 */
export function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
        } else {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    try {
                        const data = await getWeatherByCoords(lat, lon);
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                },
                (error) => {
                    reject(new Error('Unable to retrieve your location'));
                }
            );
        }
    });
}
