import React, { useRef, useEffect, useState } from 'react';
import WeatherDisplay from '../WeatherDisplay/WeatherDisplay';

function DestinationCard({ 
    destination, 
    isActive, 
    isHidden, 
    onSelect, 
    onToggleVisibility 
}) {
    const titleRef = useRef(null);
    const tagsRef = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);
    const [visibleTags, setVisibleTags] = useState(destination.tags);

    useEffect(() => {
        const checkOverflow = () => {
            if (titleRef.current) {
                const container = titleRef.current;
                // Create a temporary element to measure text width
                const temp = document.createElement('span');
                temp.style.visibility = 'hidden';
                temp.style.position = 'absolute';
                temp.style.whiteSpace = 'nowrap';
                temp.style.font = window.getComputedStyle(container).font;
                temp.textContent = destination.name;
                document.body.appendChild(temp);
                
                const textWidth = temp.offsetWidth;
                const containerWidth = container.clientWidth;
                
                document.body.removeChild(temp);
                setShouldScroll(textWidth > containerWidth);
            }
        };

        // Check on mount and after a brief delay to ensure layout is complete
        checkOverflow();
        const timer = setTimeout(checkOverflow, 100);

        return () => clearTimeout(timer);
    }, [destination.name]);

    useEffect(() => {
        const checkTagsOverflow = () => {
            if (tagsRef.current) {
                const container = tagsRef.current;
                const tagElements = container.querySelectorAll('.tag-item');
                let totalWidth = 0;
                const containerWidth = container.clientWidth;
                const tagWidths = [];
                const gaps = 6; // gap-1.5 = 0.375rem = 6px
                
                tagElements.forEach((tag, index) => {
                    const width = tag.offsetWidth;
                    tagWidths.push(width);
                });
                
                let tagsToShow = [];
                for (let i = 0; i < tagWidths.length; i++) {
                    const widthWithGap = i > 0 ? tagWidths[i] + gaps : tagWidths[i];
                    if (totalWidth + widthWithGap <= containerWidth) {
                        totalWidth += widthWithGap;
                        tagsToShow.push(destination.tags[i]);
                    } else {
                        break;
                    }
                }
                
                if (tagsToShow.length !== destination.tags.length) {
                    setVisibleTags(tagsToShow);
                }
            }
        };

        // Check after a brief delay to ensure layout is complete
        const timer = setTimeout(checkTagsOverflow, 100);
        return () => clearTimeout(timer);
    }, [destination.tags]);

    return (
        <div
            id={`card-${destination.id}`}
            className={`top-card flex-shrink-0 w-48 p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:border-white/40 hover:bg-white/20 relative ${
                isActive ? '!border-sky-400 !bg-white/20' : ''
            } ${isHidden ? 'opacity-50' : ''}`}
            onClick={() => onSelect(destination.id)}
        >
            <WeatherDisplay 
                coords={destination.coords} 
                destinationName={destination.name}
            />
            
            <div 
                ref={titleRef}
                className={shouldScroll ? "marquee-container" : ""} 
                style={{ maxWidth: 'calc(100% - 50px)' }}
            >
                {shouldScroll ? (
                    <div 
                        className="marquee-text text-white font-semibold"
                        style={{
                            animationDuration: `${Math.max(destination.name.length * 0.4, 5)}s`,
                        }}
                    >
                        <span>{destination.name}</span>
                        <span className="px-2">•</span>
                        <span>{destination.name}</span>
                        <span className="px-2">•</span>
                    </div>
                ) : (
                    <h3 className="text-white font-semibold whitespace-nowrap">
                        {destination.name}
                    </h3>
                )}
            </div>
            <div ref={tagsRef} className="flex gap-1.5 mt-2 overflow-hidden">
                {destination.tags.map(tag => (
                    <span 
                        key={tag} 
                        className={`tag-item text-xs text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full flex-shrink-0 ${
                            !visibleTags.includes(tag) ? 'hidden' : ''
                        }`}
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default DestinationCard;