import React from 'react';

function WeatherIcon({ weatherCode, hour = null, className = "w-5 h-5" }) {
    const currentHour = hour !== null ? hour : new Date().getHours();
    const isDay = currentHour >= 6 && currentHour < 18;
    
    if ([0, 1].includes(weatherCode)) {
        return isDay ? (
            <svg className={`${className} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className={`${className} text-yellow-300`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
        );
    } else if ([2].includes(weatherCode)) {
        return isDay ? (
            <svg className={`${className} text-yellow-300`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className={`${className} text-gray-400`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
        );
    } else if ([3].includes(weatherCode)) {
        return (
            <svg className={`${className} text-gray-400`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
            </svg>
        );
    } else if ([45, 48].includes(weatherCode)) {
        return (
            <svg className={`${className} text-gray-300`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        );
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) {
        return (
            <svg className={`${className} text-blue-400`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8zM5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm2 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        );
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
        return (
            <svg className={`${className} text-blue-100`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8zm5.5-4a1 1 0 100-2 1 1 0 000 2zm-3 1a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
        );
    } else if ([95, 96, 99].includes(weatherCode)) {
        return (
            <svg className={`${className} text-yellow-300`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8zm2.5-6a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
        );
    }
    return isDay ? (
        <svg className={`${className} text-yellow-300`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" clipRule="evenodd" />
        </svg>
    ) : (
        <svg className={`${className} text-yellow-300`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 716.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
    );
}

export default WeatherIcon;