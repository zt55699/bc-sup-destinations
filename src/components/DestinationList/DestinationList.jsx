import React from 'react';
import DestinationCard from './DestinationCard.jsx';

function DestinationList({ 
    destinations, 
    activeDestinationId, 
    hiddenDestinations, 
    onStopAutoScroll, 
    onSelectDestination, 
    onToggleVisibility,
    showRoutesOnly,
    onToggleRoutesFilter
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
            <div className="flex justify-start px-4 mt-3">
                <button
                    onClick={onToggleRoutesFilter}
                    className={`w-8 h-8 rounded-full backdrop-blur-lg border transition-all duration-300 flex items-center justify-center ${
                        showRoutesOnly 
                            ? 'bg-sky-500/20 border-sky-400/40 text-sky-300' 
                            : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                    }`}
                    title={showRoutesOnly ? "显示所有目的地" : "仅显示有路线的目的地"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default DestinationList;