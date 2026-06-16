import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../common/ScrollReveal';
import foodBowl from '../../assets/images/food-bowl.png';
import styles from './SignatureMeals.module.css';

const dishes = [
  { id: 1, name: 'Teriyaki Salmon Bowl', macros: '42g Protein · High Omega · Gluten-Free', desc: 'Grilled salmon with quinoa, avocado, edamame, roasted veggies and miso dressing.', badges: ['HIGH PROTEIN', 'OMEGA RICH', 'GLUTEN FREE'] },
  { id: 2, name: 'Grilled Chicken Protein Plate', macros: '48g Protein · Low Carb · Fresh Daily', desc: 'Herb-marinated chicken breast with brown rice, steamed broccoli, and tzatziki.', badges: ['HIGH PROTEIN', 'LOW CARB', 'FRESH DAILY'] },
  { id: 3, name: 'Paneer Harvest Bowl', macros: '28g Protein · High Fibre · Vegetarian', desc: 'Grilled paneer with sweet potato, chickpeas, kale, and tahini drizzle.', badges: ['VEGETARIAN', 'HIGH FIBRE', 'FRESH DAILY'] },
  { id: 4, name: 'Kombucha Citrus Cooler', macros: '0g Fat · Probiotic · Low Sugar', desc: 'House-brewed orange and ginger kombucha with live cultures and citrus zest.', badges: ['PROBIOTIC', 'LOW SUGAR', 'LIVE CULTURE'] },
  { id: 5, name: 'Mediterranean Lunch Box', macros: '22g Protein · Balanced · Office Ready', desc: 'Hummus, falafel, tabbouleh, pita, olives, and feta cheese.', badges: ['BALANCED', 'OFFICE READY', 'FRESH DAILY'] },
];

const slideVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const SignatureMeals = () => {
  const [current, setCurrent] = useState(0);
  const dish = dishes[current];

  const prev = () => setCurrent(c => (c > 0 ? c - 1 : dishes.length - 1));
  const next = () => setCurrent(c => (c < dishes.length - 1 ? c + 1 : 0));

  return (
    <section className={styles.signature} id="signature-meals">
      <ScrollReveal animation="fadeUp" duration={800} threshold={0.15}>
        <div className={styles.signatureInner}>
          {/* Left: Title */}
          <div className={styles.sigLeft}>
            <span className={styles.sigLabel}>Chef's Picks</span>
            <h3 className={styles.sigHeading}>Signature<br />Dishes</h3>
            <p className={styles.sigBody}>Thoughtfully crafted meals that are as good for your body as they are for your soul.</p>
            <a href="/menu" className={styles.sigLink}>View Full Menu →</a>
          </div>

          {/* Center: Image */}
          <div className={styles.sigCenter}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={dish.id}
                className={styles.sigImageWrap}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <img src={foodBowl} alt={dish.name} className={styles.sigImage} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Details */}
          <div className={styles.sigRight}>
            <AnimatePresence mode="wait">
              <motion.div
                key={dish.id}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={slideVariants}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                style={{ marginBottom: '2rem' }}
              >
                <h4 className={styles.sigDishName}>{dish.name}</h4>
                <p className={styles.sigMacros}>{dish.macros}</p>
                <p className={styles.sigDesc}>{dish.desc}</p>
                <div className={styles.sigBadges}>
                  {dish.badges.map(b => (
                    <span key={b} className={styles.sigBadge}>
                      <span className={styles.sigBadgeIcon}>●</span> {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            
            <div className={styles.sigNav}>
              <button className={styles.sigNavBtn} onClick={prev} aria-label="Previous dish">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span className={styles.sigNavCount}>{current + 1} / {dishes.length}</span>
              <button className={styles.sigNavBtn} onClick={next} aria-label="Next dish">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default SignatureMeals;
