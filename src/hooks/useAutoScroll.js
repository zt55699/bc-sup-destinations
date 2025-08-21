import { useState, useEffect, useRef } from 'react';
import { SCROLL_CONFIG } from '../utils/constants.js';

export function useAutoScroll() {
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const animationIdRef = useRef(null);

    useEffect(() => {
        if (!isAutoScrolling) return;
        
        const timer = setTimeout(() => {
            const container = document.getElementById('top-destinations-list');
            if (!container || !isAutoScrolling) return;
            
            let scrollPosition = 0;
            
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
                animationIdRef.current = requestAnimationFrame(smoothScroll);
            };
            
            if (isAutoScrolling) {
                animationIdRef.current = requestAnimationFrame(smoothScroll);
            }
        }, SCROLL_CONFIG.delay);
        
        return () => {
            clearTimeout(timer);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }
        };
    }, [isAutoScrolling]);

    const stopAutoScroll = () => {
        setIsAutoScrolling(false);
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
        }
    };

    return {
        isAutoScrolling,
        stopAutoScroll
    };
}