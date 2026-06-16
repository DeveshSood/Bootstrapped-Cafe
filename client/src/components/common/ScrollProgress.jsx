import React, { useState, useEffect } from 'react';
import styles from './ScrollProgress.module.css';

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId = null;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (winHeightPx <= 0) return;
        
        const scrolled = (scrollPx / winHeightPx) * 100;
        setScrollProgress(scrolled);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 29; /* 31 center - 2 (half of 4px stroke) = 29, so it touches the outer bound exactly */
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div 
      className={`${styles.scrollContainer} ${scrollProgress > 5 ? styles.visible : ''}`} 
      onClick={scrollToTop}
      role="button"
      aria-label="Scroll to top"
    >
      <svg className={styles.progressRing} width="62" height="62">
        <circle
          className={styles.progressRingCircleBg}
          stroke="rgba(30, 24, 21, 0.08)"
          strokeWidth="4"
          fill="transparent"
          r={radius}
          cx="31"
          cy="31"
        />
        <circle
          className={styles.progressRingCircle}
          stroke="var(--terracotta)"
          strokeWidth="4"
          fill="rgba(255, 255, 255, 0.9)"
          r={radius}
          cx="31"
          cy="31"
          style={{ strokeDasharray: circumference, strokeDashoffset }}
        />
      </svg>
      <div className={styles.arrow}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
      </div>
    </div>
  );
};

export default ScrollProgress;
