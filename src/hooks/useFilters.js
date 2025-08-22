import { useState } from 'react';

export function useFilters() {
    const [filters, setFilters] = useState({
        waterType: 'all', // 'all', 'saltwater', 'freshwater'
        region: 'all', // 'all', 'greater-vancouver', 'vancouver-island', etc.
        difficulty: 'all', // 'all', 'beginner', 'intermediate', 'advanced', 'expert'
        hasRoutes: 'all', // 'all', 'with-routes', 'no-routes'
        weather: 'all' // 'all', 'sunny', 'cloudy', 'rainy'
    });

    const applyFilters = (destinations) => {
        return destinations.filter(dest => {
            // Water type filter
            if (filters.waterType === 'saltwater' && !dest.tags.includes('海水')) return false;
            if (filters.waterType === 'freshwater' && !dest.tags.includes('淡水')) return false;

            // Region filter
            if (filters.region !== 'all') {
                let regionMatch = false;
                
                if (filters.region === 'vancouver-island') {
                    regionMatch = dest.tags.includes('温哥华岛');
                } else if (filters.region === 'chilliwack') {
                    regionMatch = dest.tags.some(tag => 
                        tag.includes('奇利瓦克') || tag.includes('哈里森')
                    );
                } else if (filters.region === 'inner-bc') {
                    regionMatch = dest.tags.some(tag => 
                        tag.includes('欧垦娜根')
                    );
                } else if (filters.region === 'whistler-pemberton') {
                    regionMatch = dest.tags.some(tag => 
                        tag.includes('惠斯勒') || tag.includes('彭伯顿')
                    );
                } else if (filters.region === 'sea-to-sky') {
                    regionMatch = dest.tags.some(tag => 
                        tag.includes('海天公路') || tag.includes('斯阔米什')
                    );
                } else if (filters.region === 'greater-vancouver') {
                    regionMatch = dest.tags.some(tag => 
                        tag.includes('大温') || tag.includes('北温') || tag.includes('西温') || 
                        tag.includes('满地宝') || tag.includes('温哥华') || tag.includes('枫树岭') || 
                        tag.includes('高贵林') || tag.includes('匹特草原') || tag.includes('宝云岛')
                    ) && !dest.tags.includes('温哥华岛');
                }
                
                if (!regionMatch) return false;
            }

            // Difficulty filter
            if (filters.difficulty !== 'all' && dest.difficulty !== filters.difficulty) return false;

            // Routes filter
            if (filters.hasRoutes === 'with-routes' && !dest.route) return false;
            if (filters.hasRoutes === 'no-routes' && dest.route) return false;

            return true;
        });
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const resetFilters = () => {
        setFilters({
            waterType: 'all',
            region: 'all',
            difficulty: 'all',
            hasRoutes: 'all',
            weather: 'all'
        });
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== 'all');

    return {
        filters,
        applyFilters,
        handleFilterChange,
        resetFilters,
        hasActiveFilters
    };
}