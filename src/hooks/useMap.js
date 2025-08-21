import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MAP_CONFIG } from '../utils/constants.js';

export function useMap(setIsRouteAnimating) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const routeLayerRef = useRef(null);

    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current, {
                center: MAP_CONFIG.center,
                zoom: MAP_CONFIG.zoom,
                zoomControl: false,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);

            setTimeout(() => {
                const legend = document.getElementById('difficulty-legend');
                if (legend) {
                    legend.style.opacity = '1';
                    legend.style.transform = 'translateY(0)';
                }
            }, 600);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    const addMarkers = (destinations, hiddenDestinations, onMarkerClick) => {
        if (!mapInstanceRef.current) return;

        Object.values(markersRef.current).forEach(marker => {
            mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = {};

        destinations.forEach(dest => {
            if (!hiddenDestinations.has(dest.id)) {
                const difficultyClass = dest.difficulty ? `difficulty-${dest.difficulty}` : '';
                
                const icon = L.divIcon({
                    className: 'custom-map-marker-container',
                    html: `<div id="marker-${dest.id}" class="custom-map-marker w-6 h-6 ${difficultyClass}"><div class="inner-dot"></div></div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });

                const marker = L.marker(dest.coords, { icon: icon }).addTo(mapInstanceRef.current);
                marker.on('click', () => onMarkerClick(dest.id));
                markersRef.current[dest.id] = marker;
            }
        });
    };

    const flyToDestination = (coords) => {
        if (!mapInstanceRef.current) return;
        
        const offsetCoords = [
            coords[0] - MAP_CONFIG.flyToOffset,
            coords[1]
        ];
        
        mapInstanceRef.current.flyTo(offsetCoords, MAP_CONFIG.detailZoom, {
            animate: true,
            duration: MAP_CONFIG.flyToDuration
        });
    };

    const showRoute = (startCoords, endCoords, routeInfo) => {
        if (!mapInstanceRef.current) return;
        
        // Clear existing route
        clearRoute();
        
        // Step 1: Hide detail card during animation for full map view
        const detailCard = document.getElementById('detail-card');
        if (detailCard) {
            detailCard.classList.add('translate-y-full');
        }
        
        // Step 2: Start at the starting point with close zoom
        mapInstanceRef.current.flyTo(startCoords, 14, {
            animate: true,
            duration: 1.0
        });
        
        // Step 3: After reaching start point, begin route animation with panning
        setTimeout(() => {
            const totalSteps = 50;
            const stepDuration = 56; // milliseconds per step (30% faster: 80 * 0.7 = 56)
            let currentStep = 0;
            let routeLine = null;
            
            // Check if route has waypoints for curved path
            const paddleWaypoints = routeInfo.paddleWaypoints || routeInfo.waypoints || [];
            const hikeWaypoints = routeInfo.hikeWaypoints || [];
            const hasWaypoints = paddleWaypoints.length > 0;
            
            let stopMarkers = {}; // Store stop markers for showing during animation
            
            const animateRouteReveal = () => {
                if (currentStep >= totalSteps) {
                    // Animation complete - show destination marker and stops
                    const markers = [];
                    
                    // Add stop markers to markers array for cleanup
                    if (stopMarkers) {
                        Object.values(stopMarkers).forEach(marker => markers.push(marker));
                    }
                    
                    // Add final destination marker
                    const routeIcon = L.divIcon({
                        className: 'custom-map-marker-container',
                        html: `<div class="custom-map-marker w-6 h-6 route-destination"><div class="inner-dot"></div></div>`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });
                    
                    const routeMarker = L.marker(endCoords, { icon: routeIcon }).addTo(mapInstanceRef.current);
                    markers.push(routeMarker);
                    
                    // Create thumbnail popup for route destination
                    routeMarker.bindPopup(`
                        <div class="backdrop-blur-xl rounded-xl overflow-hidden flex items-center justify-center" 
                             style="background: rgba(255, 255, 255, 0.1); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); width: 64px; height: 64px;">
                            <img src="${routeInfo.destination === 'Jug Island' 
                                ? 'https://explore-mag.com/wp-content/uploads/2024/02/jug-island-jpg.webp' 
                                : routeInfo.destination === 'Widgeon Falls' 
                                    ? 'https://www.straight.com/files/v3/styles/gs_standard/public/images/15/05/widgeon-sh-05.jpg?itok=PgvF2qxk'
                                    : routeInfo.destination === 'Granite Falls'
                                        ? 'https://c8.alamy.com/comp/BFFPKE/granite-falls-provincial-park-indian-arm-british-columbia-canada-BFFPKE.jpg'
                                        : routeInfo.destination === 'Harrison Lagoon'
                                            ? 'https://images.dailyhive.com/20190104144058/Harrison-Hot-Springs.-Shutterstock.jpg'
                                            : 'https://4.bp.blogspot.com/-MvB9IPYoO4w/U9umW8poiHI/AAAAAAAAVJ8/AMt7ssqk2kU/s1600/DSC00650b.JPG'}" 
                                 alt="${routeInfo.destination}" 
                                 class="w-full h-full object-cover object-center" 
                                 style="transform: scale(1.3);" />
                        </div>
                    `, {
                        className: 'route-popup-custom',
                        maxWidth: 80,
                        minWidth: 80,
                        closeButton: false,
                        autoClose: false,
                        closeOnEscapeKey: false,
                        closeOnClick: false
                    });
                    
                    // Auto-open the popup to show thumbnail
                    setTimeout(() => {
                        routeMarker.openPopup();
                    }, 100);
                    
                    // Store route elements for cleanup
                    routeLayerRef.current = {
                        line: routeLine,
                        markers: markers
                    };
                    
                    // Final step: Zoom out to show all points including stops
                    setTimeout(() => {
                        const allPoints = [startCoords, endCoords];
                        if (routeInfo.stops && routeInfo.stops.length > 0) {
                            routeInfo.stops.forEach(stop => allPoints.push(stop.coords));
                        }
                        const bounds = L.latLngBounds(allPoints);
                        
                        // Calculate distance to determine appropriate zoom level
                        const distance = calculateRouteDistance(startCoords, endCoords);
                        const isShortRoute = distance < 5; // Routes under 5km need tighter zoom
                        const isLongFjordRoute = routeInfo.destination === 'Silver Falls' || routeInfo.destination === 'Granite Falls';
                        
                        // Show route detail card right as zoom starts
                        showRouteDetailCard(startCoords, endCoords, routeInfo);
                        
                        mapInstanceRef.current.fitBounds(bounds, { 
                            padding: isLongFjordRoute
                                ? [160, 80, 320, 80] // Extra padding for long fjord routes to avoid UI card blocking
                                : isShortRoute 
                                    ? [80, 40, 160, 40] // Tighter padding for short routes like Deep Cove → Jug Island
                                    : [125, 60, 200, 60], // Wider padding for other long routes
                            animate: true,
                            duration: 1.5
                        });
                        
                        // Reset animation state after animation completes
                        setTimeout(() => {
                            if (setIsRouteAnimating) {
                                setIsRouteAnimating(false);
                            }
                        }, 1500); // Match the fitBounds duration
                    }, 500); // Small delay to let marker appear
                    
                    return;
                }
                
                const progress = currentStep / totalSteps;
                
                let currentEndPoint;
                
                // Build the complete route path including stops
                let routePath = [startCoords];
                if (routeInfo.stops && routeInfo.stops.length > 0) {
                    routeInfo.stops.forEach(stop => routePath.push(stop.coords));
                }
                routePath.push(endCoords);
                
                if (hasWaypoints) {
                    // Follow waypoints path (paddle + hike)
                    const allPoints = [startCoords, ...paddleWaypoints, ...hikeWaypoints];
                    const totalDistance = allPoints.length - 1;
                    const currentDistance = progress * totalDistance;
                    const segmentIndex = Math.floor(currentDistance);
                    const segmentProgress = currentDistance - segmentIndex;
                    
                    if (segmentIndex >= allPoints.length - 1) {
                        currentEndPoint = allPoints[allPoints.length - 1];
                    } else {
                        const segmentStart = allPoints[segmentIndex];
                        const segmentEnd = allPoints[segmentIndex + 1];
                        const lat = segmentStart[0] + (segmentEnd[0] - segmentStart[0]) * segmentProgress;
                        const lng = segmentStart[1] + (segmentEnd[1] - segmentStart[1]) * segmentProgress;
                        currentEndPoint = [lat, lng];
                    }
                } else if (routePath.length > 2) {
                    // Route with stops - interpolate through each segment
                    const totalSegments = routePath.length - 1;
                    const currentSegmentFloat = progress * totalSegments;
                    const currentSegmentIndex = Math.floor(currentSegmentFloat);
                    const segmentProgress = currentSegmentFloat - currentSegmentIndex;
                    
                    if (currentSegmentIndex >= totalSegments) {
                        currentEndPoint = routePath[routePath.length - 1];
                    } else {
                        const segmentStart = routePath[currentSegmentIndex];
                        const segmentEnd = routePath[currentSegmentIndex + 1];
                        const lat = segmentStart[0] + (segmentEnd[0] - segmentStart[0]) * segmentProgress;
                        const lng = segmentStart[1] + (segmentEnd[1] - segmentStart[1]) * segmentProgress;
                        currentEndPoint = [lat, lng];
                    }
                    
                    // Check if we've just reached a stop (Silver Falls)
                    if (routeInfo.stops && routeInfo.stops.length > 0) {
                        for (let i = 0; i < routeInfo.stops.length; i++) {
                            const stopIndex = i + 1; // Stops are at index 1, 2, etc. in routePath
                            const stopProgress = stopIndex / totalSegments;
                            
                            // Check if we've just reached this stop
                            if (Math.abs(progress - stopProgress) < 0.01 && !stopMarkers[routeInfo.stops[i].name]) {
                                // Add stop marker with popup
                                const stop = routeInfo.stops[i];
                                const stopIcon = L.divIcon({
                                    className: 'custom-map-marker-container',
                                    html: `<div class="custom-map-marker w-6 h-6 route-destination"><div class="inner-dot"></div></div>`,
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12]
                                });
                                
                                const stopMarker = L.marker(stop.coords, { icon: stopIcon }).addTo(mapInstanceRef.current);
                                
                                // Add thumbnail popup
                                stopMarker.bindPopup(`
                                    <div class="backdrop-blur-xl rounded-xl overflow-hidden flex items-center justify-center" 
                                         style="background: rgba(255, 255, 255, 0.1); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); width: 64px; height: 64px;">
                                        <img src="${stop.name === 'Silver Falls' 
                                            ? 'https://4.bp.blogspot.com/-MvB9IPYoO4w/U9umW8poiHI/AAAAAAAAVJ8/AMt7ssqk2kU/s1600/DSC00650b.JPG'
                                            : 'https://placehold.co/64x64/333/FFF?text=' + encodeURIComponent(stop.name)}" 
                                             alt="${stop.name}" 
                                             class="w-full h-full object-cover object-center" 
                                             style="transform: scale(1.3);" />
                                    </div>
                                `, {
                                    className: 'route-popup-custom',
                                    maxWidth: 80,
                                    minWidth: 80,
                                    closeButton: false,
                                    autoClose: false,
                                    closeOnEscapeKey: false,
                                    closeOnClick: false
                                });
                                
                                // Open popup immediately
                                stopMarker.openPopup();
                                stopMarkers[stop.name] = stopMarker;
                                
                                // Pause animation for 0.8 seconds
                                setTimeout(animateRouteReveal, 800);
                                return;
                            }
                        }
                    }
                } else {
                    // Simple linear interpolation for routes without waypoints or stops
                    const lat = startCoords[0] + (endCoords[0] - startCoords[0]) * progress;
                    const lng = startCoords[1] + (endCoords[1] - startCoords[1]) * progress;
                    currentEndPoint = [lat, lng];
                }
                
                // Pan camera to current position
                mapInstanceRef.current.panTo(currentEndPoint, { animate: false });
                
                // Remove previous route lines if they exist
                if (routeLine) {
                    if (routeLine.lines) {
                        // Multiple lines (paddle + hike)
                        routeLine.lines.forEach(line => mapInstanceRef.current.removeLayer(line));
                    } else {
                        // Single line
                        mapInstanceRef.current.removeLayer(routeLine);
                    }
                }
                
                // Create new route line from start to current position
                if (hasWaypoints) {
                    // Build progressive waypoint path with different colors
                    const allPoints = [startCoords, ...paddleWaypoints, ...hikeWaypoints];
                    const paddleEndIndex = 1 + paddleWaypoints.length; // start + paddle waypoints
                    const progressivePoints = [startCoords];
                    const lines = [];
                    
                    for (let i = 0; i < allPoints.length - 1; i++) {
                        const segmentStart = allPoints[i];
                        const segmentEnd = allPoints[i + 1];
                        const segmentDistance = (i + 1) / (allPoints.length - 1);
                        
                        if (progress >= segmentDistance) {
                            // Complete this segment
                            if (!progressivePoints.includes(segmentEnd)) {
                                progressivePoints.push(segmentEnd);
                            }
                        } else {
                            // Partial segment
                            const relativeProgress = (progress * (allPoints.length - 1) - i);
                            if (relativeProgress > 0) {
                                const lat = segmentStart[0] + (segmentEnd[0] - segmentStart[0]) * relativeProgress;
                                const lng = segmentStart[1] + (segmentEnd[1] - segmentStart[1]) * relativeProgress;
                                progressivePoints.push([lat, lng]);
                            }
                            break;
                        }
                    }
                    
                    // Create paddle route (blue)
                    const paddlePoints = progressivePoints.slice(0, Math.min(progressivePoints.length, paddleEndIndex));
                    if (paddlePoints.length > 1) {
                        const paddleLine = L.polyline(paddlePoints, {
                            color: '#38bdf8',
                            weight: 3,
                            opacity: 0.8,
                            dashArray: '10, 5'
                        }).addTo(mapInstanceRef.current);
                        lines.push(paddleLine);
                    }
                    
                    // Create hike route (light brown)
                    if (progressivePoints.length > paddleEndIndex) {
                        const hikePoints = progressivePoints.slice(paddleEndIndex - 1); // Include connection point
                        const hikeLine = L.polyline(hikePoints, {
                            color: '#c49a6c',
                            weight: 3,
                            opacity: 0.8,
                            dashArray: '5, 5'
                        }).addTo(mapInstanceRef.current);
                        lines.push(hikeLine);
                    }
                    
                    routeLine = { lines }; // Store multiple lines for cleanup
                } else if (routePath.length > 2) {
                    // Route with stops - draw progressive line through stops
                    const progressivePoints = [];
                    const totalSegments = routePath.length - 1;
                    const currentSegmentFloat = progress * totalSegments;
                    const currentSegmentIndex = Math.floor(currentSegmentFloat);
                    
                    // Add all points up to the current segment
                    for (let i = 0; i <= currentSegmentIndex && i < routePath.length; i++) {
                        progressivePoints.push(routePath[i]);
                    }
                    
                    // Add the interpolated current position if we're between points
                    if (currentSegmentIndex < totalSegments) {
                        const segmentProgress = currentSegmentFloat - currentSegmentIndex;
                        if (segmentProgress > 0) {
                            // We're partway through a segment, add the current interpolated position
                            progressivePoints.push(currentEndPoint);
                        }
                    }
                    
                    routeLine = L.polyline(progressivePoints, {
                        color: '#38bdf8',
                        weight: 3,
                        opacity: 0.8,
                        dashArray: '10, 5'
                    }).addTo(mapInstanceRef.current);
                } else {
                    // Simple straight line
                    routeLine = L.polyline([startCoords, currentEndPoint], {
                        color: '#38bdf8',
                        weight: 3,
                        opacity: 0.8,
                        dashArray: '10, 5'
                    }).addTo(mapInstanceRef.current);
                }
                
                currentStep++;
                setTimeout(animateRouteReveal, stepDuration);
            };
            
            // Start the gradual route reveal animation
            animateRouteReveal();
            
        }, 1200); // Wait for initial camera movement to complete
    };
    
    const showRouteDetailCard = (startCoords, endCoords, routeInfo) => {
        const routeDetailCard = document.getElementById('route-detail-card');
        if (!routeDetailCard) return;
        
        // Show the route detail card
        routeDetailCard.classList.remove('translate-y-full');
    };
    
    const calculateRouteDistance = (startCoords, endCoords) => {
        const R = 6371;
        const dLat = (endCoords[0] - startCoords[0]) * Math.PI / 180;
        const dLon = (endCoords[1] - startCoords[1]) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(startCoords[0] * Math.PI / 180) * Math.cos(endCoords[0] * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance.toFixed(1);
    };

    const clearRoute = () => {
        if (!mapInstanceRef.current || !routeLayerRef.current) return;
        
        if (routeLayerRef.current.line) {
            // Handle old single line structure
            if (routeLayerRef.current.line.lines) {
                // Multiple lines (paddle + hike)
                routeLayerRef.current.line.lines.forEach(line => mapInstanceRef.current.removeLayer(line));
            } else {
                // Single line
                mapInstanceRef.current.removeLayer(routeLayerRef.current.line);
            }
        }
        if (routeLayerRef.current.marker) {
            mapInstanceRef.current.removeLayer(routeLayerRef.current.marker);
        }
        if (routeLayerRef.current.markers) {
            routeLayerRef.current.markers.forEach(marker => mapInstanceRef.current.removeLayer(marker));
        }
        
        routeLayerRef.current = null;
    };

    const resetMapView = () => {
        if (!mapInstanceRef.current) return;
        
        // Clear any existing route
        clearRoute();
        
        mapInstanceRef.current.flyTo(MAP_CONFIG.center, MAP_CONFIG.zoom, { 
            animate: true, 
            duration: 1 
        });
    };

    return {
        mapRef,
        mapInstanceRef,
        addMarkers,
        flyToDestination,
        resetMapView,
        showRoute,
        clearRoute
    };
}