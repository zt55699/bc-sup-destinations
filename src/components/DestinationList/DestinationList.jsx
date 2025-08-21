import React from 'react';
import DestinationCard from './DestinationCard.jsx';

function DestinationList({ 
    destinations, 
    activeDestinationId, 
    hiddenDestinations, 
    onStopAutoScroll, 
    onSelectDestination, 
    onToggleVisibility 
}) {
    return (
        <div id="top-destinations-container" className="fixed top-0 left-0 right-0 z-10 pt-8 md:pt-6">
            <div 
                id="top-destinations-list" 
                className="no-scrollbar flex gap-3 overflow-x-auto px-4"
                onMouseEnter={onStopAutoScroll}
                onTouchStart={onStopAutoScroll}
            >
                {destinations.map(dest => (
                    <DestinationCard
                        key={dest.id}
                        destination={dest}
                        isActive={activeDestinationId === dest.id}
                        isHidden={hiddenDestinations.has(dest.id)}
                        onSelect={onSelectDestination}
                        onToggleVisibility={onToggleVisibility}
                    />
                ))}
            </div>
        </div>
    );
}

export default DestinationList;