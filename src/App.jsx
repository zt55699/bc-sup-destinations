import React, { useState, useEffect } from 'react';
import MapContainer from './components/Map/MapContainer.jsx';
import DifficultyLegend from './components/Map/DifficultyLegend.jsx';
import DestinationList from './components/DestinationList/DestinationList.jsx';
import DetailCard from './components/DetailCard/DetailCard.jsx';
import RouteDetailCard from './components/DetailCard/RouteDetailCard.jsx';
import { useDestinations } from './hooks/useDestinations.js';
import { useMap } from './hooks/useMap.js';
import { useAutoScroll } from './hooks/useAutoScroll.js';
import { mapStyles } from './styles/mapStyles.js';
import { calculateDistance, calculateRouteDistance } from './utils/mapUtils.js';

function App() {
    const [activeDestinationId, setActiveDestinationId] = useState(null);
    const [activeDestination, setActiveDestination] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [routeStartCoords, setRouteStartCoords] = useState(null);
    const [isRouteAnimating, setIsRouteAnimating] = useState(false);
    const [showRoutesOnly, setShowRoutesOnly] = useState(false);

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
        resetMapView,
        showRoute,
        clearRoute
    } = useMap(setIsRouteAnimating);

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
        const routeDetailCard = document.getElementById('route-detail-card');
        
        if (detailCard) {
            detailCard.classList.add('translate-y-full');
        }
        if (routeDetailCard) {
            routeDetailCard.classList.add('translate-y-full');
        }
        
        setActiveDestination(null);
        setRouteInfo(null);
        setRouteStartCoords(null);
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
        // Prevent interaction during route animation
        if (isRouteAnimating) return;
        
        stopAutoScroll();
        
        // Clear any existing route and route detail card
        clearRoute();
        const routeDetailCard = document.getElementById('route-detail-card');
        if (routeDetailCard) {
            routeDetailCard.classList.add('translate-y-full');
        }
        setRouteInfo(null);
        setRouteStartCoords(null);
        
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

    const getDisplayedDestinations = () => {
        const filtered = getFilteredAndSortedDestinations();
        if (showRoutesOnly) {
            return filtered.filter(dest => dest.route);
        }
        return filtered;
    };

    return (
        <div className="bg-gray-900 overflow-hidden h-screen">
            <style>{mapStyles}</style>

            <MapContainer mapRef={mapRef} />

            <DestinationList
                destinations={getDisplayedDestinations()}
                activeDestinationId={activeDestinationId}
                hiddenDestinations={hiddenDestinations}
                onStopAutoScroll={stopAutoScroll}
                onSelectDestination={selectDestination}
                onToggleVisibility={handleToggleVisibility}
                showRoutesOnly={showRoutesOnly}
                onToggleRoutesFilter={() => setShowRoutesOnly(!showRoutesOnly)}
            />

            <DetailCard
                destination={activeDestination}
                onClose={hideDetailCard}
                mapInstanceRef={mapInstanceRef}
                onShowRoute={(startCoords, endCoords, routeData) => {
                    if (isRouteAnimating) return; // Prevent multiple route animations
                    setRouteInfo(routeData);
                    setRouteStartCoords(startCoords);
                    setIsRouteAnimating(true);
                    showRoute(startCoords, endCoords, routeData);
                }}
            />

            <RouteDetailCard
                routeInfo={routeInfo}
                startCoords={routeStartCoords}
                endCoords={routeInfo?.coords}
                distances={routeInfo && routeStartCoords ? calculateRouteDistance(routeStartCoords, routeInfo) : null}
                onClose={hideDetailCard}
            />

            <DifficultyLegend />
        </div>
    );
}

export default App;