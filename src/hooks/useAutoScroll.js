import { useState, useEffect, useRef } from 'react';
import { SCROLL_CONFIG } from '../utils/constants.js';

export function useAutoScroll() {
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const animationIdRef = useRef(null);
    const savedScrollPositionRef = useRef(0);
    const savedCardNameRef = useRef(null);

    // This function is no longer needed - we'll track the opened destination directly

    // Function to refocus on the saved card by name
    const refocusOnSavedCard = () => {
        const cardName = savedCardNameRef.current;
        
        if (!cardName) {
            return false;
        }

        // Find the card with matching destination name
        const cards = document.querySelectorAll('.top-card');
        let targetCard = null;
        
        cards.forEach(card => {
            const titleElement = card.querySelector('h3');
            if (titleElement && titleElement.textContent.trim() === cardName) {
                targetCard = card;
            }
        });

        if (!targetCard) {
            return false;
        }
        
        // Simply scroll the card into view at the center
        targetCard.scrollIntoView({ 
            behavior: 'auto', // Use 'auto' to avoid animation conflicts
            block: 'nearest', 
            inline: 'center' 
        });
        
        // Update our saved scroll position to match
        const container = document.getElementById('top-destinations-list');
        if (container) {
            savedScrollPositionRef.current = container.scrollLeft;
        }
        
        return true;
    };

    useEffect(() => {
        if (!isAutoScrolling) return;
        
        const timer = setTimeout(() => {
            const container = document.getElementById('top-destinations-list');
            if (!container || !isAutoScrolling) return;
            
            // Try to refocus on the saved card first, fallback to pixel position
            const cardRestored = refocusOnSavedCard();
            if (!cardRestored && savedScrollPositionRef.current > 0) {
                container.scrollLeft = savedScrollPositionRef.current;
            }
            
            // Small delay to ensure DOM has updated, then start animation
            setTimeout(() => {
                if (!isAutoScrolling) return;
                
                // Start from saved position, but also get current DOM position in case it changed
                let scrollPosition = Math.max(savedScrollPositionRef.current, container.scrollLeft);
            
                const smoothScroll = () => {
                    if (!isAutoScrolling) return;
                    
                    const maxScroll = container.scrollWidth - container.clientWidth;
                    
                    if (maxScroll <= 0) {
                        animationIdRef.current = requestAnimationFrame(smoothScroll);
                        return;
                    }
                    
                    if (scrollPosition >= maxScroll) {
                        scrollPosition = 0;
                    } else {
                        scrollPosition += SCROLL_CONFIG.speed;
                    }
                    
                    container.scrollLeft = scrollPosition;
                    savedScrollPositionRef.current = scrollPosition; // Save current position
                    animationIdRef.current = requestAnimationFrame(smoothScroll);
                };
                
                if (isAutoScrolling) {
                    animationIdRef.current = requestAnimationFrame(smoothScroll);
                }
            }, 50); // Small delay for DOM to settle
        }, SCROLL_CONFIG.delay);
        
        return () => {
            clearTimeout(timer);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }
        };
    }, [isAutoScrolling]);

    const stopAutoScroll = (savePosition = true) => {
        // Save current scroll position before stopping (unless explicitly told not to)
        if (savePosition) {
            const container = document.getElementById('top-destinations-list');
            if (container) {
                savedScrollPositionRef.current = container.scrollLeft;
            }
        }
        
        setIsAutoScrolling(false);
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
        }
    };

    const setSelectedDestination = (destinationName) => {
        // When a destination is explicitly selected, save it as the focus point
        savedCardNameRef.current = destinationName;
    };

    const resumeAutoScroll = () => {
        setIsAutoScrolling(true);
    };

    const updateSavedPosition = () => {
        const container = document.getElementById('top-destinations-list');
        if (container) {
            savedScrollPositionRef.current = container.scrollLeft;
        }
    };

    return {
        isAutoScrolling,
        stopAutoScroll,
        resumeAutoScroll,
        updateSavedPosition,
        setSelectedDestination
    };
}