import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import Button from '../common/Button';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import styles from './Footer.module.css';

const socialIcons = {
  Instagram: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  Facebook: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>,
  Twitter: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>,
  YouTube: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>,
  Pinterest: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.25 2.65 7.9 6.44 9.38-.08-.79-.15-2 .03-2.87.16-.78 1.05-4.45 1.05-4.45s-.27-.54-.27-1.34c0-1.25.73-2.18 1.63-2.18.77 0 1.14.58 1.14 1.27 0 .77-.49 1.93-.75 3-.21.9.45 1.63 1.34 1.63 1.61 0 2.85-1.7 2.85-4.15 0-2.17-1.56-3.69-3.8-3.69-2.58 0-4.1 1.93-4.1 3.93 0 .77.3 1.6.67 2.05.07.08.08.16.06.24-.07.28-.22.88-.25 1.01-.04.16-.13.2-.29.13-1.1-.51-1.78-2.11-1.78-3.39 0-2.76 2-5.3 5.79-5.3 3.05 0 5.42 2.17 5.42 5.06 0 3.03-1.9 5.46-4.55 5.46-1.12 0-2.18-.58-2.54-1.27l-.69 2.63c-.25.96-.93 2.16-1.38 2.89 1.12.35 2.31.54 3.54.54 5.52 0 10-4.48 10-10S17.52 2 12 2z"></path></svg>
};

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
          <div className={styles.brand}>
            <h4 className={styles.footerLogo}>Bootstrapped Cafe</h4>
            <div className={styles.footerLogoLine} />
            <div className={styles.footerSocials}>
              {['Instagram', 'Facebook', 'Twitter', 'YouTube', 'Pinterest'].map(s => (
                <a key={s} href="#" className={styles.footerSocialLink} aria-label={s}>
                  {socialIcons[s]}
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
              <button className={styles.emailSubmit} aria-label="Subscribe">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIconNext}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.footerBottom}>
          <span>© 2026 Bootstrapped Cafe. Developed by Team Phoenix (+91 8580480030).</span>
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
