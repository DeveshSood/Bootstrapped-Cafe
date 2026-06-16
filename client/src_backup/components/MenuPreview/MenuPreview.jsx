import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import Button from '../common/Button';
import SectionHeading from '../common/SectionHeading';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import styles from './MenuPreview.module.css';

import page1 from '../../assets/images/menu-pages/page-1.jpg';
import page2 from '../../assets/images/menu-pages/page-2.jpg';
import page3 from '../../assets/images/menu-pages/page-3.jpg';

const MenuPreview = () => {
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.3 });
  const contentRef = useRef(null);
  const imagesRef = useRef(null);

  useEffect(() => {
    if (isVisible && contentRef.current && imagesRef.current) {
      // Animate text content
      anime.timeline({ easing: 'easeOutExpo' })
        .add({
          targets: contentRef.current.querySelectorAll('[data-animate]'),
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 1000,
          delay: anime.stagger(150),
        });

      // Animate preview images
      anime.timeline({ easing: 'easeOutExpo' })
        .add({
          targets: imagesRef.current.children,
          opacity: [0, 1],
          translateX: [50, 0],
          rotate: (el, i) => {
            const rotations = [-5, 0, 5];
            return [rotations[i] + 10, rotations[i]];
          },
          duration: 1200,
          delay: anime.stagger(200, { start: 400 }),
        });
    }
  }, [isVisible]);

  return (
    <section className={styles.menuPreview} id="menu" ref={sectionRef}>
      <div className={styles.container}>
        {/* Left: Content & Quote */}
        <div className={styles.content} ref={contentRef}>
          <div data-animate>
            <SectionHeading 
              label="Our Menu" 
              heading="Nourishment in every bite."
              italicWord="every"
              align="left"
            />
          </div>
          
          <blockquote className={styles.quote} data-animate>
            "We believe that healthy food shouldn't be a compromise. Our menu is crafted to fuel your focus, featuring organic ingredients, balanced nutrition, and fresh flavors everyday."
          </blockquote>
          
          <div className={styles.ctaWrapper} data-animate>
            <Button variant="filled" size="lg" href="/menu">
              View Full Menu
            </Button>
            <span className={styles.ctaNote}>Hand-crafted daily in our kitchen</span>
          </div>
        </div>

        {/* Right: Images Collage */}
        <div className={styles.imagesCollage} ref={imagesRef}>
          <div className={`${styles.imageWrapper} ${styles.image1}`}>
            <img src={page1} alt="Menu preview 1" className={styles.image} loading="lazy" />
          </div>
          <div className={`${styles.imageWrapper} ${styles.image2}`}>
            <img src={page2} alt="Menu preview 2" className={styles.image} loading="lazy" />
          </div>
          <div className={`${styles.imageWrapper} ${styles.image3}`}>
            <img src={page3} alt="Menu preview 3" className={styles.image} loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
