import React from 'react';

function MapContainer({ mapRef }) {
    return (
        <div id="map" ref={mapRef} className="absolute inset-0 z-0"></div>
    );
}

export default MapContainer;