import React, { useState } from 'react';
import ImageGallery from './ImageGallery.jsx';

function DetailCard({ destination, onClose, mapInstanceRef, onShowRoute }) {
    const [currentImage, setCurrentImage] = useState('');

    React.useEffect(() => {
        if (destination) {
            const firstImage = destination.imageUrls ? destination.imageUrls[0] : destination.imageUrl;
            setCurrentImage(firstImage || '');
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
        }
    }, [destination, mapInstanceRef]);

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
                
                <div className="p-5 md:p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 id="detail-name" className="text-2xl md:text-3xl font-bold text-white">{destination.name}</h2>
                            <div id="detail-difficulty">
                                {destination.difficulty && renderDifficultyIcon(destination.difficulty)}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
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
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
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
                    
                    <p id="detail-description" className="text-gray-300 mt-4 text-sm md:text-base leading-relaxed">
                        {destination.description}
                    </p>
                    
                    <div className="mt-4">
                        <ImageGallery 
                            destination={destination} 
                            onImageSelect={setCurrentImage} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailCard;