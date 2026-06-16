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
  const [status, setStatus] = useState('idle'); // idle | processing | success | error

  // Reset form when opened with a new plan
  useEffect(() => {
    if (isOpen) {
      setType('one-time');
      setQuantity(1);
      setDays(1);
      setStatus('idle');
      setStartDate('');
    }
  }, [isOpen, defaultPlan]);

  const pricePerDay = defaultPlan?.basePrice || 0;
  const durationDays = type === 'subscription' ? 30 : days;
  // Apply a discount for monthly subscription if needed? Let's just use 20 days equivalent for monthly
  const multiplier = type === 'subscription' ? 20 : days;
  const totalPrice = pricePerDay * quantity * multiplier;

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
          quantity: quantity,
          durationDays: durationDays
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
        description: `${type === 'subscription' ? 'Subscription' : 'One-time Pass'}: ${defaultPlan.title}`,
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
              <p>Your {type === 'subscription' ? 'monthly subscription' : 'one-time pass'} for <strong>{defaultPlan.title}</strong> is active.</p>
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
                
                <div className={styles.typeSelector}>
                  <button 
                    className={`${styles.typeBtn} ${type === 'one-time' ? styles.activeType : ''}`}
                    onClick={() => setType('one-time')}
                  >
                    <span>Daily Pass</span>
                    <small>₹{defaultPlan.basePrice} / day</small>
                  </button>
                  <button 
                    className={`${styles.typeBtn} ${type === 'subscription' ? styles.activeType : ''}`}
                    onClick={() => setType('subscription')}
                  >
                    <span>Monthly Subscription</span>
                    <small>₹{defaultPlan.basePrice * 20} / month</small>
                  </button>
                </div>

                <div className={styles.inputs}>
                  <div className={styles.inputGroup}>
                    <label>For how many people?</label>
                    <div className={styles.qtyControl}>
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>
                  </div>

                  {type === 'one-time' && (
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
