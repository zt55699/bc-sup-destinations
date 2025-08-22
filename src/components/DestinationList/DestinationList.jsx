import React, { useState, useRef, useEffect } from 'react';
import DestinationCard from './DestinationCard.jsx';

function DestinationList({ 
    destinations, 
    activeDestinationId, 
    hiddenDestinations, 
    onStopAutoScroll, 
    onSelectDestination, 
    onToggleVisibility,
    filters,
    onFilterChange,
    onResetFilters,
    hasActiveFilters,
    showFilterButton = true,
    favorites = [],
    onRemoveFromFavorites
}) {
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [showFavoritesDropdown, setShowFavoritesDropdown] = useState(false);
    const [previousDestinations, setPreviousDestinations] = useState(destinations);
    const [animatingOut, setAnimatingOut] = useState(new Set());
    const [wasHiddenBefore, setWasHiddenBefore] = useState(false);
    const dropdownRef = useRef(null);
    const favoritesRef = useRef(null);

    // Handle filter animation when destinations change
    useEffect(() => {
        const container = document.getElementById('top-destinations-list');
        const currentScrollPosition = container?.scrollLeft || 0;
        
        const currentIds = new Set(destinations.map(d => d.id));
        const previousIds = new Set(previousDestinations.map(d => d.id));
        
        // Find destinations that are leaving (being filtered out)
        const leaving = previousDestinations.filter(d => !currentIds.has(d.id));
        
        if (leaving.length > 0) {
            // Mark leaving destinations as animating out
            const leavingIds = new Set(leaving.map(d => d.id));
            setAnimatingOut(leavingIds);
            
            // After animation duration, update the previous destinations
            setTimeout(() => {
                setPreviousDestinations(destinations);
                setAnimatingOut(new Set());
                
                // Restore scroll position after filter animation
                if (container && currentScrollPosition > 0) {
                    container.scrollLeft = currentScrollPosition;
                }
            }, 300); // Match fade-out duration
        } else {
            // No leaving animation needed, update immediately
            setPreviousDestinations(destinations);
            
            // Preserve scroll position for immediate updates too
            if (container && currentScrollPosition > 0) {
                setTimeout(() => {
                    container.scrollLeft = currentScrollPosition;
                }, 50);
            }
        }
    }, [destinations]);

    // Track filter button visibility changes and close dropdown when hidden
    useEffect(() => {
        if (!showFilterButton) {
            setShowFilterDropdown(false);
            setWasHiddenBefore(true);
        } else if (showFilterButton && wasHiddenBefore) {
            // Reset the animation state after the reveal animation completes
            const timer = setTimeout(() => {
                setWasHiddenBefore(false);
            }, 800); // 300ms delay + 500ms animation
            
            return () => clearTimeout(timer);
        }
    }, [showFilterButton, wasHiddenBefore]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowFilterDropdown(false);
            }
            if (favoritesRef.current && !favoritesRef.current.contains(event.target)) {
                setShowFavoritesDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle favorite selection
    const handleFavoriteSelect = (favoriteId) => {
        onSelectDestination(favoriteId);
        setShowFavoritesDropdown(false);
    };

    // Remove favorite from list
    const removeFavorite = (favoriteId) => {
        onRemoveFromFavorites(favoriteId);
    };

    // Render difficulty icon (same as DetailCard)
    const renderDifficultyIcon = (difficulty) => {
        switch (difficulty) {
            case 'beginner':
                return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
            case 'intermediate':
                return <div className="w-3 h-3 bg-blue-500"></div>;
            case 'advanced':
                return (
                    <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-black transform rotate-45"></div>
                    </div>
                );
            case 'expert':
                return (
                    <div className="bg-white rounded-sm px-1 py-0.5 flex gap-0.5 h-4 items-center">
                        <div className="w-1.5 h-1.5 bg-black transform rotate-45"></div>
                        <div className="w-1.5 h-1.5 bg-black transform rotate-45"></div>
                    </div>
                );
            default:
                return null;
        }
    };

    // Get favorite data with difficulty info
    const getFavoriteData = (favoriteId) => {
        const destination = destinations.find(d => d.id === favoriteId);
        const favorite = favorites.find(f => f.id === favoriteId);
        return favorite && destination ? { ...favorite, difficulty: destination.difficulty } : favorite;
    };

    return (
        <div id="top-destinations-container" className="fixed top-0 left-0 right-0 z-10 pt-8 md:pt-6">
            <div 
                id="top-destinations-list" 
                className="no-scrollbar flex gap-3 overflow-x-auto px-4"
                onMouseEnter={onStopAutoScroll}
                onTouchStart={onStopAutoScroll}
            >
                {/* Render destinations with animation logic */}
                {(() => {
                    const currentIds = new Set(destinations.map(d => d.id));
                    const allDestinations = [...previousDestinations];
                    
                    // Add new destinations that aren't in previous
                    destinations.forEach(dest => {
                        if (!previousDestinations.find(p => p.id === dest.id)) {
                            allDestinations.push(dest);
                        }
                    });
                    
                    return allDestinations.map((dest, index) => {
                        const isLeaving = animatingOut.has(dest.id);
                        const isNew = !previousDestinations.find(p => p.id === dest.id) && currentIds.has(dest.id);
                        const shouldShow = currentIds.has(dest.id) || isLeaving;
                        
                        if (!shouldShow) return null;
                        
                        return (
                            <DestinationCard
                                key={dest.id}
                                destination={dest}
                                isActive={activeDestinationId === dest.id}
                                isHidden={hiddenDestinations.has(dest.id)}
                                onSelect={onSelectDestination}
                                onToggleVisibility={onToggleVisibility}
                                isAnimatingOut={isLeaving}
                                animationDelay={isNew ? index * 50 : 0}
                            />
                        );
                    });
                })()}
            </div>
            {showFilterButton && (
                <div 
                    className={`flex justify-start px-4 mt-3 relative ${
                        wasHiddenBefore ? 'filter-button-container' : 'filter-button-container immediate'
                    }`} 
                    ref={dropdownRef}
                >
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className={`w-8 h-8 rounded-full backdrop-blur-lg border transition-all duration-300 flex items-center justify-center ${
                            hasActiveFilters || showFilterDropdown
                                ? 'bg-sky-500/20 border-sky-400/40 text-sky-300' 
                                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                        }`}
                        title="过滤目的地"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 5.6001C20 5.04005 19.9996 4.75981 19.8906 4.5459C19.7948 4.35774 19.6423 4.20487 19.4542 4.10899C19.2403 4 18.9597 4 18.3996 4H5.59961C5.03956 4 4.75981 4 4.5459 4.10899C4.35774 4.20487 4.20487 4.35774 4.10899 4.5459C4 4.75981 4 5.04005 4 5.6001V6.33736C4 6.58195 4 6.70433 4.02763 6.81942C4.05213 6.92146 4.09263 7.01893 4.14746 7.1084C4.20928 7.20928 4.29591 7.29591 4.46875 7.46875L9.53149 12.5315C9.70443 12.7044 9.79044 12.7904 9.85228 12.8914C9.90711 12.9808 9.94816 13.0786 9.97266 13.1807C10 13.2946 10 13.4155 10 13.6552V18.411C10 19.2682 10 19.6971 10.1805 19.9552C10.3382 20.1806 10.5814 20.331 10.8535 20.3712C11.1651 20.4172 11.5487 20.2257 12.3154 19.8424L13.1154 19.4424C13.4365 19.2819 13.5966 19.2013 13.7139 19.0815C13.8176 18.9756 13.897 18.8485 13.9453 18.7084C14 18.5499 14 18.37 14 18.011V13.6626C14 13.418 14 13.2958 14.0276 13.1807C14.0521 13.0786 14.0926 12.9808 14.1475 12.8914C14.2089 12.7911 14.2947 12.7053 14.4653 12.5347L14.4688 12.5315L19.5315 7.46875C19.7044 7.2958 19.7904 7.20932 19.8523 7.1084C19.9071 7.01893 19.9482 6.92146 19.9727 6.81942C20 6.70551 20 6.58444 20 6.3448V5.6001Z"/>
                        </svg>
                    </button>

                    {showFilterDropdown && (
                    <div className="absolute top-0 left-14 w-56 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg p-3 z-20">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-white font-medium text-sm">过滤条件</h3>
                            {hasActiveFilters && (
                                <button 
                                    onClick={onResetFilters}
                                    className="text-xs text-sky-300 hover:text-sky-200 transition-colors px-2 py-1 rounded-md hover:bg-white/10"
                                >
                                    重置
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {/* Water Type Filter */}
                            <div>
                                <label className="block text-xs font-medium text-white/70 mb-1">水域类型</label>
                                <select 
                                    value={filters.waterType}
                                    onChange={(e) => onFilterChange('waterType', e.target.value)}
                                    className="w-full px-2 py-1.5 text-xs bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:ring-1 focus:ring-sky-400/40 focus:border-sky-400/40 transition-all duration-300 outline-none"
                                >
                                    <option value="all">全部</option>
                                    <option value="saltwater">海水</option>
                                    <option value="freshwater">淡水</option>
                                </select>
                            </div>

                            {/* Region Filter */}
                            <div>
                                <label className="block text-xs font-medium text-white/70 mb-1">地区</label>
                                <select 
                                    value={filters.region}
                                    onChange={(e) => onFilterChange('region', e.target.value)}
                                    className="w-full px-2 py-1.5 text-xs bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:ring-1 focus:ring-sky-400/40 focus:border-sky-400/40 transition-all duration-300 outline-none"
                                >
                                    <option value="all">全部</option>
                                    <option value="greater-vancouver">大温地区</option>
                                    <option value="vancouver-island">温哥华岛</option>
                                    <option value="whistler-pemberton">惠斯勒</option>
                                    <option value="sea-to-sky">海天公路</option>
                                    <option value="chilliwack">奇利瓦克</option>
                                    <option value="inner-bc">内陆BC</option>
                                </select>
                            </div>

                            {/* Difficulty Filter */}
                            <div>
                                <label className="block text-xs font-medium text-white/70 mb-1">难度等级</label>
                                <select 
                                    value={filters.difficulty}
                                    onChange={(e) => onFilterChange('difficulty', e.target.value)}
                                    className="w-full px-2 py-1.5 text-xs bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:ring-1 focus:ring-sky-400/40 focus:border-sky-400/40 transition-all duration-300 outline-none"
                                >
                                    <option value="all">全部</option>
                                    <option value="beginner">初级</option>
                                    <option value="intermediate">中级</option>
                                    <option value="advanced">高级</option>
                                    <option value="expert">专家级</option>
                                </select>
                            </div>

                            {/* Routes Filter */}
                            <div>
                                <label className="block text-xs font-medium text-white/70 mb-1">路线</label>
                                <select 
                                    value={filters.hasRoutes}
                                    onChange={(e) => onFilterChange('hasRoutes', e.target.value)}
                                    className="w-full px-2 py-1.5 text-xs bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg text-white focus:ring-1 focus:ring-sky-400/40 focus:border-sky-400/40 transition-all duration-300 outline-none"
                                >
                                    <option value="all">全部</option>
                                    <option value="with-routes">有路线</option>
                                    <option value="no-routes">无路线</option>
                                </select>
                            </div>
                        </div>

                        <div className="text-xs text-white/50 mt-3 pt-2 border-t border-white/10">
                            显示 {destinations.length} 个目的地
                        </div>
                    </div>
                    )}
                </div>
            )}
            
            {showFilterButton && (
                <div 
                    className={`flex justify-start px-4 mt-2 relative ${
                        wasHiddenBefore ? 'filter-button-container' : 'filter-button-container immediate'
                    }`} 
                    ref={favoritesRef}
                >
                    <button
                        onClick={() => setShowFavoritesDropdown(!showFavoritesDropdown)}
                        className={`w-8 h-8 rounded-full backdrop-blur-lg border transition-all duration-300 flex items-center justify-center ${
                            showFavoritesDropdown
                                ? 'bg-pink-500/20 border-pink-400/40 text-pink-300' 
                                : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/15'
                        }`}
                        title="收藏夹"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>

                    {showFavoritesDropdown && (
                        <div className="absolute top-0 left-14 w-56 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg p-3 z-20">

                            <div className="space-y-2">
                                {favorites.length === 0 ? (
                                    <div className="text-white/50 text-xs text-center py-2">暂无收藏</div>
                                ) : (
                                    favorites.map((favorite) => {
                                        const favoriteData = getFavoriteData(favorite.id);
                                        return (
                                            <div 
                                                key={favorite.id}
                                                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
                                                onClick={() => handleFavoriteSelect(favorite.id)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {favoriteData?.difficulty && renderDifficultyIcon(favoriteData.difficulty)}
                                                    <span className="text-white text-sm">{favorite.name}</span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFavorite(favorite.id);
                                                    }}
                                                    className="opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-white/50 hover:text-red-400"
                                                    title="移除收藏"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="text-xs text-white/50 mt-3 pt-2 border-t border-white/10">
                                {favorites.length} 个收藏
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DestinationList;