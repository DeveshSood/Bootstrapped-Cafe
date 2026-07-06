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
  { id: 'focus_pod', type: 'small', icon: '💻', title: 'Focus Pod', desc: 'Ideal for individual deep work and privacy. Includes complimentary beverage & high-speed connectivity.', basePrice: 100, suffix: '/ hr' },
  { id: 'meeting_pod', type: 'small', icon: '🤝', title: 'Meeting Pod', desc: 'Perfect for collaborative sessions and team calls. Includes complimentary beverage & ergonomic design.', basePrice: 300, suffix: '/ hr' },
  { id: 'regular_sub', type: 'wide', icon: '🥗', title: 'Monthly Regular Bowl Subscription', desc: '20 Bowls Subscription. Duration 20 days with 3 days carried forward. Enjoy our healthy Regular Bowl (₹295 value) daily.', basePrice: 5040, suffix: '/ mo' },
  { id: 'super_sub', type: 'wide', icon: '🌟', title: 'Super Bowl Monthly Promo', desc: 'Special 20 Bowls Subscription! Get the ₹350 Super Bowl for ₹300 (~15% OFF). Zero processing & additives. 3 days carried forward.', basePrice: 6000, suffix: '/ mo' },
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
                <ul className={styles.featureList}>
                  {f.desc.split('.').map(s => s.trim()).filter(Boolean).map((sentence, idx) => (
                    <li key={idx} className={styles.featureDesc}>{sentence}.</li>
                  ))}
                </ul>
                <div className={styles.featureFooter}>
                  <span className={styles.featurePrice}>₹{f.basePrice} <span>{f.suffix || '/ day'}</span></span>
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
