import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.notFoundPage}>
      {/* Floating decorative elements */}
      <motion.div
        className={`${styles.floatingDecor} ${styles.decorOne}`}
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`${styles.floatingDecor} ${styles.decorTwo}`}
        animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`${styles.floatingDecor} ${styles.decorThree}`}
        animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.errorCode}>404</div>
        </motion.div>

        <motion.div
          className={styles.divider}
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className={styles.iconWrapper}>
            <span className={styles.icon}>🍽️</span>
          </div>

          <h1 className={styles.title}>Page Not Found</h1>
          <p className={styles.subtitle}>
            Looks like this dish isn't on our menu. The page you're looking for
            may have been moved, renamed, or is temporarily unavailable.
          </p>
        </motion.div>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/" className={styles.primaryBtn}>
            ← Back to Home
          </Link>
          <Link to="/menu" className={styles.secondaryBtn}>
            View Our Menu
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default NotFoundPage;
