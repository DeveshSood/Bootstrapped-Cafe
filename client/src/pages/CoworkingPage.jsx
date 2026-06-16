import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import BookingPopup from '../components/Coworking/BookingPopup';
import Footer from '../components/Footer/Footer';
import CurvedDivider from '../components/common/CurvedDivider';
import styles from './CoworkingPage.module.css';

import cafeBg from '../assets/images/cafe-bg.jpg';
import heroBg2 from '../assets/images/hero-bg-2.jpg';
import heroBg3 from '../assets/images/hero-bg-3.jpg';

const cafePhotos = [
  cafeBg,
  heroBg2,
  heroBg3
];

const features = [
  { id: 'hotdesk', type: 'small', icon: '💻', title: 'Hot Desk', desc: 'Flexible seating with fast WiFi and calm ambience.', basePrice: 299 },
  { id: 'student', type: 'small', icon: '🎓', title: 'Student Pass', desc: 'All-day access with a healthy snack.', basePrice: 599 },
  { id: 'team', type: 'wide', icon: '🍱', title: 'Team Lunch Plan', desc: 'Customized healthy lunches for your team, delivered to your meeting room.', basePrice: 249 },
  { id: 'private', type: 'wide', icon: '🔇', title: 'Private Workspace', desc: 'Silent booths and private rooms for focused work or small meetings.', basePrice: 999 },
];

const CoworkingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleBookClick = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <>
      <div className={styles.floatingBack}>
        <Button variant="outlined" size="sm" href="/">← Go Back</Button>
      </div>

      <main className={styles.coworkingPage}>
        <div className={styles.topSectionContainer}>
          {/* Hero Section */}
          <section className={styles.heroSection}>
            <div className={styles.heroContent}>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.heroTitle}
              >
                Where healthy food meets <em>focused</em> work.
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={styles.heroDesc}
              >
                A premium coworking space designed for students, freelancers, and teams who value wellness as much as productivity.
              </motion.p>
              <motion.div 
                className={styles.heroCtas}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button variant="filled" size="lg" href="#pricing">View Subscriptions</Button>
              </motion.div>
            </div>
          </section>

          {/* Photo Gallery */}
          <section className={styles.gallerySection}>
            <div className={styles.galleryGrid}>
              {cafePhotos.map((photo, i) => (
                <motion.div 
                  key={i}
                  className={styles.galleryItem}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <img src={photo} alt={`Cafe workspace ${i + 1}`} loading="lazy" />
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Pricing / Booking Section */}
        <section className={styles.pricingSection} id="pricing">
          <SectionHeading
            label="Plans & Passes"
            heading="Choose your perfect workspace."
            align="center"
          />
          
          <div className={styles.bentoGrid}>
            {features.map((f) => (
              <motion.div 
                key={f.id}
                className={`${styles.bentoBlock} ${f.type === 'wide' ? styles.featureWide : styles.featureSmall}`}
              >
                <div className={styles.featureHeader}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <h5 className={styles.featureTitle}>{f.title}</h5>
                </div>
                <p className={styles.featureDesc}>{f.desc}</p>
                <div className={styles.featureFooter}>
                  <span className={styles.featurePrice}>₹{f.basePrice} <span>/ day</span></span>
                  <Button variant="filled" size="sm" onClick={() => handleBookClick(f)}>
                    Book Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <CurvedDivider topColor="var(--warm-cream)" bottomColor="var(--terracotta)" direction="down" />
      <Footer />

      {/* Unified Booking Popup */}
      <BookingPopup 
        isOpen={!!selectedPlan} 
        onClose={() => setSelectedPlan(null)} 
        defaultPlan={selectedPlan} 
      />
    </>
  );
};

export default CoworkingPage;
