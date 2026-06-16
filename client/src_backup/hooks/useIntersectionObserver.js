import { useState, useEffect, useRef } from 'react';

/**
 * useIntersectionObserver — Scroll-based visibility detection
 * 
 * Returns [ref, isIntersecting] for triggering scroll animations.
 * 
 * Usage:
 *   const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });
 */
const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (triggerOnce && hasTriggered.current) return;
        
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          hasTriggered.current = true;
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isIntersecting];
};

export default useIntersectionObserver;
