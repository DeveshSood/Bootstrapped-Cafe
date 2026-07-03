import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { apiGetUserOrders } from '../../utils/api';
import styles from './ActiveOrderWidget.module.css';

const STATUS_LABELS = {
  pending: 'Order Pending',
  payment_confirmed: 'Payment Confirmed',
  accepted: 'Order Accepted',
  prepared: 'Prepared',
  packaged: 'Packaged',
  assigned_to_partner: 'Assigned',
  handed_to_partner: 'Picked Up',
  cancelled: 'Cancelled',
};

const EMOJIS = {
  pending: '📋',
  payment_confirmed: '💳',
  accepted: '✅',
  prepared: '👨‍🍳',
  packaged: '📦',
  assigned_to_partner: '🚴',
  handed_to_partner: '🏃',
  cancelled: '❌',
};

/**
 * ActiveOrderWidget — Floating widget that tracks the user's most recent active order.
 * Uses polling + SSE for real-time status updates.
 */
const ActiveOrderWidget = () => {
  const { isAuthenticated, token } = useAuth();
  const [activeOrder, setActiveOrder] = useState(null);
  const [deliveredTimeout, setDeliveredTimeout] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setActiveOrder(null);
      return;
    }

    const fetchOrders = async () => {
      try {
        const orders = await apiGetUserOrders(token);
        if (!orders || orders.length === 0) return;

        const active = orders.filter(
          (o) => o.status !== 'handed_to_partner' && o.status !== 'cancelled'
        );

        const latestOrder = active.length > 0 ? active[0] : (orders[0] || null);

        if (latestOrder && (latestOrder.status === 'handed_to_partner' || latestOrder.status === 'cancelled')) {
          setActiveOrder(prev => {
            if (!prev) return null;
            if (prev._id === latestOrder._id && (prev.status === 'handed_to_partner' || prev.status === 'cancelled')) {
              return prev;
            }
            const timeout = setTimeout(() => {
              setActiveOrder(null);
            }, 10000);
            setDeliveredTimeout(timeout);
            return latestOrder;
          });
        } else {
          setActiveOrder(latestOrder);
          if (deliveredTimeout) {
            clearTimeout(deliveredTimeout);
            setDeliveredTimeout(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch orders for widget:', err);
      }
    };

    fetchOrders();

    const interval = setInterval(fetchOrders, 30000);

    let sseSource = null;
    if (activeOrder?._id) {
      sseSource = new EventSource(`/api/orders/${activeOrder._id}/stream?token=${token}`);
      sseSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'ORDER_STATUS_UPDATED') {
            fetchOrders();
          }
        } catch (e) { /* Ignore malformed SSE data */ }
      };
    }

    return () => {
      clearInterval(interval);
      if (deliveredTimeout) clearTimeout(deliveredTimeout);
      if (sseSource) sseSource.close();
    };
  }, [isAuthenticated, token, deliveredTimeout, activeOrder?._id]);

  if (!activeOrder) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.widgetWrapper}
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className={`${styles.widget} ${isExpanded ? styles.expanded : ''}`}>
          
          <div 
            className={styles.iconWrapper}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse" : "Expand"}
          >
            <div className={styles.emojiLayer}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeOrder.status}
                  initial={{ scale: 0.5, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0, y: -10 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className={styles.statusEmoji}
                >
                  {EMOJIS[activeOrder.status] || '📋'}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className={styles.crossLayer}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </div>
          </div>

          <Link to={`/track/${activeOrder._id}`} className={styles.widgetLink}>
            <div className={styles.infoContainer}>
              <div className={styles.info}>
                <span className={styles.statusLabel}>
                  {STATUS_LABELS[activeOrder.status] || 'Processing Order'}
                </span>
                <span className={styles.orderId}>
                  Order #{activeOrder.orderNumber || `ORD-${activeOrder._id.slice(-6).toUpperCase()}`}
                </span>
              </div>
              <div className={styles.arrowIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </Link>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ActiveOrderWidget;
