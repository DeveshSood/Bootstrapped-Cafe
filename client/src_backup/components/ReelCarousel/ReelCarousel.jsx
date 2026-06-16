import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReelItem from './ReelItem';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import styles from './ReelCarousel.module.css';

// 7 items for a perfect 3-left, 1-center, 3-right infinite layout
const reels = [
  { id: 1, title: 'Fresh Avocado', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 2, title: 'Protein Bowls', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 3, title: 'Matcha Moments', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 4, title: 'Fire & Flavour', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 5, title: 'Finishing Touches', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 6, title: 'Morning Brew', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 7, title: 'Healthy Greens', video: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

const ReelCarousel = () => {
  const [activeReel, setActiveReel] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);
  
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });
  const total = reels.length;

  const handlePrev = useCallback(() => {
    setActiveReel(prev => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveReel(prev => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Auto-scroll
  useEffect(() => {
    if (isPaused || !isVisible || dragStartX !== null) return;
    const intervalId = setInterval(handleNext, 4000);
    return () => clearInterval(intervalId);
  }, [handleNext, isPaused, isVisible, dragStartX]);

  // Drag handlers
  const onPointerDown = (e) => {
    setDragStartX(e.clientX || (e.touches && e.touches[0].clientX));
    setIsPaused(true);
  };

  const onPointerMove = (e) => {
    if (dragStartX === null) return;
    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const diff = dragStartX - currentX;
    
    // If dragged more than 50px, change slide and reset drag
    if (diff > 50) {
      handleNext();
      setDragStartX(currentX);
    } else if (diff < -50) {
      handlePrev();
      setDragStartX(currentX);
    }
  };

  const onPointerUp = () => {
    setDragStartX(null);
    setIsPaused(false);
  };

  return (
    <section className={styles.reelSection} ref={sectionRef} id="reels">
      {/* Quote */}
      <div className={styles.reelQuote}>
        <p className={styles.reelQuoteText}>
          "Healthy food isn't a diet. It's infrastructure for better living."
        </p>
      </div>

      <div className={styles.reelLayout}>
        {/* Top: Text Header */}
        <div className={styles.reelHeader}>
          <span className={styles.reelLabel}>Inside Our Kitchen</span>
          <h3 className={styles.reelHeading}>
            Real ingredients. Real moments.
          </h3>
          <p className={styles.reelBody}>
            A glimpse into our kitchen and the love that goes into every dish.
          </p>
        </div>

        {/* Center: 3D Coverflow Container */}
        <div 
          className={styles.coverflowWrapper}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div className={styles.coverflowInner}>
            {reels.map((reel, index) => {
              let offset = index - activeReel;
              if (offset > Math.floor(total / 2)) offset -= total;
              if (offset < -Math.floor(total / 2)) offset += total;

              return (
                <div 
                  key={reel.id} 
                  className={styles.coverflowItem}
                  style={{
                    transform: `translateX(${offset * 55}%) translateY(${Math.pow(Math.abs(offset), 2) * -15}px) scale(${1 - Math.abs(offset) * 0.15}) translateZ(${Math.abs(offset) * -100}px)`,
                    zIndex: 10 - Math.abs(offset),
                    opacity: Math.abs(offset) > 3 ? 0 : 1, // Hide if beyond 3 on either side
                    filter: offset !== 0 ? 'brightness(0.55)' : 'none',
                    pointerEvents: offset === 0 ? 'auto' : 'none'
                  }}
                >
                  <ReelItem
                    title={reel.title}
                    videoUrl={reel.video}
                    isActive={offset === 0}
                    onClick={() => setActiveReel(index)}
                  />
                </div>
              );
            })}
          </div>
          
          <div className={styles.reelDragHint}>
            <span className={styles.reelDragIcon}>⟷</span>
            Drag to explore
          </div>
        </div>

        {/* Bottom: Dots Navigation */}
        <div className={styles.reelDots}>
          {reels.map((reel, index) => (
            <button
              key={reel.id}
              className={`${styles.reelDot} ${index === activeReel ? styles.reelDotActive : ''}`}
              onClick={() => setActiveReel(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReelCarousel;
