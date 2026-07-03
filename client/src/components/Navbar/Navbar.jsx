import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import HamburgerMenu from './HamburgerMenu';
import UserMenu from './UserMenu';
import SlotCounter from '../common/SlotCounter';
import styles from './Navbar.module.css';

/**
 * Navbar — Responsive navigation bar.
 * Transitions from transparent (hero) to solid cream on scroll.
 */
const Navbar = ({ cartCount = 0, cartTotal = 0, onCartClick, isCartOpen = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroMode, setHeroMode] = useState('food');
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

  useEffect(() => {
    const handleHeroMode = (e) => setHeroMode(e.detail);
    window.addEventListener('heroModeChange', handleHeroMode);
    return () => window.removeEventListener('heroModeChange', handleHeroMode);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navLinks = [
    { label: 'Menu', path: '/menu' },
    { label: 'Coworking', path: '/coworking' },
  ];

  const rightLinks = [
    { label: 'Our Story', path: '/our-story' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
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

        <nav className={styles.navLeft}>
          <Link
            to="/menu"
            className={`${styles.navLink} ${isActive('/menu') ? styles['navLink--active'] : ''}`}
          >
            Menu
          </Link>
          <Link to="/menu" className={styles.navCta} id="nav-book-cta">
            Book a Table
          </Link>
          <Link
            to="/coworking"
            className={`${styles.navLink} ${isActive('/coworking') ? styles['navLink--active'] : ''}`}
          >
            Coworking
          </Link>
        </nav>

        <div className={styles.navCenter}>
          {location.pathname === '/' ? (
            <div className={styles.brandLogo} style={{ display: 'flex', alignItems: 'center', gap: '12px', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.1rem' }}>
              <span 
                onClick={() => window.dispatchEvent(new CustomEvent('setHeroMode', { detail: 'food' }))}
                style={{ cursor: 'pointer', transition: 'opacity 0.3s', opacity: heroMode === 'food' ? 1 : 0.4 }}
              >
                BOOTSTRAPPED CAFE
              </span>
              <span style={{ opacity: 0.2, fontWeight: '300' }}>|</span>
              <span 
                onClick={() => window.dispatchEvent(new CustomEvent('setHeroMode', { detail: 'coworking' }))}
                style={{ cursor: 'pointer', transition: 'opacity 0.3s', opacity: heroMode === 'coworking' ? 1 : 0.4 }}
              >
                COWORKING
              </span>
            </div>
          ) : (
            <Link to="/" className={styles.brandLogo} id="brand-logo">
              Bootstrapped Cafe
              <span className={styles.brandDivider} />
            </Link>
          )}
        </div>

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

      <HamburgerMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        isAuthenticated={isAuthenticated}
      />
    </>
  );
};

export default Navbar;
