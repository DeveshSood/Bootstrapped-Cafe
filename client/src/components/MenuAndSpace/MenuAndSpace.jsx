import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import styles from './MenuAndSpace.module.css';

// Menu page images
import page1 from '../../assets/images/menu-pages/page-1.jpg';

// Cafe images
import cafeBg from '../../assets/images/CAFE 1.png';
import cafe1 from '../../assets/images/CAFE 2.png';
import cafe2 from '../../assets/images/CAFE 3.png';

// Food images
import meal2 from '../../assets/images/paneer bowl better.jpg';
import meal3 from '../../assets/images/pesto chicken bowl.jpg';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

const MenuAndSpace = () => {
  return (
    <section className={styles.section} id="menu-and-space">
      <div className={styles.contentWrap}>
        <div className={styles.splitLayout}>

          {/* ---- Left Column: Food ---- */}
          <div className={styles.column}>
            {/* Food Card */}
            <motion.div className={`${styles.card} ${styles.cardFood}`} {...fade(0)}>
              <div className={styles.cardIcon}>🥗</div>
              <span className={styles.label}>Healthy Food</span>
              <h3 className={styles.cardTitle}>
                Nourishment in <em>every</em> bite.
              </h3>
              <p className={styles.cardDesc}>
                Organic ingredients, balanced macros, and chef-crafted bowls designed to fuel your body and mind — not just fill your stomach.
              </p>
              <div className={styles.statRow}>
                <div className={styles.stat}>
                  <span className={styles.statNum}>15+</span>
                  <span className={styles.statLabel}>Bowls</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>6</span>
                  <span className={styles.statLabel}>Smoothies</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statNum}>100%</span>
                  <span className={styles.statLabel}>Fresh</span>
                </div>
              </div>
              <Button variant="filled" size="sm" href="/menu">View Full Menu</Button>
            </motion.div>

            {/* Food Photos */}
            <motion.div className={styles.photoGrid} {...fade(0.15)}>
              <div className={`${styles.photoWrapper} ${styles.photoLarge}`}>
                <img src={meal3} alt="Pesto Chicken Bowl" loading="lazy" />
              </div>
              <div className={styles.photoWrapper}>
                <img src={page1} alt="Our Menu" loading="lazy" />
              </div>
              <div className={styles.photoWrapper}>
                <img src={meal2} alt="Paneer Bowl" loading="lazy" />
              </div>
            </motion.div>
          </div>

          {/* ---- Right Column: Coworking ---- */}
          <div className={styles.column}>
            {/* Coworking Photos */}
            <motion.div className={styles.photoGrid} {...fade(0.2)}>
              <div className={`${styles.photoWrapper} ${styles.photoLarge}`}>
                <img src={cafeBg} alt="Bootstrapped Cafe" loading="lazy" />
              </div>
              <div className={styles.photoWrapper}>
                <img src={cafe1} alt="Cafe interior" loading="lazy" />
              </div>
              <div className={styles.photoWrapper}>
                <img src={cafe2} alt="Cafe seating" loading="lazy" />
              </div>
            </motion.div>

            {/* Coworking Card */}
            <motion.div className={`${styles.card} ${styles.cardCowork}`} {...fade(0.35)}>
              <div className={styles.cardIcon}>💻</div>
              <span className={styles.label}>Coworking</span>
              <h3 className={styles.cardTitle}>
                Where <em>focused</em> work happens.
              </h3>
              <p className={styles.cardDesc}>
                High-speed WiFi, ergonomic seating, and a curated environment for students, freelancers, and teams.
              </p>
              <Button variant="outlined" size="sm" href="/coworking">Explore Workspaces</Button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MenuAndSpace;
