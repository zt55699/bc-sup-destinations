import React, { useState, useEffect } from 'react';
import MapContainer from './components/Map/MapContainer.jsx';
import DifficultyLegend from './components/Map/DifficultyLegend.jsx';
import DestinationList from './components/DestinationList/DestinationList.jsx';
import DetailCard from './components/DetailCard/DetailCard.jsx';
import { useDestinations } from './hooks/useDestinations.js';
import { useMap } from './hooks/useMap.js';
import { useAutoScroll } from './hooks/useAutoScroll.js';
import { mapStyles } from './styles/mapStyles.js';

function App() {
    const [activeDestinationId, setActiveDestinationId] = useState(null);
    const [activeDestination, setActiveDestination] = useState(null);

    const { 
        sortedDestinations, 
        hiddenDestinations, 
        getFilteredAndSortedDestinations, 
        toggleDestinationVisibility 
    } = useDestinations();

    const { 
        mapRef, 
        mapInstanceRef, 
        addMarkers, 
        flyToDestination, 
        resetMapView 
    } = useMap();

    const { stopAutoScroll } = useAutoScroll();

    useEffect(() => {
        addMarkers(sortedDestinations, hiddenDestinations, selectDestination);
    }, [sortedDestinations, hiddenDestinations]);

    const updateActiveState = (newId) => {
        const allMarkers = document.querySelectorAll('.custom-map-marker');
        allMarkers.forEach(marker => marker.classList.remove('active'));
        
        const allCards = document.querySelectorAll('.top-card');
        allCards.forEach(card => card.classList.remove('!border-sky-400', '!bg-white/20'));

        setActiveDestinationId(newId);
        if (newId) {
            const newMarkerEl = document.getElementById(`marker-${newId}`);
            if (newMarkerEl) newMarkerEl.classList.add('active');
            
            const newCardEl = document.getElementById(`card-${newId}`);
            if (newCardEl) newCardEl.classList.add('!border-sky-400', '!bg-white/20');
        }
    };

    const showDetailCard = (destination) => {
        setActiveDestination(destination);
    };

    const hideDetailCard = () => {
        const detailCard = document.getElementById('detail-card');
        
        if (detailCard) {
            detailCard.classList.add('translate-y-full');
        }
        
        setActiveDestination(null);
        updateActiveState(null);
        resetMapView();
        
        // Delay showing difficulty legend, same as original
        const legend = document.getElementById('difficulty-legend');
        if (legend) {
            setTimeout(() => {
                legend.style.opacity = '1';
                legend.style.transform = 'translateY(0)';
            }, 600);
        }
    };

    const selectDestination = (id) => {
        stopAutoScroll();
        
        if (activeDestinationId === id) {
            hideDetailCard();
            return;
        }
        
        updateActiveState(id);
        
        const destination = sortedDestinations.find(d => d.id === id);
        if (destination) {
            flyToDestination(destination.coords);
            showDetailCard(destination);
            
            const cardElement = document.getElementById(`card-${id}`);
            if (cardElement) {
                cardElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest', 
                    inline: 'center' 
                });
            }
        }
    };

    const handleToggleVisibility = (id, event) => {
        const wasHidden = toggleDestinationVisibility(id, event);
        if (wasHidden && activeDestinationId === id) {
            hideDetailCard();
        }
    };

    return (
        <div className="bg-gray-900 overflow-hidden h-screen">
            <style>{mapStyles}</style>

            <MapContainer mapRef={mapRef} />

            <DestinationList
                destinations={getFilteredAndSortedDestinations()}
                activeDestinationId={activeDestinationId}
                hiddenDestinations={hiddenDestinations}
                onStopAutoScroll={stopAutoScroll}
                onSelectDestination={selectDestination}
                onToggleVisibility={handleToggleVisibility}
            />

            <DetailCard
                destination={activeDestination}
                onClose={hideDetailCard}
                mapInstanceRef={mapInstanceRef}
            />

            <DifficultyLegend />
        </div>
    );
}

export default App;