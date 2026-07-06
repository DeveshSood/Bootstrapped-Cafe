import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './ReelCarousel.module.css';

import heroBg2 from '../../assets/images/hero-bg-2.jpg';
import veganBowl from '../../assets/images/vegan bowl.jpg';
import blackCoffee from '../../assets/images/BlackCoffee.jpeg';
import coworkingSpace from '../../assets/images/Capsule Works - 3rd Floor - Bengaluru - 046.jpg';
import blackTea from '../../assets/images/BlackTea.jpeg';
import paneerBowl from '../../assets/images/paneer bowl.jpg';
import heroBg3 from '../../assets/images/hero-bg-3.jpg';
import cafeBg from '../../assets/images/cafe-bg.jpg';

const combinedRow = [
  { id: 1, title: 'Coworking Spaces', desc: 'Work in peace', img: heroBg2 },
  { id: 2, title: 'Fresh Bowls', desc: 'Locally sourced', img: veganBowl },
  { id: 3, title: 'Signature Roasts', desc: 'Brewed to perfection', img: blackCoffee },
  { id: 4, title: 'Collaborative Hubs', desc: 'Focus and create', img: coworkingSpace },
  { id: 5, title: 'Kombucha & Tea', desc: 'Refresh your mind', img: blackTea },
  { id: 6, title: 'Nutritious Meals', desc: 'Fuel your day', img: paneerBowl },
  { id: 7, title: 'Community Events', desc: 'Connect & grow', img: heroBg3 },
  { id: 8, title: 'Cafe Ambiance', desc: 'Relax and unwind', img: cafeBg },
];

const MarqueeTrack = ({ items, direction = 1, speed = 40 }) => {

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
