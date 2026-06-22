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
  const [useVideo, setUseVideo] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(true);
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
    let timer;
    if (useVideo) {
      setIntroPlaying(true);
      document.body.classList.add('video-intro-active');
      timer = setTimeout(() => {
        document.body.classList.remove('video-intro-active');
        setIntroPlaying(false);
      }, 7000);
    } else {
      document.body.classList.remove('video-intro-active');
      setIntroPlaying(false);
    }

    return () => {
      clearTimeout(timer);
      document.body.classList.remove('video-intro-active');
    };
  }, [useVideo]);

  useEffect(() => {
    if (introPlaying) {
      // Force elements to be hidden instantly while intro is playing
      if (contentRef.current) anime.set(contentRef.current.querySelectorAll('[data-animate]'), { opacity: 0 });
      if (statsRef.current) anime.set(statsRef.current.children, { opacity: 0 });
      return;
    }

    // Stagger entrance animation
    const tl = anime.timeline({
      easing: 'easeOutExpo',
    });

    tl.add({
      targets: contentRef.current?.querySelectorAll('[data-animate]'),
      opacity: [0, 1],
      translateY: [40, 0],
      duration: 1000,
      delay: anime.stagger(120, { start: 100 }),
    });

    tl.add({
      targets: statsRef.current?.children,
      opacity: [0, 1],
      translateY: [30, 0],
      scale: [0.9, 1],
      duration: 800,
      delay: anime.stagger(100),
    }, '-=600');
  }, [introPlaying]);



  return (
    <section className={styles.hero} id="hero" ref={heroRef}>
      {/* Background Media */}
      {useVideo ? (
        <video 
          src={mainVideo} 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={styles.heroVideoBg} 
        />
      ) : (
        <AnimatePresence mode="sync">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide]}
            alt={`Healthy food preparation slide ${currentSlide + 1}`}
            className={styles.heroBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </AnimatePresence>
      )}

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
      {!useVideo && (
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
      )}

      {/* Video Toggle Button */}
      <button 
        className={styles.videoToggleBtn} 
        onClick={() => setUseVideo(!useVideo)}
        title="Toggle between Video and Slideshow"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {useVideo ? (
            <>
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </>
          ) : (
            <>
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </>
          )}
        </svg>
        {useVideo ? 'Switch to Images' : 'Switch to Video'}
      </button>

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
