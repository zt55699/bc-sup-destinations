export function calculateDistance(coord1, coord2) {
    if (!coord1 || !coord2) return 0;
    
    const lat1 = coord1[0];
    const lon1 = coord1[1];
    const lat2 = coord2[0];
    const lon2 = coord2[1];
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
}

export function calculateRouteDistance(startCoords, routeInfo) {
    if (!routeInfo) return { total: calculateDistance(startCoords, routeInfo?.coords) };
    
    // Check if route has waypoints for more accurate distance calculation
    const paddleWaypoints = routeInfo.paddleWaypoints || routeInfo.waypoints || [];
    const hikeWaypoints = routeInfo.hikeWaypoints || [];
    
    if (paddleWaypoints.length === 0 && hikeWaypoints.length === 0) {
        // Simple straight-line distance
        return { total: calculateDistance(startCoords, routeInfo.coords) };
    }
    
    // Calculate paddling distance
    const paddlePoints = [startCoords, ...paddleWaypoints];
    let paddleDistance = 0;
    for (let i = 0; i < paddlePoints.length - 1; i++) {
        paddleDistance += parseFloat(calculateDistance(paddlePoints[i], paddlePoints[i + 1]));
    }
    
    // Calculate hiking distance
    let hikeDistance = 0;
    if (hikeWaypoints.length > 0) {
        const hikePoints = [...hikeWaypoints];
        for (let i = 0; i < hikePoints.length - 1; i++) {
            hikeDistance += parseFloat(calculateDistance(hikePoints[i], hikePoints[i + 1]));
        }
    }
    
    const totalDistance = paddleDistance + hikeDistance;
    
    return {
        total: totalDistance.toFixed(1),
        paddling: paddleDistance.toFixed(1),
        hiking: hikeDistance.toFixed(1)
    };
}

export function generateGoogleMapsUrl(destination) {
    const query = `${encodeURIComponent(destination.name)},${destination.coords[0]},${destination.coords[1]}`;
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
}