import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../common/SectionHeading';
import styles from './HowWeCook.module.css';

const timelineSteps = [
  { icon: '🌿', title: 'Sourced Responsibly', desc: 'We work with local farmers and ethical suppliers who care for our planet.', img: 'https://images.unsplash.com/photo-1595858801538-466d0ebf0f9c?auto=format&fit=crop&q=80&w=800' },
  { icon: '⚖️', title: 'Nutritionally Balanced', desc: 'Every dish is designed to nourish your body and mind.', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800' },
  { icon: '🗓️', title: 'Seasonal Ingredients', desc: "We celebrate nature's finest, handpicked each season.", img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800' },
  { icon: '♻️', title: 'Zero Waste Philosophy', desc: 'We minimize waste and make mindful choices every day.', img: 'https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=800' },
];

const StoryRow = ({ step, index }) => {
  const isReversed = index % 2 !== 0;

  return (
    <div className={`${styles.storyRow} ${isReversed ? styles.reversed : ''}`}>
      
      {/* Image Side - Animated Entrance */}
      <motion.div 
        className={styles.imageSide}
        initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={styles.imageWrapper}>
          <motion.img 
            src={step.img} 
            alt={step.title} 
            className={styles.storyImg} 
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </motion.div>

      {/* Text Side - Animated Entrance */}
      <motion.div 
        className={styles.textSide}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
        <span className={styles.iconWrapper}>{step.icon}</span>
        <h4 className={styles.stepTitle}>{step.title}</h4>
        <p className={styles.stepDesc}>{step.desc}</p>
      </motion.div>

    </div>
  );
};

const HowWeCook = () => {
  return (
    <section className={styles.storySection} id="how-we-cook">
      
      <motion.div 
        className={styles.introContainer}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <SectionHeading
          label="Our Ingredient Story"
          heading="From nature to your plate."
          italicWord="nature"
          description="We believe that good food starts with good ingredients. Every meal we serve tells a story of ethical sourcing, seasonal freshness, and culinary passion."
          align="center"
        />
      </motion.div>

      <div className={styles.storyContainer}>
        {/* Subtle connecting line down the middle */}
        <div className={styles.timelineConnector}></div>
        
        {timelineSteps.map((step, index) => (
          <StoryRow key={index} step={step} index={index} />
        ))}
      </div>

    </section>
  );
};

export default HowWeCook;
