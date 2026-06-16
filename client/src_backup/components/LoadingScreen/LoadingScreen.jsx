import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import styles from './LoadingScreen.module.css';

/**
 * LoadingScreen — Cinematic entry animation
 * 
 * Timeline:
 * 1. Letters stagger in (0–400ms)
 * 2. Terracotta accent line draws (300–700ms)
 * 3. Subtitle fades in (500–900ms)
 * 4. Hold (900–1200ms)
 * 5. Screen fades/scales out (1200–1800ms)
 * 
 * Only shows once per session (sessionStorage).
 */
const LoadingScreen = ({ onComplete, onMidpoint }) => {
  const [phase, setPhase] = useState('animating'); // animating | exiting | done
  const containerRef = useRef(null);
  const lettersRef = useRef([]);
  const lineRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      complete: () => {
        if (onMidpoint) onMidpoint();

        // Start exit animation
        setPhase('exiting');
        
        // Use anime for the container exit instead of just CSS
        anime({
          targets: containerRef.current,
          opacity: [1, 0],
          scale: [1, 1.05],
          duration: 600,
          easing: 'easeInOutQuad',
          complete: () => {
            setPhase('done');
            if (onComplete) onComplete();
          }
        });
      }
    });

    // 1. Letters stagger in (faster)
    tl.add({
      targets: lettersRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 500,
      delay: anime.stagger(30, { start: 100 }),
    });

    // 2. Accent line draws (faster)
    tl.add({
      targets: lineRef.current,
      width: ['0px', '120px'],
      duration: 400,
      easing: 'easeInOutQuart',
    }, '-=200');

    // 3. Subtitle fades in (faster)
    tl.add({
      targets: subtitleRef.current,
      opacity: [0, 1],
      translateY: [5, 0],
      duration: 400,
    }, '-=150');

    // 4. Hold briefly before exiting
    tl.add({
      duration: 300,
    });

    return () => tl.pause();
  }, []);

  if (phase === 'done') return null;

  const brandText = 'Bootstrap Cafe';

  return (
    <div 
      ref={containerRef}
      className={`${styles.loadingScreen} ${phase === 'exiting' ? styles['loadingScreen--exit'] : ''}`}
      aria-label="Loading Bootstrap Cafe"
    >
      <div className={styles.brandContainer}>
        <div className={styles.brandName}>
          {brandText.split('').map((char, i) => (
            char === ' ' ? (
              <span key={i} className={styles.letterSpace} />
            ) : (
              <span
                key={i}
                ref={el => lettersRef.current[i] = el}
                className={styles.letter}
              >
                {char}
              </span>
            )
          ))}
        </div>
        <div 
          ref={lineRef} 
          className={styles.accentLine}
        />
        <div 
          ref={subtitleRef} 
          className={styles.subtitle}
        >
          Food that fuels focus
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
