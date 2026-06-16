import React, { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

const ScrollReveal = ({ 
  children, 
  animation = 'fadeUp', 
  duration = 800, 
  delay = 0, 
  easing = 'easeOutExpo',
  threshold = 0.2
}) => {
  const containerRef = useRef(null);
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRevealed) {
          setHasRevealed(true);
          
          const targets = containerRef.current.children;
          
          let animationProps = {};
          
          switch (animation) {
            case 'fadeUp':
              animationProps = {
                opacity: [0, 1],
                translateY: [40, 0],
              };
              break;
            case 'fadeScale':
              animationProps = {
                opacity: [0, 1],
                scale: [0.9, 1],
              };
              break;
            default:
              animationProps = {
                opacity: [0, 1],
              };
          }

          anime({
            targets,
            ...animationProps,
            duration,
            delay: anime.stagger(150, { start: delay }),
            easing,
          });
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
      // Initialize state
      Array.from(containerRef.current.children).forEach(child => {
        child.style.opacity = '0';
      });
    }

    return () => observer.disconnect();
  }, [hasRevealed, animation, duration, delay, easing, threshold]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {children}
    </div>
  );
};

export default ScrollReveal;
