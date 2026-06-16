import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../common/Button';
import SectionHeading from '../common/SectionHeading';
import styles from './MenuPreview.module.css';

import page1 from '../../assets/images/menu-pages/page-1.jpg';
import page2 from '../../assets/images/menu-pages/page-2.jpg';
import page3 from '../../assets/images/menu-pages/page-3.jpg';

// Reusable component for image with inner parallax
const ParallaxImage = ({ src, alt, className, speed = 0.2 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // The image translates internally opposite to the scroll
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div className={`${styles.parallaxImgContainer} ${className}`} ref={ref}>
      <motion.img 
        src={src} 
        alt={alt} 
        className={styles.parallaxImg}
        style={{ y, scale: 1.2 }} // scale up slightly to allow room for parallax movement
        loading="lazy"
      />
    </div>
  );
};

const MenuPreview = () => {
  return (
    <section className={styles.menuPreview} id="menu">
      <div className={styles.container}>
        
        {/* Left: Content */}
        <div className={styles.content}>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionHeading 
              label="Our Menu" 
              heading="Nourishment in every bite."
              italicWord="every"
              align="left"
            />
          </motion.div>
          
          <motion.blockquote 
            className={styles.quote}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            "We believe that healthy food shouldn't be a compromise. Our menu is crafted to fuel your focus, featuring organic ingredients, balanced nutrition, and fresh flavors everyday."
          </motion.blockquote>
          
          <motion.div 
            className={styles.ctaWrapper}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Button variant="filled" size="lg" href="/menu">
              View Full Menu
            </Button>
            <span className={styles.ctaNote}>Hand-crafted daily in our kitchen</span>
          </motion.div>
        </div>

        {/* Right: Editorial Staggered Layout */}
        <div className={styles.editorialGrid}>
          <ParallaxImage src={page1} alt="Menu item 1" className={styles.imgLeft} speed={0.15} />
          <ParallaxImage src={page2} alt="Menu item 2" className={styles.imgCenter} speed={0.25} />
          <ParallaxImage src={page3} alt="Menu item 3" className={styles.imgRight} speed={0.2} />
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
