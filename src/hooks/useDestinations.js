import { useState, useEffect } from 'react';
import { destinations } from '../data/destinations.js';
import { calculateDistance, generateGoogleMapsUrl } from '../utils/mapUtils.js';
import { VANCOUVER_COORDS } from '../utils/constants.js';

export function useDestinations() {
    const [sortedDestinations, setSortedDestinations] = useState([]);
    const [hiddenDestinations, setHiddenDestinations] = useState(new Set());

    useEffect(() => {
        const mainlandDests = destinations.filter(d => !d.tags.includes('温哥华岛'));
        const islandDests = destinations.filter(d => d.tags.includes('温哥华岛'));

        mainlandDests.forEach(dest => {
            dest.distance = calculateDistance(
                VANCOUVER_COORDS.lat, VANCOUVER_COORDS.lon,
                dest.coords[0], dest.coords[1]
            );
        });

        mainlandDests.sort((a, b) => a.distance - b.distance);

        const sortedDestinations = [...mainlandDests, ...islandDests];
        sortedDestinations.forEach((dest, index) => {
            dest.id = index + 1;
            dest.googleMapsUrl = generateGoogleMapsUrl(dest);
        });
        
        setSortedDestinations(sortedDestinations);
    }, []);

    const getFilteredAndSortedDestinations = () => {
        const visible = sortedDestinations.filter(dest => !hiddenDestinations.has(dest.id));
        const hidden = sortedDestinations.filter(dest => hiddenDestinations.has(dest.id));
        return [...visible, ...hidden];
    };

    const toggleDestinationVisibility = (id, event) => {
        event.stopPropagation();
        const newHiddenDestinations = new Set(hiddenDestinations);
        if (newHiddenDestinations.has(id)) {
            newHiddenDestinations.delete(id);
        } else {
            newHiddenDestinations.add(id);
        }
        setHiddenDestinations(newHiddenDestinations);
        return !hiddenDestinations.has(id); // return if now hidden
    };

    return {
        sortedDestinations,
        hiddenDestinations,
        getFilteredAndSortedDestinations,
        toggleDestinationVisibility
    };
}