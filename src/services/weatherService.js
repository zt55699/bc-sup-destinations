const BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_PREFIX = 'weather_cache_v5_';

function getCacheKey(lat, lon) {
    return `${CACHE_PREFIX}${lat.toFixed(2)}_${lon.toFixed(2)}`;
}

function getCachedWeather(lat, lon, allowExpired = false) {
    try {
        const cacheKey = getCacheKey(lat, lon);
        const cached = localStorage.getItem(cacheKey);
        
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache is expired
        if (now - timestamp > CACHE_DURATION) {
            if (allowExpired) {
                return data; // Return expired data if allowed
            }
            localStorage.removeItem(cacheKey);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Error reading weather cache:', error);
        return null;
    }
}

function setCachedWeather(lat, lon, data) {
    try {
        const cacheKey = getCacheKey(lat, lon);
        const cacheData = {
            data,
            timestamp: Date.now()
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error setting weather cache:', error);
    }
}

export async function getWeatherData(lat, lon) {
    // Check cache first
    const cachedData = getCachedWeather(lat, lon);
    if (cachedData) {
        return cachedData;
    }
    
    try {
        const url = `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,apparent_temperature&hourly=temperature_2m,weather_code,wind_speed_10m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=America/Vancouver`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Weather data fetch failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.current) {
            return null;
        }
        
        // Process today's hourly data for morning, afternoon, evening
        let todayHourly = null;
        if (data.hourly && data.hourly.time) {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            const todayIndices = data.hourly.time
                .map((time, index) => ({ time, index }))
                .filter(({ time }) => time.startsWith(today))
                .map(({ index }) => index);
            
            if (todayIndices.length > 0) {
                // Get data for every 3 hours from 6AM to 9PM
                const targetHours = [6, 9, 12, 15, 18, 21]; // 6AM, 9AM, 12PM, 3PM, 6PM, 9PM
                todayHourly = targetHours.map(hour => {
                    const hourIndex = todayIndices.find(i => {
                        const hourTime = new Date(data.hourly.time[i]).getHours();
                        return hourTime === hour;
                    });
                    
                    if (hourIndex !== undefined) {
                        return {
                            hour: `${hour}:00`,
                            hourNumber: hour,
                            temp: Math.round(data.hourly.temperature_2m[hourIndex]),
                            weatherCode: data.hourly.weather_code[hourIndex],
                            wind: Math.round(data.hourly.wind_speed_10m[hourIndex]),
                            precipitation: data.hourly.precipitation[hourIndex]
                        };
                    }
                    return null;
                }).filter(Boolean);
            }
        }

        const weatherData = {
            temp: Math.round(data.current.temperature_2m),
            condition: getWeatherCondition(data.current.weather_code),
            weatherCode: data.current.weather_code,
            wind: Math.round(data.current.wind_speed_10m),
            humidity: data.current.relative_humidity_2m,
            feelsLike: Math.round(data.current.apparent_temperature),
            todayHourly: todayHourly,
            forecast: (data.daily && data.daily.time && data.daily.time.length > 0) ? {
                dates: data.daily.time.slice(0, 5),
                maxTemps: data.daily.temperature_2m_max ? data.daily.temperature_2m_max.slice(0, 5).map(t => Math.round(t)) : [],
                minTemps: data.daily.temperature_2m_min ? data.daily.temperature_2m_min.slice(0, 5).map(t => Math.round(t)) : [],
                weatherCodes: data.daily.weather_code ? data.daily.weather_code.slice(0, 5) : [],
                precipitation: data.daily.precipitation_sum ? data.daily.precipitation_sum.slice(0, 5) : [],
                maxWind: data.daily.wind_speed_10m_max ? data.daily.wind_speed_10m_max.slice(0, 5).map(w => Math.round(w)) : []
            } : null
        };
        
        
        // Cache the successful response
        setCachedWeather(lat, lon, weatherData);
        
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather:', error);
        
        // Try to return cached data even if expired
        const expiredCache = getCachedWeather(lat, lon, true);
        if (expiredCache) {
            return expiredCache;
        }
        
        return null;
    }
}

function getWeatherCondition(code) {
    const weatherCodes = {
        0: '晴朗',
        1: '大部晴朗', 
        2: '局部多云',
        3: '阴天',
        45: '有雾',
        48: '雾凇',
        51: '小雨',
        53: '中雨',
        55: '大雨',
        61: '小阵雨',
        63: '中阵雨',
        65: '大阵雨',
        71: '小雪',
        73: '中雪',
        75: '大雪',
        77: '雪粒',
        80: '小阵雨',
        81: '中阵雨',
        82: '强阵雨',
        85: '小阵雪',
        86: '大阵雪',
        95: '雷暴',
        96: '冰雹雷暴',
        99: '强冰雹雷暴'
    };
    
    return weatherCodes[code] || '未知';
}

export function getWeatherIcon(weatherCode, hour = null) {
    const currentHour = hour !== null ? hour : new Date().getHours();
    const isDay = currentHour >= 6 && currentHour < 18;
    
    if ([0, 1].includes(weatherCode)) {
        return isDay ? '☀️' : '🌙';
    } else if ([2].includes(weatherCode)) {
        return isDay ? '🌤️' : '☁️';
    } else if ([3].includes(weatherCode)) {
        return '☁️';
    } else if ([45, 48].includes(weatherCode)) {
        return '🌫️';
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
        return '🌧️';
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
        return '❄️';
    } else if ([95, 96, 99].includes(weatherCode)) {
        return '⛈️';
    }
    return isDay ? '🌤️' : '🌙';
}