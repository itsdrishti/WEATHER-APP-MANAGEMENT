/**
 * Manages LocalStorage operations for favorites and theme
 */

const STORAGE_KEYS = {
    FAVORITES: 'weather_favorites',
    THEME: 'weather_theme',
    LAST_CITY: 'weather_last_city'
};

export function getFavorites() {
    const favs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favs ? JSON.parse(favs) : [];
}

export function saveFavorite(city) {
    let favs = getFavorites();
    if (!favs.includes(city)) {
        favs.push(city);
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
    }
}

export function removeFavorite(city) {
    let favs = getFavorites();
    favs = favs.filter(c => c.toLowerCase() !== city.toLowerCase());
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
}

export function isFavorite(city) {
    const favs = getFavorites();
    return favs.some(c => c.toLowerCase() === city.toLowerCase());
}

export function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
}

export function setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
}

export function getLastCity() {
    return localStorage.getItem(STORAGE_KEYS.LAST_CITY);
}

export function setLastCity(city) {
    localStorage.setItem(STORAGE_KEYS.LAST_CITY, city);
}
