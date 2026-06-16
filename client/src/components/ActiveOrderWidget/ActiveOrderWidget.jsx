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
  prepared: 'Being Prepared',
  packaged: 'Packaged',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const EMOJIS = {
  pending: '📋',
  payment_confirmed: '💳',
  accepted: '✅',
  prepared: '👨‍🍳',
  packaged: '📦',
  out_for_delivery: '🚴',
  delivered: '🎉',
  cancelled: '❌',
};

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

        // Find the most recent active order
        const currentActive = orders.find(
          (o) => o.status !== 'delivered' && o.status !== 'cancelled'
        );

        // If no active order, check if the most recent order was JUST delivered or cancelled
        if (!currentActive) {
          const latestOrder = orders[0];
          if (latestOrder && (latestOrder.status === 'delivered' || latestOrder.status === 'cancelled')) {
            // Check if we were previously tracking this order
            setActiveOrder((prev) => {
              if (prev && prev._id === latestOrder._id && prev.status !== latestOrder.status) {
                // It just changed to finished! Start the 1-minute timeout.
                const timeout = setTimeout(() => {
                  setActiveOrder(null);
                }, 10000); // 10 seconds
                setDeliveredTimeout(timeout);
                return latestOrder;
              }
              // If it was already finished, and we weren't tracking it active, or we are currently in the timeout
              if (prev && prev._id === latestOrder._id && (prev.status === 'delivered' || prev.status === 'cancelled')) {
                return prev; // keep showing it until timeout
              }
              return null; // hide it
            });
          } else {
            setActiveOrder(null);
          }
        } else {
          setActiveOrder(currentActive);
          // clear any existing timeout if an active order is found
          if (deliveredTimeout) {
            clearTimeout(deliveredTimeout);
            setDeliveredTimeout(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch orders for widget:', err);
      }
    };

    // Fetch immediately
    fetchOrders();

    // Poll every 30 seconds as fallback
    const interval = setInterval(fetchOrders, 30000);

    // Set up SSE stream for real-time updates if an active order exists
    let sseSource = null;
    if (activeOrder?._id) {
      sseSource = new EventSource(`/api/orders/${activeOrder._id}/stream?token=${token}`);
      sseSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'ORDER_STATUS_UPDATED') {
            fetchOrders(); // instantly fetch the latest state
          }
        } catch (e) {}
      };
    }

    return () => {
      clearInterval(interval);
      if (deliveredTimeout) clearTimeout(deliveredTimeout);
      if (sseSource) sseSource.close();
    };
  }, [isAuthenticated, token, deliveredTimeout, activeOrder?._id]);

  if (!activeOrder) return null;

  const isDelivered = activeOrder.status === 'delivered';

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
