import React, { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import ScrollReveal from '../common/ScrollReveal';
import styles from './Testimonials.module.css';

const testimonials = [
  { quote: '"The food is incredible and makes me feel so good every time."', name: 'Ananya R.', role: 'Student' },
  { quote: '"Finally a place that combines health, taste and beautiful ambience."', name: 'Karan S.', role: 'Startup Founder' },
  { quote: '"My go-to spot for clean, nourishing and delicious meals."', name: 'Megha V.', role: 'Fitness Coach' },
  { quote: '"The coworking pass is a game changer — healthy food and a calm workspace."', name: 'Arjun P.', role: 'Freelancer' },
  { quote: '"Our team lunch plans have transformed how we eat at the office."', name: 'Priya K.', role: 'HR Manager' },
];

const Testimonials = () => {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(testimonials.length / perPage);
  const visible = testimonials.slice(page * perPage, page * perPage + perPage);
  const gridRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPage(p => (p + 1) % totalPages);
    }, 6000);
    return () => clearInterval(timer);
  }, [totalPages]);

  // Animate cards in when page changes
  useEffect(() => {
    if (gridRef.current) {
      anime({
        targets: gridRef.current.querySelectorAll('[data-test-card]'),
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        duration: 600,
        easing: 'easeOutExpo',
        delay: anime.stagger(100),
      });
    }
  }, [page]);

  return (
    <section className={styles.testimonials} id="testimonials">
      <ScrollReveal animation="fadeUp" duration={800} threshold={0.15}>
        <div className={styles.testInner}>
          <div className={styles.testHeader}>
            <span className={styles.testLabel}>Loved by Many</span>
            <h3 className={styles.testHeading}>Kind Words</h3>
          </div>
          <div className={styles.testGrid} ref={gridRef}>
            {visible.map((t, i) => (
              <div key={`${t.name}-${page}`} className={styles.testCard} data-test-card>
                <div className={styles.testQuoteMark}>"</div>
                <p className={styles.testQuote}>{t.quote}</p>
                <div className={styles.testAuthor}>
                  <div className={styles.testAvatar}>{t.name.charAt(0)}</div>
                  <div>
                    <span className={styles.testName}>{t.name}</span>
                    <span className={styles.testRole}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.testNav}>
            <button className={styles.testNavBtn} onClick={() => setPage(p => (p > 0 ? p - 1 : totalPages - 1))} aria-label="Previous">←</button>
            <div className={styles.testDots}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`${styles.testDot} ${i === page ? styles['testDot--active'] : ''}`}
                  onClick={() => setPage(i)}
                  aria-label={`Page ${i + 1}`}
                />
              ))}
            </div>
            <button className={styles.testNavBtnNext} onClick={() => setPage(p => (p + 1) % totalPages)} aria-label="Next">→</button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default Testimonials;
