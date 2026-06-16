import React, { useRef } from 'react';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import styles from './ReelCarousel.module.css';

const combinedRow = [
  { id: 1, title: 'Fresh Avocado', desc: 'Locally sourced', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'Protein Bowls', desc: 'Fuel your day', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: 'Matcha Moments', desc: 'Ceremonial grade', img: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Fire & Flavour', desc: 'Wood-fired perfection', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800' },
  { id: 5, title: 'Finishing Touches', desc: 'Art on a plate', img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800' },
  { id: 6, title: 'Latte Art', desc: 'Poured with love', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800' },
  { id: 7, title: 'Morning Pastries', desc: 'Baked fresh daily', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
  { id: 8, title: 'House Blend', desc: 'Rich and smooth', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800' },
];

const MarqueeTrack = ({ items, direction = 1, speed = 40 }) => {
  // Duplicate items 4 times to ensure absolutely seamless scrolling even on ultrawide monitors
  const scrollItems = [...items, ...items, ...items, ...items];

  return (
    <div className={styles.trackContainer}>
      <motion.div
        className={styles.track}
        animate={{
          x: direction === 1 ? ['-50%', '0%'] : ['0%', '-50%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        {scrollItems.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            className={styles.card}
            style={{ WebkitFontSmoothing: 'antialiased', backfaceVisibility: 'hidden' }}
            whileHover={{ scale: 0.95, zIndex: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className={styles.imageWrapper}>
              <img src={item.img} alt={item.title} className={styles.image} loading="lazy" />
              <div className={styles.overlay}>
                <div className={styles.overlayContent}>
                  <p className={styles.desc}>{item.desc}</p>
                  <h4 className={styles.title}>{item.title}</h4>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const ReelCarousel = () => {
  const containerRef = useRef(null);

  return (
    <section ref={containerRef} className={styles.cinematicSection} id="reels-carousel">
      <div className={styles.header}>
        <motion.span 
          className={styles.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Moments
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

      <div className={styles.marqueeWrapper}>
        <MarqueeTrack items={combinedRow} direction={-1} speed={60} />
      </div>
    </section>
  );
};

export default ReelCarousel;
