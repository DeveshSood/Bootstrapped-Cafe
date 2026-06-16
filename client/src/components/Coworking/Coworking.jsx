import React from 'react';
import SectionHeading from '../common/SectionHeading';
import Button from '../common/Button';
import styles from './Coworking.module.css';

import cafeBg from '../../assets/images/cafe-bg.jpg';

const Coworking = () => {
  return (
    <section className={styles.coworking} id="coworking">
      <div className={styles.bentoGrid}>
        
        {/* Intro Block (Spans 2 columns) */}
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

        {/* Large Image Block */}
        <div className={styles.imageBlock}>
          <img 
            src={cafeBg} 
            alt="Coworking space" 
            className={styles.bentoImage} 
            loading="lazy" 
          />
        </div>
      </div>
    </section>
  );
};

export default Coworking;
