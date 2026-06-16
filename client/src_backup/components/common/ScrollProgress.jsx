import React, { useState, useEffect } from 'react';
import styles from './ScrollProgress.module.css';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      if (winHeightPx <= 0) return;
      
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div 
      className={`${styles.scrollContainer} ${scrollProgress > 5 ? styles.visible : ''}`} 
      onClick={scrollToTop}
      role="button"
      aria-label="Scroll to top"
    >
      <svg className={styles.progressRing} width="54" height="54">
        <circle
          className={styles.progressRingCircleBg}
          stroke="rgba(30, 24, 21, 0.08)"
          strokeWidth="3"
          fill="transparent"
          r={radius}
          cx="27"
          cy="27"
        />
        <circle
          className={styles.progressRingCircle}
          stroke="var(--terracotta)"
          strokeWidth="3"
          fill="rgba(255, 255, 255, 0.9)"
          r={radius}
          cx="27"
          cy="27"
          style={{ strokeDasharray: circumference, strokeDashoffset }}
        />
      </svg>
      <span className={styles.arrow}>↑</span>
    </div>
  );
};

export default ScrollProgress;
