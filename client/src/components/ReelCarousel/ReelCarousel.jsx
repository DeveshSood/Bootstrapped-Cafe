import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Maximize } from 'lucide-react';
import styles from './ReelCarousel.module.css';

import vishab from '../../assets/videos/vishab.mp4';
import danish from '../../assets/videos/danish.mp4';
import aravind from '../../assets/videos/aravind.mp4';
import satish from '../../assets/videos/satish.mp4';
import saurav from '../../assets/videos/saurav.mp4';
import v1Video from '../../assets/videos/v1.mp4';
import v2Video from '../../assets/videos/v2.mp4';
import v3Video from '../../assets/videos/v3.mp4';
import chefVideo from '../../assets/videos/VM_Chef03.mp4';
import pastaVideo from '../../assets/videos/pasta_showreel.mp4';

const videos = [
  { id: 1, title: 'Vishab', src: vishab },
  { id: 2, title: 'Danish', src: danish },
  { id: 3, title: 'Aravind', src: aravind },
  { id: 4, title: 'Satish', src: satish },
  { id: 5, title: 'Saurav', src: saurav },
  {
    id: 6,
    title: 'The Perfect Pour',
    description: 'Every cup is crafted with precision by our expert baristas. We source only the finest organic beans, roasting them in-house to ensure an unforgettable, rich flavor profile in every single drop.',
    src: v1Video
  },
  {
    id: 7,
    title: 'Protein Packed',
    description: 'Fuel your focus with our signature bowls. Packed with locally sourced greens, lean proteins, and house-made dressings, every bite is designed to give you sustained energy throughout your workday.',
    src: v2Video
  },
  {
    id: 8,
    title: 'Fresh Ingredients',
    description: 'We believe that great food starts with exceptional ingredients. Sourced daily from local organic farms, our produce ensures maximum flavor, vibrant colors, and optimal nutrition for every meal.',
    src: v3Video
  },
  {
    id: 9,
    title: 'Chef in Action',
    description: 'Watch our head chef bring passion and precision to the kitchen. From the sizzle of the pan to the final artistic garnish, every dish is a culinary masterpiece prepared fresh to order.',
    src: chefVideo
  },
  {
    id: 10,
    title: 'Pasta Perfection',
    description: 'Experience the magic of handcrafted pasta made fresh daily. Kneaded with care and cooked to al dente perfection, our dishes combine traditional techniques with bold, modern flavors.',
    src: pastaVideo
  }
];

const ReelCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(videos.length / 2));
  const [isMuted, setIsMuted] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const carouselRef = useRef(null);
  const videoRefs = useRef([]);
  const isScrolling = useRef(false);
  const wheelOffset = useRef(0);
  const wheelTimeout = useRef(null);
  const touchStartX = useRef(0);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Manage play/pause dynamically based on active index
  useEffect(() => {
    const activeMod = ((activeIndex % videos.length) + videos.length) % videos.length;
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === activeMod) {
        video.play().catch(e => console.log("Autoplay prevented:", e));
      } else {
        video.pause();
      }
    });
  }, [activeIndex]);

  const handleWheel = (e) => {
    if (isScrolling.current) return;

    // Reset accumulator after a short pause in scrolling
    if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
    wheelTimeout.current = setTimeout(() => {
      wheelOffset.current = 0;
    }, 150);

    // Only accumulate if it's primarily a horizontal scroll
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      wheelOffset.current += e.deltaX;

      if (Math.abs(wheelOffset.current) > 40) {
        if (wheelOffset.current > 0) {
          setActiveIndex(prev => prev + 1);
          isScrolling.current = true;
          setTimeout(() => { isScrolling.current = false; }, 800);
        } else if (wheelOffset.current < 0) {
          setActiveIndex(prev => prev - 1);
          isScrolling.current = true;
          setTimeout(() => { isScrolling.current = false; }, 800);
        }
        wheelOffset.current = 0;
      }
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipe = touchEndX - touchStartX.current;
    if (swipe < -40) {
      setActiveIndex(prev => prev + 1);
    } else if (swipe > 40) {
      setActiveIndex(prev => prev - 1);
    }
  };

  const handleVideoClick = (index, e) => {
    const activeMod = ((activeIndex % videos.length) + videos.length) % videos.length;
    let offset = index - activeMod;
    if (offset > videos.length / 2) offset -= videos.length;
    if (offset < -videos.length / 2) offset += videos.length;

    if (offset === 0) {
      const videoEl = videoRefs.current[index];
      if (videoEl) {
        if (videoEl.requestFullscreen) {
          videoEl.requestFullscreen();
        } else if (videoEl.webkitRequestFullscreen) {
          videoEl.webkitRequestFullscreen();
        }
      }
    } else {
      setActiveIndex(prev => prev + offset);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <section className={styles.cinematicSection} id="reels-carousel">
      <div className={styles.header}>
        <motion.span 
          className={styles.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Moments & Behind the Scenes
        </motion.span>
        <motion.h3 
          className={styles.heading}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Life at Bootstrap
        </motion.h3>
      </div>

      <div 
        className={styles.carouselContainer} 
        ref={carouselRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {videos.map((video, index) => {
          const activeMod = ((activeIndex % videos.length) + videos.length) % videos.length;
          let offset = index - activeMod;
          if (offset > videos.length / 2) offset -= videos.length;
          if (offset < -videos.length / 2) offset += videos.length;
          
          const isActive = offset === 0;
          
          // Determine dynamic spacing based on screen width
          const spacing = windowWidth > 1600 ? 180 : windowWidth > 1200 ? 150 : 120;
          
          return (
            <motion.div
              key={video.id}
              className={`${styles.videoCard} ${isActive ? styles.activeCard : ''}`}
              initial={false}
              animate={{
                x: `${offset * spacing}%`,
                scale: isActive ? 1.15 : 0.8,
                rotateY: offset * -10,
                rotateZ: offset * 2,
                zIndex: isActive ? 10 : 5 - Math.abs(offset),
                opacity: Math.abs(offset) > 2 ? 0 : 1,
                filter: isActive ? 'brightness(1.05) contrast(1.4) saturate(1.6) drop-shadow(0 0 1px rgba(0,0,0,0.3)) blur(0px)' : 'brightness(0.4) blur(3px) grayscale(40%)'
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            >
              <div className={styles.videoWrapper}>
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={video.src}
                  className={styles.videoElement}
                  loop
                  muted={!isActive || isMuted}
                  playsInline
                  onClick={(e) => handleVideoClick(index, e)}
                />
                
                {isActive && (
                  <div className={styles.controlsOverlay}>
                    <button className={styles.iconButton} onClick={toggleMute} aria-label="Toggle mute">
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <button className={styles.iconButton} onClick={(e) => handleVideoClick(index, e)} aria-label="Fullscreen">
                      <Maximize size={20} />
                    </button>
                  </div>
                )}

                <div className={styles.titleOverlay}>
                  <div className={styles.titleContent}>
                    <h4>{video.title}</h4>
                    {video.description && <p className={styles.description}>{video.description}</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className={styles.pagination}>
         {videos.map((_, idx) => {
           const activeMod = ((activeIndex % videos.length) + videos.length) % videos.length;
           return (
             <button 
               key={idx} 
               className={`${styles.dot} ${idx === activeMod ? styles.activeDot : ''}`}
               onClick={() => {
                 let offset = idx - activeMod;
                 if (offset > videos.length / 2) offset -= videos.length;
                 if (offset < -videos.length / 2) offset += videos.length;
                 setActiveIndex(prev => prev + offset);
               }}
               aria-label={`Go to reel ${idx + 1}`}
             />
           );
         })}
      </div>
    </section>
  );
};

export default ReelCarousel;
