import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import SlotCounter from '../common/SlotCounter';
import styles from './Navbar.module.css';

/**
 * Navbar — SAVORA-style responsive navigation
 * 
 * Desktop: Left links | Center brand | Right CTA + Cart
 * Mobile: Hamburger (2-line) | Brand | Cart
 * 
 * Transitions from transparent (on hero) to solid cream on scroll.
 */
const Navbar = ({ cartCount = 0, cartTotal = 0, onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
    { label: 'Menu', path: '/menu' },
    { label: 'Our Story', path: '/#how-we-cook' },
    { label: 'Journal', path: '/#testimonials' },
  ];

  const rightLinks = [
    { label: 'Catering', path: '/#membership' },
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
          isScrolled || menuOpen ? styles['navbar--solid'] : styles['navbar--transparent']
        }`}
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
            Bootstrap Cafe
            <span className={styles.brandDivider} />
          </Link>
        </div>

        {/* Right: Links + CTA + Cart */}
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

          {/* Cart Icon */}
          <button
            className={styles.cartButton}
            onClick={onCartClick}
            aria-label={`Shopping cart with ${cartCount} items`}
            id="cart-button"
          >
            <svg className={styles.cartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
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
      />
    </>
  );
};

export default Navbar;
