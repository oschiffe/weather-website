import { useEffect, useRef, useState } from 'react';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * A hook to handle scroll-triggered animations
 * 
 * @param options ScrollAnimationOptions
 * @returns Object with ref to be attached to the element and isVisible state
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const { 
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true
  } = options;
  
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state based on intersection
        const isIntersecting = entry.isIntersecting;
        
        // If triggerOnce is true, only animate if it hasn't animated before
        if (triggerOnce) {
          if (isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        } else {
          // Otherwise, update visibility based on current intersection
          setIsVisible(isIntersecting);
        }
      },
      { threshold, rootMargin }
    );
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, triggerOnce, hasAnimated]);
  
  return { ref, isVisible };
}

export default useScrollAnimation;