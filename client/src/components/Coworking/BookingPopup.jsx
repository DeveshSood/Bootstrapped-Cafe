import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import styles from './BookingPopup.module.css';

const BookingPopup = ({ isOpen, onClose, defaultPlan }) => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState('one-time'); // 'one-time' or 'subscription'
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [status, setStatus] = useState('idle'); // idle | processing | success | error

  // Determine plan type from suffix
  const isHourly = defaultPlan?.suffix === '/ hr';
  const isMonthly = defaultPlan?.suffix === '/ mo';

  // Reset form when opened with a new plan
  useEffect(() => {
    if (isOpen) {
      setType(isMonthly ? 'subscription' : 'one-time');
      setQuantity(1);
      setDays(1); // will be used as hours for hourly plans
      setStatus('idle');
      setStartDate('');
      setStartTime('');
    }
  }, [isOpen, defaultPlan, isMonthly]);

  const pricePerUnit = defaultPlan?.basePrice || 0;
  
  // For hourly, days state variable is actually used as 'hours'
  // For monthly, it's a fixed monthly price per person
  const multiplier = isMonthly ? 1 : days; 
  const durationDays = isMonthly ? 30 : days; // For backend subscription logic

  const totalPrice = pricePerUnit * quantity * multiplier;

  const handlePayment = async () => {
    if (!isAuthenticated) {
      alert('Please log in to book.');
      navigate(`/login?from=/coworking`);
      return;
    }

    setStatus('processing');

    try {
      const res = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planName: defaultPlan.title,
          price: totalPrice,
          startDate: startDate,
          startTime: isHourly ? startTime : undefined,
          quantity: quantity,
          durationDays: isHourly ? undefined : durationDays,
          durationHours: isHourly ? days : undefined
        }),
      });
      
      if (!res.ok) throw new Error('Failed to create booking');
      const rzpOrderData = await res.json();

      if (!rzpOrderData.id) {
        // Mock success if we are in demo mode
        const verifyRes = await fetch('/api/subscriptions/verify', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            subscriptionId: rzpOrderData.subscriptionId
          }),
        });
        if (verifyRes.ok) {
          setStatus('success');
        } else {
          setStatus('error');
        }
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: rzpOrderData.amount || (totalPrice * 100),
        currency: rzpOrderData.currency || 'INR',
        name: 'Bootstrapped Cafe',
        description: `${isMonthly ? 'Subscription' : 'Booking'}: ${defaultPlan.title}`,
        order_id: rzpOrderData.id,
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/subscriptions/verify', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionId: rzpOrderData.subscriptionId
              }),
            });
            if (verifyRes.ok) {
              setStatus('success');
            } else {
              setStatus('error');
            }
          } catch {
            setStatus('error');
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: {
          color: '#C8512D',
        },
        modal: {
          ondismiss: () => setStatus('idle'),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (!isOpen || !defaultPlan) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={status === 'success' ? onClose : undefined}
      >
        <motion.div 
          className={styles.modal}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          {status === 'success' ? (
            <div className={styles.successState}>
              <div className={styles.checkIcon}>✓</div>
              <h2>Booking Confirmed!</h2>
              <p>Your {isMonthly ? 'monthly subscription' : 'booking'} for <strong>{defaultPlan.title}</strong> is active.</p>
              <Button variant="filled" onClick={() => { onClose(); navigate('/profile?tab=subscriptions'); }}>View in Profile</Button>
            </div>
          ) : (
            <>
              <div className={styles.header}>
                <h3 className={styles.title}>Book {defaultPlan.title}</h3>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
              </div>

              <div className={styles.content}>
                <p className={styles.desc}>{defaultPlan.desc}</p>
                
                <div className={styles.inputs}>
                  <div className={styles.inputGroup}>
                    <label>For how many people?</label>
                    <div className={styles.qtyControl}>
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                  </div>

                  {isHourly && (
                    <div className={styles.inputGroup}>
                      <label>For how many hours?</label>
                      <div className={styles.qtyControl}>
                        <button onClick={() => setDays(Math.max(1, days - 1))}>-</button>
                        <span>{days}</span>
                        <button onClick={() => setDays(days + 1)}>+</button>
                      </div>
                    </div>
                  )}

                  {!isHourly && !isMonthly && (
                     <div className={styles.inputGroup}>
                       <label>For how many days?</label>
                       <div className={styles.qtyControl}>
                         <button onClick={() => setDays(Math.max(1, days - 1))}>-</button>
                         <span>{days}</span>
                         <button onClick={() => setDays(days + 1)}>+</button>
                       </div>
                     </div>
                  )}

                  <div className={styles.inputGroup}>
                    <label>Start Date</label>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={e => setStartDate(e.target.value)} 
                      min={new Date().toISOString().split('T')[0]} 
                      className={styles.dateInput}
                    />
                  </div>

                  {isHourly && (
                    <div className={styles.inputGroup}>
                      <label>Start Time</label>
                      <input 
                        type="time" 
                        value={startTime} 
                        onChange={e => setStartTime(e.target.value)} 
                        className={styles.dateInput}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.footer}>
                  <div className={styles.totalPrice}>
                    <span>Total Pay:</span>
                    <strong>₹{totalPrice.toLocaleString('en-IN')}</strong>
                  </div>
                  {!isAuthenticated ? (
                    <Button variant="filled" onClick={() => navigate('/login?from=/coworking')}>Log in to Book</Button>
                  ) : (
                    <Button 
                      variant="filled" 
                      onClick={handlePayment}
                      disabled={status === 'processing'}
                    >
                      {status === 'processing' ? 'Processing...' : 'Pay Now'}
                    </Button>
                  )}
                </div>
                {status === 'error' && <p className={styles.errorText}>Payment failed. Please try again.</p>}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingPopup;
