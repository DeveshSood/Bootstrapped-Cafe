import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import ScrollReveal from '../common/ScrollReveal';
import CurvedDivider from '../common/CurvedDivider';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import styles from './HowWeCook.module.css';

const features = [
  { icon: '🌿', title: 'Sourced Responsibly', desc: 'We work with local farmers and ethical suppliers who care for our planet.' },
  { icon: '⚖️', title: 'Nutritionally Balanced', desc: 'Every dish is designed to nourish your body and mind.' },
  { icon: '🗓️', title: 'Seasonal Ingredients', desc: "We celebrate nature's finest, handpicked each season." },
  { icon: '♻️', title: 'Zero Waste Philosophy', desc: 'We minimize waste and make mindful choices every day.' },
];

const HowWeCook = () => {
  const cardsRef = useRef(null);
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  // Anime.js stagger reveal for green cards
  useEffect(() => {
    if (isVisible && cardsRef.current) {
      anime({
        targets: cardsRef.current.querySelectorAll('[data-green-card]'),
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.9, 1],
        duration: 900,
        easing: 'easeOutExpo',
        delay: anime.stagger(120, { start: 200 }),
      });
    }
  }, [isVisible]);

  return (
    <>
      {/* Part A: Forest Green Feature Cards */}
      <section className={styles.greenSection} id="how-we-cook" ref={sectionRef}>
        <div className={styles.greenGrid} ref={cardsRef}>
          {features.map((f, i) => (
            <div key={f.title} className={styles.greenCard} data-green-card>
              <span className={styles.greenIcon}>{f.icon}</span>
              <h5 className={styles.greenTitle}>{f.title}</h5>
              <p className={styles.greenDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <CurvedDivider topColor="var(--forest-green)" bottomColor="var(--warm-cream)" direction="down" />

      {/* Part B: Ingredient Story */}
      <section className={styles.storySection}>
        <ScrollReveal animation="fadeUp" duration={800} threshold={0.3}>
          <div className={styles.storyInner}>
            <div className={styles.storyLeft}>
              <span className={styles.storyLabel}>Our Ingredient Story</span>
              <h3 className={styles.storyHeading}>
                From nature<br />to your plate.
              </h3>
            </div>
            <div className={styles.storyRight}>
              <p className={styles.storyBody}>
                We believe real food starts with real ingredients. That's why we know our farmers, visit our sources, and build relationships that last.
              </p>
              <a href="#" className={styles.storyLink}>
                Learn More →
              </a>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
};

export default HowWeCook;
