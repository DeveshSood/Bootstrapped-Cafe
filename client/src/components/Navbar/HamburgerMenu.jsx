import React from 'react';
import { Link } from 'react-router-dom';
import useSwipe from '../../hooks/useSwipe';
import { useAuth } from '../../context/AuthContext';
import styles from './HamburgerMenu.module.css';

/**
 * HamburgerMenu — Fullscreen mobile menu overlay
 * 
 * Features:
 * - Slides in from left with staggered link animations
 * - Closes on: backdrop tap, swipe left, or X button (handled by parent)
 * - Large Playfair Display nav links
 */
const HamburgerMenu = ({ isOpen, onClose, isAuthenticated }) => {
  const { user, logout } = useAuth();
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
        {isAuthenticated && user && (
          <div className={`${styles.mobileProfileHeader} ${isOpen ? styles.fadeIn : ''}`}>
            <Link to="/profile" className={styles.mobileProfileTop} onClick={onClose}>
              <div className={styles.mobileAvatar}>{user.name?.charAt(0) || 'U'}</div>
              <div className={styles.mobileUserInfo}>
                <span className={styles.mobileUserName}>{user.name || 'User'}</span>
                <span className={styles.mobileUserEmail}>{user.email}</span>
              </div>
            </Link>
          </div>
        )}

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
          {isAuthenticated && (
            <Link 
              to="/profile?tab=addresses" 
              className={styles.menuLink} 
              onClick={onClose}
              style={{ transitionDelay: isOpen ? `${100 + menuLinks.length * 50}ms` : '0ms' }}
            >
              Manage Addresses
            </Link>
          )}
        </nav>

        {isAuthenticated && (
          <div className={`${styles.mobileOrderHistory} ${isOpen ? styles.fadeInDelay : ''}`}>
            <Link to="/profile?tab=orders" className={styles.menuLinkSecondary} onClick={onClose}>Order History</Link>
            <Link to="/profile?tab=subscriptions" className={styles.menuLinkSecondary} onClick={onClose}>My Subscriptions</Link>
            <button className={styles.mobileLogoutBtn} onClick={() => { logout(); onClose(); }}>Sign Out</button>
          </div>
        )}

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
