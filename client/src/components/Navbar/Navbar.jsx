import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import HamburgerMenu from './HamburgerMenu';
import UserMenu from './UserMenu';
import SlotCounter from '../common/SlotCounter';
import styles from './Navbar.module.css';

/**
 * Navbar — SAVORA-style responsive navigation
 * 
 * Desktop: Left links | Center brand | Right CTA + Cart + Auth
 * Mobile: Hamburger (2-line) | Brand | Cart + Auth
 * 
 * Transitions from transparent (on hero) to solid cream on scroll.
 */
const Navbar = ({ cartCount = 0, cartTotal = 0, onCartClick, isCartOpen = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setIsScrolled(window.scrollY > 80);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Menu', path: '/#menu' },
    { label: 'Our Story', path: '/#how-we-cook' },
    { label: 'Journal', path: '/#testimonials' },
  ];

  const rightLinks = [
    { label: 'Subscription', path: '/#membership' },
    { label: 'Contact', path: '/#footer' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`${styles.navbar} ${
          isScrolled || menuOpen || location.pathname !== '/' ? styles['navbar--solid'] : styles['navbar--transparent']
        } ${isCartOpen ? styles['navbar--cart-open'] : ''}`}
        id="main-navbar"
      >
        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburgerButton} ${menuOpen ? styles['hamburgerButton--open'] : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          id="hamburger-toggle"
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>

        {/* Left: Desktop Nav Links */}
        <nav className={styles.navLeft}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`${styles.navLink} ${isActive(link.path) ? styles['navLink--active'] : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center: Brand */}
        <div className={styles.navCenter}>
          <Link to="/" className={styles.brandLogo} id="brand-logo">
            Bootstrapped Cafe
            <span className={styles.brandDivider} />
          </Link>
        </div>

        {/* Right: Links + CTA + Cart + Auth */}
        <div className={styles.navRight}>
          {rightLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={styles.navLink}
            >
              {link.label}
            </Link>
          ))}

          <Link to="/menu" className={styles.navCta} id="nav-book-cta">
            Book a Table
          </Link>

          {/* Auth: Login button or UserMenu */}
          {isAuthenticated ? (
            <div className={styles.desktopUserMenu}>
              <UserMenu />
            </div>
          ) : (
            <Link to="/login" className={styles.loginBtn} id="login-button">
              <span className={styles.loginBtnText}>Sign In</span>
              <svg className={styles.loginBtnIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}

          {/* Cart Icon / Close Cart Button */}
          <button
            className={`${styles.cartButton} ${!isAuthenticated ? styles.cartButtonHiddenMobile : ''}`}
            onClick={onCartClick}
            aria-label={isCartOpen ? "Close cart" : `Shopping cart with ${cartCount} items`}
            id="cart-button"
          >
            <div className={styles.cartIconWrapper}>
              <AnimatePresence mode="wait">
                {isCartOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                    width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cartIcon}
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="bag"
                    initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.5, opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.15 }}
                    className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </motion.svg>
                )}
              </AnimatePresence>
              
              {!isCartOpen && cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </div>
            {cartCount > 0 && (
              <SlotCounter value={cartTotal} className={styles.cartTotalLabel} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <HamburgerMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        isAuthenticated={isAuthenticated}
      />
    </>
  );
};

export default Navbar;
