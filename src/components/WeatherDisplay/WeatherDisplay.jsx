import React, { useState, useEffect } from 'react';
import { getWeatherData, getWeatherIcon } from '../../services/weatherService';

function WeatherDisplay({ coords, destinationName }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function fetchWeather() {
            setLoading(true);
            const data = await getWeatherData(coords[0], coords[1]);
            
            if (mounted) {
                setWeather(data);
                setLoading(false);
            }
        }

        fetchWeather();
        const interval = setInterval(fetchWeather, 600000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [coords]);

    if (loading) {
        return (
            <div className="absolute top-3 right-2 text-white">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-white/30 border-t-white/70 rounded-full animate-spin"></div>
                    <div className="w-6 h-5"></div>
                </div>
            </div>
        );
    }

    if (!weather) {
        return null;
    }

    return (
        <div className="absolute top-3 right-2 text-white">
            <div className="flex items-center gap-1">
                <span className="text-sm">{getWeatherIcon(weather.weatherCode)}</span>
                <div className="flex flex-col leading-tight">
                    <span className="text-[11px] font-medium">{weather.temp}°</span>
                    <span className="text-[9px] text-white/60">{weather.wind}km/h</span>
                </div>
            </div>
        </div>
    );
}

export default WeatherDisplay;