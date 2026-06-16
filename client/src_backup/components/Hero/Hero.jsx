import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import anime from 'animejs';
import Button from '../common/Button';

// Using the provided local images for slideshow
import heroBg1 from '../../assets/images/cafe-bg.jpg';
import heroBg2 from '../../assets/images/hero-bg-2.jpg';
import heroBg3 from '../../assets/images/hero-bg-3.jpg';
import styles from './Hero.module.css';

const slides = [heroBg1, heroBg2, heroBg3];

/**
 * Hero — Fullscreen cinematic hero section
 * 
 * Features:
 * - Slideshow background images with matte overlay
 * - Three.js floating particles (enhanced)
 * - SAVORA-style heading with italic emphasis
 * - Slide counter (desktop)
 * - Floating stat cards with animation
 * - Anime.js entrance animations
 * - Magnetic mouse-following parallax on content
 */
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const contentRef = useRef(null);
  const statsRef = useRef(null);
  const heroRef = useRef(null);

  // Slideshow interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Stagger entrance animation
    const tl = anime.timeline({
      easing: 'easeOutExpo',
    });

    tl.add({
      targets: contentRef.current?.querySelectorAll('[data-animate]'),
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1000,
      delay: anime.stagger(120, { start: 500 }),
    });

    tl.add({
      targets: statsRef.current?.children,
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.9, 1],
      duration: 800,
      delay: anime.stagger(100),
    }, '-=600');
  }, []);



  return (
    <section className={styles.hero} id="hero" ref={heroRef}>
      {/* Background Slideshow */}
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentSlide}
          src={slides[currentSlide]}
          alt={`Healthy food preparation slide ${currentSlide + 1}`}
          className={styles.heroBg}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </AnimatePresence>

      {/* Matte Overlay */}
      <div className={styles.heroOverlay} />

      {/* Content */}
      <div className={styles.heroContent} ref={contentRef}>
        <span className={styles.heroLabel} data-animate>
          Good Food. Real Ingredients.
        </span>

        <h1 className={styles.heroHeading} data-animate>
          Food that heals,{' '}
          <br />
          crafted with <em>intention.</em>
        </h1>

        <p className={styles.heroSubtext} data-animate>
          Organic ingredients. Balanced nutrition.
          <br />
          Made fresh everyday.
        </p>

        <div className={styles.heroCtas} data-animate>
          <Button variant="filled" size="md" href="/menu">
            Explore Menu
          </Button>
          <Button variant="outlined-light" size="md" href="/#coworking">
            Book a Table
          </Button>
        </div>
      </div>

      {/* Slide Counter (right side) */}
      <div className={styles.heroSlideCounter}>
        <span className={styles.heroSlideNumber}>0{currentSlide + 1}</span>
        <span className={styles.heroSlideTotal}>/03</span>
        <div className={styles.heroDots}>
          {slides.map((_, index) => (
            <button 
              key={index}
              className={`${styles.heroDot} ${index === currentSlide ? styles['heroDot--active'] : ''}`} 
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.heroStats} ref={statsRef}>
        <div className={styles.heroStat}>
          <div className={styles.heroStatValue}>50+</div>
          <div className={styles.heroStatLabel}>Healthy Combos</div>
        </div>
        <div className={styles.heroStat}>
          <div className={styles.heroStatValue}>₹599</div>
          <div className={styles.heroStatLabel}>Coworking Pass</div>
        </div>
        <div className={styles.heroStat}>
          <div className={styles.heroStatValue}>Custom</div>
          <div className={styles.heroStatLabel}>Office Meals</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
