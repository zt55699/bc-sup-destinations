import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MAP_CONFIG } from '../utils/constants.js';

export function useMap() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});

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

    const resetMapView = () => {
        if (!mapInstanceRef.current) return;
        
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
        resetMapView
    };
}