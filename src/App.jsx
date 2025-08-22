import React, { useState, useEffect } from 'react';
import MapContainer from './components/Map/MapContainer.jsx';
import DifficultyLegend from './components/Map/DifficultyLegend.jsx';
import DestinationList from './components/DestinationList/DestinationList.jsx';
import DetailCard from './components/DetailCard/DetailCard.jsx';
import RouteDetailCard from './components/DetailCard/RouteDetailCard.jsx';
import { useDestinations } from './hooks/useDestinations.js';
import { useMap } from './hooks/useMap.js';
import { useAutoScroll } from './hooks/useAutoScroll.js';
import { useFilters } from './hooks/useFilters.js';
import { mapStyles } from './styles/mapStyles.js';
import { calculateDistance, calculateRouteDistance } from './utils/mapUtils.js';

function App() {
    const [activeDestinationId, setActiveDestinationId] = useState(null);
    const [activeDestination, setActiveDestination] = useState(null);
    const [routeInfo, setRouteInfo] = useState(null);
    const [routeStartCoords, setRouteStartCoords] = useState(null);
    const [isRouteAnimating, setIsRouteAnimating] = useState(false);
    const [pendingResumeTimeout, setPendingResumeTimeout] = useState(null);

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

    const { stopAutoScroll, resumeAutoScroll, updateSavedPosition, setSelectedDestination } = useAutoScroll();

    const {
        filters,
        applyFilters,
        handleFilterChange,
        resetFilters,
        hasActiveFilters
    } = useFilters();

    // Apply filters to get filtered destinations
    const filteredDestinations = applyFilters(sortedDestinations);

    useEffect(() => {
        addMarkers(filteredDestinations, hiddenDestinations, selectDestination);
    }, [filteredDestinations, hiddenDestinations]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (pendingResumeTimeout) {
                clearTimeout(pendingResumeTimeout);
            }
        };
    }, [pendingResumeTimeout]);

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
        // Cancel any pending auto-scroll resume to prevent conflicts
        if (pendingResumeTimeout) {
            clearTimeout(pendingResumeTimeout);
            setPendingResumeTimeout(null);
        }
        
        stopAutoScroll(false); // Don't save position when showing detail card, we'll center it manually
        setSelectedDestination(destination.name); // Always track which destination's detail card is open
        setActiveDestination(destination);
        
        // Center the corresponding card for this destination
        centerCardForDestination(destination);
    };

    const centerCardForDestination = (destination) => {
        // Center the selected card with a small delay to ensure auto-scroll has stopped
        setTimeout(() => {
            const cardElement = document.getElementById(`card-${destination.id}`);
            const container = document.getElementById('top-destinations-list');
            
            if (cardElement && container) {
                // Calculate the scroll position to center the card
                const cardCenter = cardElement.offsetLeft + (cardElement.offsetWidth / 2);
                const containerCenter = container.clientWidth / 2;
                const targetScrollLeft = cardCenter - containerCenter;
                
                // Ensure we don't scroll beyond bounds
                const maxScroll = container.scrollWidth - container.clientWidth;
                const finalScrollPosition = Math.max(0, Math.min(targetScrollLeft, maxScroll));
                
                // Smooth scroll to center the card
                container.scrollTo({
                    left: finalScrollPosition,
                    behavior: 'smooth'
                });
                
                // Update the saved position after scrolling completes
                setTimeout(() => {
                    updateSavedPosition();
                }, 500); // Wait for smooth scroll to complete
            }
        }, 100); // Small delay to ensure auto-scroll has stopped
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
        
        // Resume auto-scroll when both cards are closed
        const resumeTimeout = setTimeout(() => {
            resumeAutoScroll();
            setPendingResumeTimeout(null);
        }, 600); // Longer delay to ensure cards are hidden and animations complete
        
        setPendingResumeTimeout(resumeTimeout);
        
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
            showDetailCard(destination); // This handles centering, destination tracking, and detail card display
        }
    };

    const handleToggleVisibility = (id, event) => {
        const wasHidden = toggleDestinationVisibility(id, event);
        if (wasHidden && activeDestinationId === id) {
            hideDetailCard();
        }
    };

    const getDisplayedDestinations = () => {
        return filteredDestinations;
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
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
                showFilterButton={!activeDestination && !routeInfo && !isRouteAnimating}
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