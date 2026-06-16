import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './ErrorPage.module.css';

/**
 * ErrorPage — Generic error display used by the ErrorBoundary.
 * Can also be rendered directly for server errors, 403, etc.
 */
const ErrorPage = ({
  statusCode,
  title = 'Something went wrong',
  message = "We're sorry — something unexpected happened. Our team has been notified and we're working on it.",
  error,
  showDetails = false,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getIcon = () => {
    if (statusCode === 403) return '🔒';
    if (statusCode === 500) return '⚙️';
    if (statusCode === 503) return '🔧';
    return '☕';
  };

  const getStatusLabel = () => {
    if (!statusCode) return 'Error';
    const labels = {
      400: 'Bad Request',
      403: 'Access Denied',
      500: 'Server Error',
      503: 'Service Unavailable',
    };
    return `Error ${statusCode} — ${labels[statusCode] || 'Something Went Wrong'}`;
  };

  return (
    <main className={styles.errorPage}>
      {/* Floating decorative elements */}
      <motion.div
        className={`${styles.floatingDecor} ${styles.decorOne}`}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`${styles.floatingDecor} ${styles.decorTwo}`}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className={styles.iconWrapper}>
            <span className={styles.icon}>{getIcon()}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className={styles.statusCode}>{getStatusLabel()}</p>
          <div className={styles.divider} />
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{message}</p>
        </motion.div>

        {/* Technical details toggle (dev mode) */}
        {showDetails && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              className={styles.detailsToggle}
              onClick={() => setDetailsOpen(!detailsOpen)}
            >
              {detailsOpen ? '▾ Hide Details' : '▸ Technical Details'}
            </button>
            {detailsOpen && (
              <motion.div
                className={styles.detailsPanel}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <pre className={styles.detailsText}>
                  {error.toString()}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </motion.div>
            )}
          </motion.div>
        )}

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            className={styles.primaryBtn}
            onClick={() => window.location.reload()}
          >
            ↻ Try Again
          </button>
          <Link to="/" className={styles.secondaryBtn}>
            ← Back to Home
          </Link>
        </motion.div>
      </div>
    </main>
  );
};

export default ErrorPage;
