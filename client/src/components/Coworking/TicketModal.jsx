import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import styles from './TicketModal.module.css';

const TicketModal = ({ isOpen, onClose, subscription, onRedeemComplete }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState('active'); // active, processing, expired, redeemed
  const ticketRef = useRef(null);

  useEffect(() => {
    if (isOpen && subscription?.activeTicket) {
      setStatus('active');
      const expiresAt = new Date(subscription.activeTicket.expiresAt).getTime();
      
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const diff = expiresAt - now;

        if (diff <= 0) {
          clearInterval(interval);
          setTimeLeft(0);
          handleAutoRedeem();
        } else {
          setTimeLeft(Math.floor(diff / 1000));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, subscription]);

  const handleAutoRedeem = async () => {
    setStatus('processing');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/subscriptions/${subscription._id}/redeem`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setStatus('redeemed');
        onClose();
        if (onRedeemComplete) onRedeemComplete();
      } else {
        setStatus('expired');
      }
    } catch (err) {
      console.error(err);
      setStatus('expired');
    }
  };

  const handleSaveTicket = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      if (ticketRef.current) {
        const canvas = await html2canvas(ticketRef.current);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Meal_Ticket_${subscription.activeTicket.ticketId}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.log('html2canvas not installed, printing instead');
      window.print();
    }
  };

  if (!isOpen || !subscription || !subscription.activeTicket) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className={styles.modal}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          {status === 'redeemed' ? (
            <div className={styles.successState}>
              <div className={styles.checkIcon}>✓</div>
              <h2>Meal Redeemed!</h2>
              <p>Your meal has been marked as purchased. Enjoy!</p>
            </div>
          ) : (
            <>
              <div className={styles.header}>
                <h3 className={styles.title}>Your Meal Ticket</h3>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
              </div>

              <div className={styles.ticketContainer} ref={ticketRef}>
                <div className={styles.ticketHeader}>
                  <h4>Bootstrap Cafe</h4>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
                
                <div className={styles.ticketBody}>
                  <div className={styles.ticketId}>{subscription.activeTicket.ticketId}</div>
                  <div className={styles.mealInfo}>
                    <span className={styles.label}>Meal Number:</span>
                    <span className={styles.value}>
                      Meal #{subscription.totalMeals - subscription.mealsRemaining} of {subscription.totalMeals}
                    </span>
                  </div>
                  <div className={styles.mealInfo}>
                    <span className={styles.label}>Meal Type:</span>
                    <span className={styles.value}>{subscription.activeTicket.mealType}</span>
                  </div>
                  <div className={styles.mealInfo}>
                    <span className={styles.label}>Remaining Balance:</span>
                    <span className={styles.value}>
                      {subscription.mealsRemaining} / {subscription.totalMeals}
                    </span>
                  </div>
                  
                  {status === 'active' && (
                    <div className={styles.timerBox}>
                      <span className={styles.timerLabel}>Valid For</span>
                      <span className={`${styles.timerValue} ${timeLeft < 60 ? styles.timerWarning : ''}`}>
                        {timeString}
                      </span>
                    </div>
                  )}
                  {status === 'processing' && (
                    <div className={styles.timerBox}>
                      <span className={styles.timerValue}>Redeeming...</span>
                    </div>
                  )}
                </div>
                
                <div className={styles.ticketFooter}>
                  Show this screen at the counter
                </div>
              </div>

              <div className={styles.actions}>
                <Button variant="outlined" className={styles.modalBtn} onClick={handleSaveTicket}>
                  Save Ticket Image
                </Button>
                <Button variant="filled" className={styles.modalBtn} onClick={onClose} disabled={status === 'processing'}>
                  Mark as Purchased
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TicketModal;
