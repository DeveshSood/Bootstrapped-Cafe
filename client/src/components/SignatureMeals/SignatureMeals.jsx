import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import foodBowl from '../../assets/images/food-bowl.png';
import styles from './SignatureMeals.module.css';

const dishes = [
  { id: 1, name: 'Teriyaki Salmon Bowl', macros: '42g Protein · High Omega · Gluten-Free', desc: 'Grilled salmon with quinoa, avocado, edamame, roasted veggies and miso dressing.', badges: ['HIGH PROTEIN', 'OMEGA RICH', 'GLUTEN FREE'], img: foodBowl },
  { id: 2, name: 'Grilled Chicken Protein Plate', macros: '48g Protein · Low Carb · Fresh Daily', desc: 'Herb-marinated chicken breast with brown rice, steamed broccoli, and tzatziki.', badges: ['HIGH PROTEIN', 'LOW CARB', 'FRESH DAILY'], img: foodBowl },
  { id: 3, name: 'Paneer Harvest Bowl', macros: '28g Protein · High Fibre · Vegetarian', desc: 'Grilled paneer with sweet potato, chickpeas, kale, and tahini drizzle.', badges: ['VEGETARIAN', 'HIGH FIBRE', 'FRESH DAILY'], img: foodBowl },
  { id: 4, name: 'Kombucha Citrus Cooler', macros: '0g Fat · Probiotic · Low Sugar', desc: 'House-brewed orange and ginger kombucha with live cultures and citrus zest.', badges: ['PROBIOTIC', 'LOW SUGAR', 'LIVE CULTURE'], img: foodBowl },
  { id: 5, name: 'Mediterranean Lunch Box', macros: '22g Protein · Balanced · Office Ready', desc: 'Hummus, falafel, tabbouleh, pita, olives, and feta cheese.', badges: ['BALANCED', 'OFFICE READY', 'FRESH DAILY'], img: foodBowl },
];

const SignatureMeals = () => {
  const [current, setCurrent] = useState(0);
  const dish = dishes[current];

  const prev = () => setCurrent(c => (c > 0 ? c - 1 : dishes.length - 1));
  const next = () => setCurrent(c => (c < dishes.length - 1 ? c + 1 : 0));

  return (
    <section className={styles.magazineSection} id="signature-meals">
      <div className={styles.container}>
        
        {/* Background Typography */}
        <div className={styles.bgTextWrapper}>
          <AnimatePresence mode="wait">
            <motion.div 
              key={dish.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
              animate={{ opacity: 0.04, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={styles.bgText}
            >
              {dish.name}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={styles.contentGrid}>
          {/* Left Column: Details */}
          <div className={styles.leftCol}>
            <div className={styles.headerArea}>
              <span className={styles.label}>Chef's Picks</span>
              <h3 className={styles.heading}>Signature <br/><span className={styles.italic}>Dishes.</span></h3>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={dish.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={styles.dishDetails}
              >
                <h4 className={styles.dishName}>{dish.name}</h4>
                <p className={styles.macros}>{dish.macros}</p>
                <p className={styles.desc}>{dish.desc}</p>
                <div className={styles.badges}>
                  {dish.badges.map(b => (
                    <span key={b} className={styles.badge}>
                      <span className={styles.badgeIcon}>●</span> {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className={styles.navAndCta}>
              <div className={styles.nav}>
                <button className={styles.navBtn} onClick={prev} aria-label="Previous">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIconPrev}>
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                </button>
                <span className={styles.navCount}>{current + 1} / {dishes.length}</span>
                <button className={styles.navBtn} onClick={next} aria-label="Next">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIconNext}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <Button variant="outlined" href="/menu">Full Menu</Button>
            </div>
          </div>

          {/* Right Column: Overlapping Image */}
          <div className={styles.rightCol}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={dish.id}
                className={styles.imageWrapper}
                initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
                animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
                exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={dish.img} alt={dish.name} className={styles.image} />
              </motion.div>
            </AnimatePresence>
            
            {/* Decorator Box overlapping */}
            <div className={styles.decoratorBox}>
              <p className={styles.decoratorText}>Hand-crafted daily.</p>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default SignatureMeals;
