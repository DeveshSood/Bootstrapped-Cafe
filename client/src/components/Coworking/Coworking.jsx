import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import styles from './Coworking.module.css';

import cafeBg from '../../assets/images/CAFE 1.png';
import cafe1 from '../../assets/images/CAFE 2.png';
import cafe2 from '../../assets/images/CAFE 3.png';
import cafe3 from '../../assets/images/CAFE 4.png';

const Coworking = () => {
  return (
    <section className={styles.coworking} id="coworking">
      <div className={styles.bentoGrid}>
        
        <div className={`${styles.bentoBlock} ${styles.introBlock}`}>
          <SectionHeading
            label="Work & Eat"
            heading="Where healthy food meets focused work."
            italicWord="focused"
            description="A coworking space designed for students, freelancers, and teams who value wellness as much as productivity."
            align="left"
          />
          <div className={styles.coworkingCtas}>
            <Button variant="filled" size="md" href="/coworking">Explore Workspaces</Button>
          </div>
        </div>

        <div className={styles.imageBlock}>
          <div className={styles.imageGrid}>
            <motion.div className={styles.gridItemContainer} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
              <img src={cafeBg} alt="Cafe workspace" className={styles.gridImage} loading="lazy" />
            </motion.div>
            <motion.div className={styles.gridItemContainer} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
              <img src={cafe1} alt="Cafe interior" className={styles.gridImage} loading="lazy" />
            </motion.div>
            <motion.div className={styles.gridItemContainer} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}>
              <img src={cafe2} alt="Cafe tables" className={styles.gridImage} loading="lazy" />
            </motion.div>
            <motion.div className={styles.gridItemContainer} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
              <img src={cafe3} alt="Cafe focus area" className={styles.gridImage} loading="lazy" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Coworking;
