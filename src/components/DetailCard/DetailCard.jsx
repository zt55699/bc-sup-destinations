import React, { useState, useEffect } from 'react';
import ImageGallery from './ImageGallery.jsx';
import { getWeatherData } from '../../services/weatherService';
import WeatherIcon from '../WeatherIcon/WeatherIcon';

function DetailCard({ destination, onClose, mapInstanceRef, onShowRoute, isFavorite, onAddToFavorites, onRemoveFromFavorites }) {
    const [currentImage, setCurrentImage] = useState('');
    const [weatherForecast, setWeatherForecast] = useState(null);
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);

    useEffect(() => {
        if (destination) {
            const firstImage = destination.imageUrls ? destination.imageUrls[0] : destination.imageUrl;
            setCurrentImage(firstImage || '');
            
            // Fetch weather forecast
            async function fetchForecast() {
                try {
                    const weather = await getWeatherData(destination.coords[0], destination.coords[1], destination.name);
                    setWeatherForecast(weather);
                } catch (error) {
                    setWeatherForecast(null);
                }
            }
            fetchForecast();
        }
    }, [destination]);

    React.useEffect(() => {
        if (destination) {
            // Show the detail card with the same delay logic as original
            const currentZoom = mapInstanceRef?.current ? mapInstanceRef.current.getZoom() : 8;
            const delay = currentZoom > 11 ? 0 : Math.max(0, Math.min(1000, 1000 - (currentZoom - 8) * 143));
            
            const detailCard = document.getElementById('detail-card');
            if (detailCard) {
                if (delay > 0) {
                    setTimeout(() => {
                        detailCard.classList.remove('translate-y-full');
                    }, delay);
                } else {
                    detailCard.classList.remove('translate-y-full');
                }
            }
            
            // Hide the difficulty legend with animation
            const legend = document.getElementById('difficulty-legend');
            if (legend) {
                legend.style.opacity = '0';
                legend.style.transform = 'translateY(100%)';
            }
            
            // Reset scroll indicator when destination changes
            setShowScrollIndicator(true);
        }
    }, [destination, mapInstanceRef]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px threshold
        setShowScrollIndicator(!isAtBottom);
    };

    const formatDate = (dateString) => {
        // Parse date in local timezone to avoid UTC conversion issues
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
        const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const weekday = weekdays[date.getDay()];
        return `${month}/${day} ${weekday}`;
    };

    const renderDifficultyIcon = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
            case 'intermediate':
                return <div className="w-3 h-3 bg-blue-500"></div>;
            case 'advanced':
                return (
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-black transform rotate-45"></div>
                    </div>
                );
            case 'expert':
                return (
                    <div className="bg-white rounded-sm px-1 py-0.5 flex gap-0.5 h-4 items-center">
                        <div className="w-1.5 h-1.5 bg-black transform rotate-45"></div>
                        <div className="w-1.5 h-1.5 bg-black transform rotate-45"></div>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleFavoriteToggle = () => {
        if (isFavorite(destination.id)) {
            onRemoveFromFavorites(destination.id);
        } else {
            onAddToFavorites(destination);
        }
    };

    if (!destination) {
        return (
            <div id="detail-card" className="fixed bottom-0 left-0 right-0 z-20 p-4 transform translate-y-full transition-transform duration-700 ease-in-out">
            </div>
        );
    }

    return (
        <div id="detail-card" className="fixed bottom-0 left-0 right-0 z-20 p-4 transform translate-y-full transition-transform duration-700 ease-in-out">
            <div className="detail-card-container max-w-4xl mx-auto backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden relative"
                style={{
                    background: `linear-gradient(135deg, 
                        rgba(0, 0, 0, 0.5) 0%, 
                        rgba(0, 0, 0, 0.3) 25%,
                        rgba(0, 0, 0, 0.35) 50%,
                        rgba(0, 0, 0, 0.3) 75%,
                        rgba(0, 0, 0, 0.4) 100%)`,
                    boxShadow: `
                        inset 0 2px 0 0 rgba(255, 255, 255, 0.08),
                        inset 0 -2px 0 0 rgba(0, 0, 0, 0.15),
                        0 30px 90px rgba(0, 0, 0, 0.6),
                        0 15px 50px rgba(0, 0, 0, 0.4),
                        0 5px 20px rgba(0, 0, 0, 0.3)`
                }}>
                <div className="relative">
                    <img 
                        id="detail-image" 
                        src={currentImage || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23374151'/%3E%3C/svg%3E"} 
                        alt="目的地图片" 
                        className="w-full h-48 md:h-64 object-cover" 
                    />
                    
                    <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                        style={{
                            background: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%)`
                        }}>
                    </div>
                    
                    <div id="detail-difficulty-info" className="absolute bottom-0 left-0 right-0 px-4 py-2 text-sm text-white">
                        {destination.difficultyInfo}
                    </div>
                    
                    <button 
                        id="close-detail-card" 
                        onClick={onClose} 
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center backdrop-blur-2xl rounded-full text-white/80 hover:text-white transition-all duration-300 z-10"
                        style={{
                            background: `linear-gradient(135deg, 
                                rgba(255, 255, 255, 0.1) 0%, 
                                rgba(255, 255, 255, 0.05) 100%)`,
                            boxShadow: `
                                inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                                inset 0 -1px 0 0 rgba(0, 0, 0, 0.1),
                                0 4px 16px rgba(0, 0, 0, 0.3)`
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-5 md:p-6 relative">
                    {/* Bottom gradient overlay for entire detail card */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-10"
                        style={{
                            background: `linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%)`
                        }}>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 id="detail-name" className="text-2xl md:text-3xl font-bold text-white">{destination.name}</h2>
                            <div id="detail-difficulty">
                                {destination.difficulty && renderDifficultyIcon(destination.difficulty)}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleFavoriteToggle}
                                className={`w-8 h-8 flex items-center justify-center backdrop-blur-xl rounded-full transition-all duration-300 ${
                                    isFavorite(destination.id)
                                        ? 'text-pink-400 hover:text-pink-300'
                                        : 'text-white/60 hover:text-white'
                                }`}
                                style={{
                                    background: `linear-gradient(135deg, 
                                        ${isFavorite(destination.id) 
                                            ? 'rgba(244, 114, 182, 0.15) 0%, rgba(244, 114, 182, 0.08) 100%'
                                            : 'rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%'
                                        })`,
                                    boxShadow: `
                                        inset 0 1px 0 0 ${isFavorite(destination.id) 
                                            ? 'rgba(244, 114, 182, 0.25)'
                                            : 'rgba(255, 255, 255, 0.15)'
                                        },
                                        inset 0 -1px 0 0 rgba(0, 0, 0, 0.05),
                                        0 2px 8px ${isFavorite(destination.id) 
                                            ? 'rgba(244, 114, 182, 0.15)'
                                            : 'rgba(0, 0, 0, 0.2)'
                                        }`
                                }}
                                title={isFavorite(destination.id) ? "从收藏夹移除" : "添加到收藏夹"}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={isFavorite(destination.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>
                            {destination.route && (
                                <button 
                                    onClick={() => onShowRoute && onShowRoute(destination.coords, destination.route.coords, destination.route)}
                                    className="w-8 h-8 flex items-center justify-center backdrop-blur-xl rounded-full text-sky-400 hover:text-sky-300 transition-all duration-300"
                                    style={{
                                        background: `linear-gradient(135deg, 
                                            rgba(56, 189, 248, 0.15) 0%, 
                                            rgba(56, 189, 248, 0.08) 100%)`,
                                        boxShadow: `
                                            inset 0 1px 0 0 rgba(56, 189, 248, 0.25),
                                            inset 0 -1px 0 0 rgba(0, 0, 0, 0.05),
                                            0 2px 8px rgba(56, 189, 248, 0.15)`
                                    }}
                                    title="显示路线"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.91" strokeMiterlimit="10">
                                        <path d="M9.14,5.08c0,2.39-3.82,6-3.82,6S1.5,7.47,1.5,5.08A3.7,3.7,0,0,1,5.32,1.5,3.7,3.7,0,0,1,9.14,5.08Z"/>
                                        <circle fill="currentColor" cx="5.32" cy="5.32" r="0.95"/>
                                        <path d="M22.5,14.62c0,2.39-3.82,6-3.82,6s-3.82-3.58-3.82-6a3.7,3.7,0,0,1,3.82-3.57A3.7,3.7,0,0,1,22.5,14.62Z"/>
                                        <circle fill="currentColor" cx="18.68" cy="14.86" r="0.95"/>
                                        <path d="M4.36,13h4.3a2.39,2.39,0,0,1,2.39,2.39h0a2.39,2.39,0,0,1-2.39,2.39H3.89A2.39,2.39,0,0,0,1.5,20.11h0A2.39,2.39,0,0,0,3.89,22.5H19.64"/>
                                    </svg>
                                </button>
                            )}
                            <a 
                                id="detail-gmaps-link" 
                                href={destination.googleMapsUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-8 h-8 flex items-center justify-center backdrop-blur-xl rounded-full text-white/60 hover:text-white transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, 
                                        rgba(255, 255, 255, 0.08) 0%, 
                                        rgba(255, 255, 255, 0.05) 100%)`,
                                    boxShadow: `
                                        inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
                                        inset 0 -1px 0 0 rgba(0, 0, 0, 0.05),
                                        0 2px 8px rgba(0, 0, 0, 0.2)`
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    <div id="detail-tags" className="flex flex-wrap gap-2 mt-2">
                        {destination.tags.map(tag => (
                            <span key={tag} className="text-sm text-amber-200/90 px-3 py-1 rounded-full backdrop-blur-xl" 
                                style={{
                                    background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.08) 100%)", 
                                    border: "1px solid rgba(251, 191, 36, 0.2)", 
                                    boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
                                }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    <div className="relative">
                        <div 
                            className="mt-4 pr-2 scroll-snap-container custom-scrollbar" 
                            style={{ 
                                overflowY: 'scroll',
                                height: '140px',
                                minHeight: '140px',
                                maxHeight: '140px'
                            }}
                            onScroll={handleScroll}
                        >
                        <div className="scroll-snap-item">
                            <p id="detail-description" className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
                                {destination.description}
                            </p>
                            
                            {destination.requiresDayPass && (
                                <div className="mb-4 p-3 rounded-xl backdrop-blur-xl border border-amber-400/30"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.08) 100%)",
                                        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 2px 8px rgba(251, 191, 36, 0.1)"
                                    }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                        </svg>
                                        <span className="text-amber-200 text-sm font-medium">需要日间通行证</span>
                                    </div>
                                    <p className="text-amber-200/80 text-xs">
                                        此地点需要预订日间通行证才能进入，请提前在线预订。
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="scroll-snap-item mb-4">
                            <ImageGallery 
                                destination={destination} 
                                onImageSelect={setCurrentImage} 
                            />
                        </div>
                        
                        
                        {weatherForecast && (
                            <div className="scroll-snap-item mb-4">
                                <h3 className="text-white font-semibold mb-3">天气信息</h3>
                                
                                {/* Current weather */}
                                <div className="backdrop-blur-xl rounded-lg p-3 mb-3"
                                    style={{
                                        background: `linear-gradient(135deg, 
                                            rgba(255, 255, 255, 0.08) 0%, 
                                            rgba(255, 255, 255, 0.03) 100%)`,
                                        border: "1px solid rgba(255, 255, 255, 0.1)"
                                    }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            <WeatherIcon weatherCode={weatherForecast.weatherCode} className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{weatherForecast.temp}°C</div>
                                            <div className="text-gray-400 text-sm">{weatherForecast.condition}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                                        <div className="text-gray-300">
                                            <span className="text-gray-400">体感:</span> {weatherForecast.feelsLike}°C
                                        </div>
                                        <div className="text-gray-300">
                                            <span className="text-gray-400">湿度:</span> {weatherForecast.humidity}%
                                        </div>
                                        <div className="text-gray-300">
                                            <span className="text-gray-400">风速:</span> {weatherForecast.wind}km/h
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Today's hourly forecast */}
                                {weatherForecast.todayHourly && weatherForecast.todayHourly.length > 0 && (
                                    <div className="scroll-snap-item mb-3">
                                        <h4 className="text-white text-sm font-medium mb-2">今日逐时天气</h4>
                                        <div className="backdrop-blur-xl rounded-lg p-3"
                                            style={{
                                                background: `linear-gradient(135deg, 
                                                    rgba(255, 255, 255, 0.05) 0%, 
                                                    rgba(255, 255, 255, 0.02) 100%)`,
                                                border: "1px solid rgba(255, 255, 255, 0.08)"
                                            }}>
                                            <div className="flex gap-3 overflow-x-auto">
                                                {weatherForecast.todayHourly.map((hourData, index) => (
                                                    <div key={index} className="flex-shrink-0 text-center min-w-[60px]">
                                                        <div className="text-[10px] text-gray-400 mb-2">
                                                            {hourData.hour}
                                                        </div>
                                                        <div className="text-base mb-2 flex justify-center">
                                                            <WeatherIcon weatherCode={hourData.weatherCode} hour={hourData.hourNumber} className="w-5 h-5" />
                                                        </div>
                                                        <div className="text-sm text-white font-medium mb-1">
                                                            {hourData.temp}°
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 mb-1">
                                                            {hourData.wind}km/h
                                                        </div>
                                                        {hourData.precipitation > 0 && (
                                                            <div className="text-[10px] text-sky-400">
                                                                {hourData.precipitation.toFixed(1)}mm
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* 5-day forecast if available */}
                                {weatherForecast.forecast && (
                                    <div className="scroll-snap-item">
                                        <h4 className="text-white text-sm font-medium mb-2">5天预报</h4>
                                        <div className="grid grid-cols-5 gap-2">
                                            {weatherForecast.forecast.dates.map((date, index) => (
                                                <div key={date} className="backdrop-blur-xl rounded-lg p-2 text-center"
                                                    style={{
                                                        background: `linear-gradient(135deg, 
                                                            rgba(255, 255, 255, 0.05) 0%, 
                                                            rgba(255, 255, 255, 0.02) 100%)`,
                                                        border: "1px solid rgba(255, 255, 255, 0.08)"
                                                    }}>
                                                    <div className="text-[10px] text-gray-400 mb-1">
                                                        {index === 0 ? '今天' : formatDate(date).split(' ')[1]}
                                                    </div>
                                                    <div className="text-base mb-1 flex justify-center">
                                                        <WeatherIcon weatherCode={weatherForecast.forecast.weatherCodes[index]} hour={12} className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className="text-white font-medium">{weatherForecast.forecast.maxTemps[index]}°</span>
                                                        <span className="text-gray-400">/{weatherForecast.forecast.minTemps[index]}°</span>
                                                    </div>
                                                    <div className="text-[9px] text-gray-400 mt-1">
                                                        {weatherForecast.forecast.maxWind[index]}km/h
                                                    </div>
                                                    {weatherForecast.forecast.precipitation[index] > 0 && (
                                                        <div className="text-[9px] text-sky-400">
                                                            {weatherForecast.forecast.precipitation[index].toFixed(1)}mm
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        </div>
                        
                        {/* Scroll indicator overlay - outside container */}
                        {showScrollIndicator && (
                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-12 text-white/60 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 16l-6-6h12l-6 6z"/>
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailCard;