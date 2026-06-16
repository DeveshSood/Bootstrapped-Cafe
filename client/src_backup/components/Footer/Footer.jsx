import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import Button from '../common/Button';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import styles from './Footer.module.css';

const Footer = () => {
  const ctaRef = useRef(null);
  const [sectionRef, isVisible] = useIntersectionObserver({ threshold: 0.3 });

  // Animate CTA banner when scrolled into view
  useEffect(() => {
    if (isVisible && ctaRef.current) {
      anime.timeline({ easing: 'easeOutExpo' })
        .add({
          targets: ctaRef.current.querySelectorAll('[data-cta-animate]'),
          opacity: [0, 1],
          translateY: [40, 0],
          duration: 1000,
          delay: anime.stagger(150),
        });
    }
  }, [isVisible]);

  return (
    <>
      {/* CTA Banner */}
      <section className={styles.ctaBanner} ref={sectionRef}>
        <div className={styles.ctaGradientOverlay} />
        <div className={styles.ctaInner} ref={ctaRef}>
          <div className={styles.ctaLeaf} aria-hidden="true">🌿</div>
          <h3 className={styles.ctaHeading} data-cta-animate>
            Eat better. Feel better. Live intentionally.
          </h3>
          <p className={styles.ctaBody} data-cta-animate>
            Join us on a journey to nourish your body, mind and the planet.
          </p>
          <div className={styles.ctaButtons} data-cta-animate>
            <Button variant="outlined-light" size="md">Book a Table</Button>
            <Button variant="outlined-light" size="md" href="/menu">Explore Menu</Button>
          </div>
          <div className={styles.ctaLeafRight} aria-hidden="true">🍃</div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer} id="footer">
        <div className={styles.footerInner}>
          {/* Brand */}
          <div className={styles.footerBrand}>
            <h4 className={styles.footerLogo}>Bootstrap Cafe</h4>
            <div className={styles.footerSocials}>
              {['Instagram', 'Facebook', 'Twitter', 'YouTube', 'Pinterest'].map(s => (
                <a key={s} href="#" className={styles.footerSocialLink} aria-label={s}>
                  {s.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className={styles.footerCol}>
            <h6 className={styles.footerColTitle}>Menu</h6>
            {['All Dishes', 'Bowls', 'Salads', 'Drinks', 'Desserts'].map(l => (
              <a key={l} href="/menu" className={styles.footerLink}>{l}</a>
            ))}
          </div>

          <div className={styles.footerCol}>
            <h6 className={styles.footerColTitle}>Our Story</h6>
            {['Our Philosophy', 'Our Ingredients', 'Sustainability', 'Journal'].map(l => (
              <a key={l} href="#" className={styles.footerLink}>{l}</a>
            ))}
          </div>

          <div className={styles.footerCol}>
            <h6 className={styles.footerColTitle}>Info</h6>
            {['Book a Table', 'Catering', 'Careers', 'Contact Us'].map(l => (
              <a key={l} href="#" className={styles.footerLink}>{l}</a>
            ))}
          </div>

          <div className={styles.footerCol}>
            <h6 className={styles.footerColTitle}>Stay Connected</h6>
            <p className={styles.footerNewsDesc}>
              Be the first to know about new menus, events and offers.
            </p>
            <div className={styles.newsletterInput}>
              <input type="email" placeholder="Your email address" className={styles.emailInput} />
              <button className={styles.emailSubmit} aria-label="Subscribe">→</button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <span>© 2026 Bootstrap Cafe. All rights reserved.</span>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy Policy</a>
            <span>|</span>
            <a href="#">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
