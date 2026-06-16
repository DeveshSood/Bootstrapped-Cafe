import React from 'react';
import { Link } from 'react-router-dom';
import useSwipe from '../../hooks/useSwipe';
import styles from './HamburgerMenu.module.css';

/**
 * HamburgerMenu — Fullscreen mobile menu overlay
 * 
 * Features:
 * - Slides in from left with staggered link animations
 * - Closes on: backdrop tap, swipe left, or X button (handled by parent)
 * - Large Playfair Display nav links
 */
const HamburgerMenu = ({ isOpen, onClose }) => {
  const swipeHandlers = useSwipe({
    onSwipeLeft: onClose,
    threshold: 50,
  });

  const menuLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Workspace', path: '/#coworking' },
    { label: 'Our Story', path: '/#how-we-cook' },
    { label: 'Catering', path: '/#membership' },
    { label: 'Contact', path: '/#footer' },
  ];

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles['overlay--open'] : ''}`}
      {...swipeHandlers}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Dark backdrop — click to close */}
      <div 
        className={styles.backdrop} 
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Menu panel */}
      <div className={styles.menuPanel}>
        <nav className={styles.menuNav}>
          {menuLinks.map((link, index) => (
            <Link
              key={link.label}
              to={link.path}
              className={styles.menuLink}
              onClick={onClose}
              style={{ transitionDelay: isOpen ? `${100 + index * 50}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.menuFooter}>
          <div className={styles.menuFooterLabel}>Follow us</div>
          <div className={styles.menuSocials}>
            <a href="#" className={styles.menuSocialLink}>Instagram</a>
            <a href="#" className={styles.menuSocialLink}>Twitter</a>
            <a href="#" className={styles.menuSocialLink}>LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
