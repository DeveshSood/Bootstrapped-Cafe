import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionHeading from '../components/common/SectionHeading';
import CurvedDivider from '../components/common/CurvedDivider';
import Footer from '../components/Footer/Footer';
import SlotCounter from '../components/common/SlotCounter';
import styles from './OurStoryPage.module.css';

import heroBg from '../assets/images/HERO BG 2.png';
import philosophyImg from '../assets/images/CAFE 1.png';

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
                Established in 2023, Bootstrapped Cafe started as a fast-casual chain of Mediterranean restaurants. We don't believe in compromises. 
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
              { icon: '🌿', title: 'Fresh & High-Quality', desc: 'Fresh, locally-sourced ingredients with zero preservatives.' },
              { icon: '💪', title: 'High-Protein & Balanced', desc: 'Customisable Mediterranean bowls with lean proteins and fibers.' },
              { icon: '🎯', title: 'Personalized Plans', desc: 'Provides personalized meal plans with 100% non-repetitive menus.' },
              { icon: '👨‍🍳', title: 'Experienced Experts', desc: 'Employs food experts offering daily fresh prepared items, no stocking.' },
              { icon: '✨', title: 'Quality & Satisfaction', desc: 'Quality and freshness guaranteed to ensure your complete satisfaction.' },
              { icon: '🏢', title: 'Perfect for Teams', desc: 'Ideal for office lunches, events, workshops, and corporate partnerships.' },
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

        <section className={styles.sustainabilitySection} id="impact">
          <SectionHeading 
            label="Our Impact"
            heading="Trusted by our community."
            italicWord="community"
            align="center"
          />
          <div className={styles.statsGrid}>
            <motion.div className={styles.statItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <SlotCounter value={2023} className={styles.statNumber} prefix="" />
              <span className={styles.statLabel}>Established</span>
            </motion.div>
            <motion.div className={styles.statItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <SlotCounter value={5000} className={styles.statNumber} prefix="+" />
              <span className={styles.statLabel}>Trusted Customers</span>
            </motion.div>
            <motion.div className={styles.statItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <SlotCounter value={100} className={styles.statNumber} prefix="" />
              <span className={styles.statLabel}>% Non-Repetitive Menus</span>
            </motion.div>
            <motion.div className={styles.statItem} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <span className={styles.statNumber}>Top</span>
              <span className={styles.statLabel}>Rated on Google</span>
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
