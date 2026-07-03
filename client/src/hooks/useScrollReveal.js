import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useScrollReveal — Returns { ref, progress } where progress (0–1) tracks
 * how far the referenced element has scrolled through the viewport.
 */
const useScrollReveal = (options = {}) => {
  const { start = 0, end = 1 } = options;

  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);

  const calculateProgress = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;
    
    const rawProgress = 1 - (rect.top / (windowHeight + elementHeight));
    const clampedProgress = Math.min(Math.max((rawProgress - start) / (end - start), 0), 1);
    
    setProgress(clampedProgress);
  }, [start, end]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(calculateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [calculateProgress]);

  return { ref, progress };
};

export default useScrollReveal;
