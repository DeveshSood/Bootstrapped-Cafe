import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import fishBowl from '../../assets/images/fish bowl 2.jpg';
import pestoChicken from '../../assets/images/pesto chicken bowl.jpg';
import paneerBowl from '../../assets/images/paneer bowl better.jpg';
import weightLossBowl from '../../assets/images/weight loss bolw.jpg';
import veganBowl from '../../assets/images/vegan bowl.jpg';
import styles from './SignatureMeals.module.css';

const dishes = [
  { id: 1, name: 'Desk Friendly Pesto Grilled Chicken Bowl', macros: '51-65g Protein · 120-140g Carbs · 30-40g Fat', desc: 'Pesto chicken, rice, cucumber, corn, black chana, hummus, zucchini, bellpeppers, tomato, lettuce, and rajma.', badges: ['HIGH PROTEIN', 'NON-VEG', 'FRESH DAILY'], img: pestoChicken },
  { id: 2, name: 'Weight Loss Bowl', macros: '37-47g Protein · 50-65g Carbs · 30-40g Fat', desc: 'Grilled paneer, egg, cucumber, corn, hummus, broccoli, bellpeppers, zucchini, moong salad, cheese, and lettuce.', badges: ['WEIGHT LOSS', 'HIGH VITAMIN C', 'LOW CARB'], img: weightLossBowl },
  { id: 3, name: 'Desk Friendly Grilled Paneer Bowl', macros: '43-55g Protein · 100-120g Carbs · 40-50g Fat', desc: 'Grilled paneer, silk tofu, cheese, black chana, chana & moong salad, hummus, rice, lettuce, bellpeppers, and peas.', badges: ['VEGETARIAN', 'HIGH PROTEIN', 'BALANCED'], img: paneerBowl },
  { id: 4, name: 'Desk Friendly Fish Bowl', macros: '45-57g Protein · 90-110g Carbs · 20-30g Fat', desc: 'Grilled fish, quinoa, rajma, avocado, mango salsa, pineapple, red cabbage, broccoli, zucchini, mushroom, and feta cheese.', badges: ['HIGH PROTEIN', 'OMEGA RICH', 'FRESH DAILY'], img: fishBowl },
  { id: 5, name: 'Vegan Bowl', macros: '22-28g Protein · 60-75g Carbs · 20-30g Fat', desc: 'Tofu, chickpea, pineapple salsa, moong salsa, corn salsa, avocado salsa, mango salsa, olives, pickled onion, and iceberg lettuce.', badges: ['VEGAN', 'PLANT BASED', 'FRESH DAILY'], img: veganBowl },
];

const SignatureMeals = () => {
  const [current, setCurrent] = useState(0);
  const dish = dishes[current];

  const prev = () => setCurrent(c => (c > 0 ? c - 1 : dishes.length - 1));
  const next = () => setCurrent(c => (c < dishes.length - 1 ? c + 1 : 0));

  return (
    <section className={styles.magazineSection} id="signature-meals">
      <div className={styles.container}>
        

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
