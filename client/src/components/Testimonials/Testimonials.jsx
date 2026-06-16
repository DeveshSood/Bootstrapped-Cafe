import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Testimonials.module.css';

const testimonials = [
  { quote: '"The food is incredible and makes me feel so good every time."', name: 'Ananya R.', role: 'Student' },
  { quote: '"Finally a place that combines health, taste and beautiful ambience."', name: 'Karan S.', role: 'Startup Founder' },
  { quote: '"My go-to spot for clean, nourishing and delicious meals."', name: 'Megha V.', role: 'Fitness Coach' },
  { quote: '"The coworking pass is a game changer — healthy food and a calm workspace."', name: 'Arjun P.', role: 'Freelancer' },
  { quote: '"Our team lunch plans have transformed how we eat at the office."', name: 'Priya K.', role: 'HR Manager' },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
    scale: 1.05
  })
};

const Testimonials = () => {
  const [[page, direction], setPage] = useState([0, 0]);

  // Wrap around index
  const activeIndex = Math.abs(page % testimonials.length);
  const t = testimonials[activeIndex];

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [page]);

  return (
    <section className={styles.carouselSection} id="testimonials">
      <div className={styles.container}>
        
        <div className={styles.header}>
          <span className={styles.label}>Loved by Many</span>
          <h3 className={styles.heading}>Kind Words.</h3>
        </div>

        <div className={styles.carouselWrapper}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.4 } }}
              className={styles.quoteCard}
            >
              <span className={styles.quoteMark}>"</span>
              <p className={styles.quoteText}>{t.quote}</p>
              
              <div className={styles.authorArea}>
                <div className={styles.avatar}>{t.name.charAt(0)}</div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{t.name}</span>
                  <span className={styles.authorRole}>{t.role}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Navigation Controls */}
          <div className={styles.navControls}>
            <button className={styles.navBtn} onClick={() => paginate(-1)} aria-label="Previous quote">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIconPrev}>
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <div className={styles.dots}>
              {testimonials.map((_, idx) => (
                <button 
                  key={idx} 
                  className={`${styles.dot} ${idx === activeIndex ? styles.activeDot : ''}`}
                  onClick={() => {
                    const dir = idx > activeIndex ? 1 : -1;
                    setPage([idx, dir]);
                  }}
                  aria-label={`Go to quote ${idx + 1}`}
                />
              ))}
            </div>
            <button className={styles.navBtn} onClick={() => paginate(1)} aria-label="Next quote">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIconNext}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
