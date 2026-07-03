import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionHeading from '../components/common/SectionHeading';
import CurvedDivider from '../components/common/CurvedDivider';
import Footer from '../components/Footer/Footer';
import SlotCounter from '../components/common/SlotCounter';
import styles from './OurStoryPage.module.css';

import heroBg from '../assets/images/hero-bg-2.jpg';
import philosophyImg from '../assets/images/cafe-bg.jpg';

const OurStoryPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);

  return (
    <>
      <main className={styles.ourStoryPage}>
        <section className={styles.heroSection} ref={heroRef}>
          <motion.img 
            src={heroBg} 
            alt="Bootstrapped Cafe Kitchen" 
            className={styles.heroBg}
            style={{ y: heroY }}
          />
          <div className={styles.heroOverlay} />
          <motion.div 
            className={styles.heroContent}
            style={{ opacity: heroOpacity }}
          >
            <motion.h1 
              className={styles.heroTitle}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Food made with <em>intention</em>.
            </motion.h1>
          </motion.div>
        </section>

        <section className={styles.section} id="philosophy">
          <SectionHeading 
            label="Our Philosophy"
            heading="Nourishing the body and mind."
            italicWord="body"
          />
          <div className={styles.philosophyGrid}>
            <motion.div 
              className={styles.philosophyText}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <p>
                At Bootstrapped Cafe, we don't believe in compromises. 
                Fast food shouldn't mean sacrificing your health, and healthy food shouldn't mean sacrificing flavor.
              </p>
              <p>
                Our philosophy is simple: we source the highest quality, nutrient-dense ingredients 
                and transform them into meals that make you feel invincible. Whether you're a student 
                prepping for finals or a founder pushing through a launch, our food is designed to be 
                the premium fuel that keeps you running at your absolute best.
              </p>
            </motion.div>
            <motion.div 
              className={styles.philosophyImageWrapper}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <img src={philosophyImg} alt="Fresh ingredients" className={styles.philosophyImage} />
            </motion.div>
          </div>
        </section>

        <section className={styles.ingredientsSection} id="ingredients">
          <SectionHeading 
            label="Our Ingredients"
            heading="The building blocks of better living."
            italicWord="better"
            align="center"
          />
          <div className={styles.ingredientBento}>
            {[
              { icon: '🌱', title: '100% Organic Greens', desc: 'Sourced directly from local partner farms ensuring maximum crispness and zero pesticides.' },
              { icon: '🐟', title: 'Wild-Caught Proteins', desc: 'Sustainable, clean proteins that are never farmed and completely free of antibiotics.' },
              { icon: '🏺', title: 'Cold-Pressed Oils', desc: 'We cook exclusively with cold-pressed olive and avocado oils. No seed oils, ever.' },
              { icon: '🌾', title: 'Ancient Grains', desc: 'Quinoa, farro, and wild rice provide complex, slow-burning carbs for sustained energy.' },
              { icon: '🍋', title: 'House-made Dressings', desc: 'Crafted daily from scratch using fresh herbs, citrus, and raw honey.' },
              { icon: '🧊', title: 'Unprocessed', desc: 'If it comes in a box with ingredients you can\'t pronounce, it doesn\'t enter our kitchen.' },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                className={styles.bentoCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={styles.bentoIcon}>{item.icon}</div>
                <h4 className={styles.bentoTitle}>{item.title}</h4>
                <p className={styles.bentoDesc}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className={styles.sustainabilitySection} id="sustainability">
          <SectionHeading 
            label="Sustainability"
            heading="Taking care of our home."
            italicWord="home"
            align="center"
          />
          <div className={styles.statsGrid}>
            <motion.div className={styles.statItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SlotCounter value={0} className={styles.statNumber} prefix="" />
              <span className={styles.statLabel}>Single-Use Plastics</span>
            </motion.div>
            <motion.div className={styles.statItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <SlotCounter value={100} className={styles.statNumber} prefix="" />
              <span className={styles.statLabel}>% Compostable Packaging</span>
            </motion.div>
            <motion.div className={styles.statItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <SlotCounter value={85} className={styles.statNumber} prefix="" />
              <span className={styles.statLabel}>% Local Produce</span>
            </motion.div>
            <motion.div className={styles.statItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <SlotCounter value={120} className={styles.statNumber} prefix="+" />
              <span className={styles.statLabel}>Trees Planted Monthly</span>
            </motion.div>
          </div>
        </section>
      </main>
      <CurvedDivider topColor="var(--warm-cream)" bottomColor="var(--terracotta)" direction="down" />
      <Footer />
    </>
  );
};

export default OurStoryPage;
