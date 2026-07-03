import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigationType } from 'react-router-dom';

const premiumVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.99,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
    transitionEnd: {
      transform: 'none',
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * PageTransition — Wraps pages with framer-motion enter/exit animations.
 * Manages scroll position: restores on back/forward, resets on fresh navigation.
 */
const PageTransition = ({ children }) => {
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (navType === 'POP') {
      const savedY = sessionStorage.getItem(`scroll-${location.pathname}`);
      if (savedY !== null) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: parseInt(savedY, 10), left: 0, behavior: 'instant' });
        });
      }
    } else {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    }
  }, [location.pathname, navType]);

  /* Continuously save scroll position for the current path */
  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [location.pathname]);

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={premiumVariants}
      style={{ width: '100%', minHeight: '100vh', transformOrigin: 'top center' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
