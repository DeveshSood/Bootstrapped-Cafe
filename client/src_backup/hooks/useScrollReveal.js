import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useScrollReveal — Scroll-progress-based animation hook
 * 
 * Tracks how far a section has been scrolled through and
 * returns a progress value (0 to 1) for driving CSS transforms.
 * 
 * Usage:
 *   const { ref, progress } = useScrollReveal({ start: 0.2, end: 0.8 });
 */
const useScrollReveal = (options = {}) => {
  const {
    start = 0, // When to start (0 = top of viewport)
    end = 1,   // When to end
  } = options;

  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  const calculateProgress = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how far the element has scrolled through the viewport
    const elementTop = rect.top;
    const elementHeight = rect.height;
    
    // Raw progress: 0 when element enters bottom, 1 when it leaves top
    const rawProgress = 1 - (elementTop / (windowHeight + elementHeight));
    
    // Clamp and remap to start/end range
    const clampedProgress = Math.min(Math.max((rawProgress - start) / (end - start), 0), 1);
    
    setProgress(clampedProgress);
  }, [start, end]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    calculateProgress(); // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [calculateProgress]);

  return { ref, progress };
};

export default useScrollReveal;
