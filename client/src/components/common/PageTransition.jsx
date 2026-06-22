import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigationType } from 'react-router-dom';

const premiumVariants = {
  initial: {
    opacity: 0,
    y: 10,
    scale: 0.99,
    filter: 'blur(3px)',
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // Custom sleek ease-out
    },
    transitionEnd: {
      transform: 'none',
      filter: 'none',
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    filter: 'blur(3px)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Disable native browser scroll restoration to prevent conflicting jumps
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    let timer;
    if (navType === 'POP') {
      // Restore previous scroll position on Back/Forward navigation
      const savedY = sessionStorage.getItem(`scroll-${location.pathname}`);
      if (savedY !== null) {
        // Wait briefly for layout to render before restoring scroll
        timer = setTimeout(() => {
          window.scrollTo({ top: parseInt(savedY, 10), left: 0, behavior: 'instant' });
        }, 10);
      }
    } else {
      // Fresh navigation (PUSH or REPLACE) -> Start at top
      // Wait briefly for the new layout to render and prevent competing browser behavior
      timer = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }, 50);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [location.pathname, navType]);

  useEffect(() => {
    // Continuously save the scroll position for the current path
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
