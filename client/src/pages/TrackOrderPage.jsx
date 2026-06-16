import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiGetOrder } from '../utils/api';
import Footer from '../components/Footer/Footer';
import styles from './TrackOrderPage.module.css';

const STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📋', desc: 'Your order has been received' },
  { key: 'payment_confirmed', label: 'Confirmed', icon: '💳', desc: 'Payment successful, awaiting kitchen' },
  { key: 'accepted', label: 'Accepted', icon: '✅', desc: 'The kitchen has accepted your order' },
  { key: 'prepared', label: 'Prepared', icon: '👨‍🍳', desc: 'Your food is freshly prepared' },
  { key: 'packaged', label: 'Packaged', icon: '📦', desc: 'Packed and ready to go' },
  { key: 'out_for_delivery', label: 'On the Way', icon: '🚴', desc: 'Your rider is on the way' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', desc: 'Enjoy your healthy meal!' },
];

const WAIT_QUOTES = [
  'Good things come to those who eat well.',
  'Your body is a temple — we\'re catering the feast.',
  'Every healthy meal is a step toward a better you.',
  'Real food doesn\'t have ingredients. Real food IS ingredients.',
  'Cooking is love made visible — we\'re cooking with love.',
  'Patience is bitter, but its fruit is delicious.',
  'Health is not about the weight you lose, but about the life you gain.',
  'A recipe has no soul. You, as the cook, must bring soul to the recipe.',
];

const FUN_FACTS = [
  'Honey never spoils. Archaeologists found 3000-year-old edible honey in Egyptian tombs.',
  'Avocados are berries, but strawberries aren\'t.',
  'It takes about 50 licks to finish a single scoop of ice cream.',
  'Quinoa is technically a seed, not a grain. Surprise!',
  'Almonds are members of the peach family.',
  'Eating an apple is more effective at waking you up than coffee.',
];

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [factIndex, setFactIndex] = useState(0);
  const sseRef = useRef(null);

  // Load order
  useEffect(() => {
    apiGetOrder(orderId)
      .then(data => { setOrder(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [orderId]);

  // SSE for live updates
  useEffect(() => {
    if (!orderId) return;

    const source = new EventSource(`/api/orders/${orderId}/stream`);
    sseRef.current = source;

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'status_update') {
          setOrder(prev => prev ? {
            ...prev,
            status: data.status,
            statusHistory: data.statusHistory || prev.statusHistory,
          } : prev);
        }
      } catch (_) {}
    };

    source.onerror = () => {
      // SSE will auto-reconnect
    };

    return () => {
      source.close();
    };
  }, [orderId]);

  // Cycle wait quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % WAIT_QUOTES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cycle fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex(prev => (prev + 1) % FUN_FACTS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <main className={styles.trackPage}>
        <div className={styles.loadingState}>
          <div className={styles.loadingDots}>
            <span /><span /><span />
          </div>
          <p>Loading your order...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className={styles.trackPage}>
        <div className={styles.errorState}>
          <h3>Order not found</h3>
          <p>{error || 'This order may have been removed.'}</p>
          <Link to="/profile?tab=orders" className={styles.backBtn}>
            <span className={styles.backBtnIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </span>
            <span className={styles.backBtnText}>Back to Orders</span>
          </Link>
        </div>
      </main>
    );
  }

  const currentStepIndex = STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';
  const isWaiting = !isCancelled && !isDelivered;

  return (
    <>
      <main className={styles.trackPage}>
        <div className={styles.trackHeader}>
          <Link to="/profile?tab=orders" className={styles.backBtn}>
            <span className={styles.backBtnIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </span>
            <span className={styles.backBtnText}>Back to Orders</span>
          </Link>
          <h2 className={styles.trackTitle}>Track Your Order</h2>
          <span className={styles.trackOrderId}>
            {order.orderNumber || `ORD-${order._id.slice(-6).toUpperCase()}`}
          </span>
        </div>

        {!isCancelled && (
          <div className={styles.stepper}>
            {STEPS.map((step, i) => {
              const completed = i <= currentStepIndex;
              const active = i === currentStepIndex;
              return (
                <div key={step.key} className={styles.stepWrapper}>
                  <motion.div
                    className={`${styles.step} ${completed ? styles.stepCompleted : ''} ${active ? styles.stepActive : ''}`}
                    initial={false}
                    animate={{
                      scale: active ? 1.15 : 1,
                      transition: { type: 'spring', stiffness: 400, damping: 20 },
                    }}
                  >
                    <span 
                      className={styles.stepIcon}
                      style={step.key === 'payment_confirmed' ? { display: 'inline-block', transform: 'translateY(-3px)' } : {}}
                    >
                      {step.icon}
                    </span>
                    {completed && !active && (
                      <motion.span
                        className={styles.checkmark}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15, delay: 0.1 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.div>
                  <span className={`${styles.stepLabel} ${completed ? styles.stepLabelCompleted : ''}`}>
                    {step.label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className={styles.stepConnector}>
                      <motion.div
                        className={styles.stepConnectorFill}
                        initial={false}
                        animate={{ scaleX: currentStepIndex > i ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* --- Abstract Order Details --- */}
        {(() => {
          const OrderDetailsCard = () => (
            <div className={styles.orderDetails}>
              <h4 className={styles.detailsTitle}>Order Details</h4>
              <div className={styles.detailsItems}>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.detailItem}>
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className={styles.detailsTotal}>
                <span>Total</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          );

          if (isDelivered) {
            return (
              <div className={styles.deliveredLayout}>
                <motion.div
                  className={styles.deliveredBanner}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className={styles.deliveredBannerContent}>
                    <span className={styles.deliveredIcon}>🎉</span>
                    <div>
                      <h3>Order Delivered!</h3>
                      <p>Enjoy your healthy meal. We hope to see you again soon.</p>
                    </div>
                  </div>
                  <Link to="/menu" className={styles.reorderBtn}>Order Again</Link>
                </motion.div>
                
                <div className={styles.deliveredDetailsWrapper}>
                  <OrderDetailsCard />
                </div>
              </div>
            );
          }

          return (
            <div className={styles.contentGrid}>
              {/* Left Column: Status & Waiting Content */}
              <div className={styles.mainCol}>
                {isCancelled ? (
                  <motion.div
                    className={styles.cancelledBanner}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <span className={styles.cancelledIcon}>✕</span>
                    <h3>Order Cancelled</h3>
                    {order.cancelRequest?.reason && (
                      <p>Reason: {order.cancelRequest.reason}</p>
                    )}
                  </motion.div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={order.status}
                      className={styles.currentStatus}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className={styles.currentIcon}>{STEPS[currentStepIndex]?.icon}</span>
                      <p className={styles.currentDesc}>{STEPS[currentStepIndex]?.desc}</p>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Right Column: Order Details */}
              <div className={styles.sideCol}>
                <OrderDetailsCard />
              </div>
            </div>
          );
        })()}

        {isWaiting && (
          <div className={styles.waitSectionRow}>
            <div className={styles.animatedPlate}>
              <div className={styles.plate}>
                <div className={styles.steamLine} style={{ '--delay': '0s', '--x': '-6px' }} />
                <div className={styles.steamLine} style={{ '--delay': '0.4s', '--x': '0px' }} />
                <div className={styles.steamLine} style={{ '--delay': '0.8s', '--x': '6px' }} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                className={styles.waitQuote}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                "{WAIT_QUOTES[quoteIndex]}"
              </motion.p>
            </AnimatePresence>

            <div className={styles.funFact}>
              <span className={styles.funFactLabel}>Did you know?</span>
              <AnimatePresence mode="wait">
                <motion.p
                  key={factIndex}
                  className={styles.funFactText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {FUN_FACTS[factIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default TrackOrderPage;
