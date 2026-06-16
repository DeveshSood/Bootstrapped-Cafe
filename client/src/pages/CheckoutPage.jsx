import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../components/Cart/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import SlotCounter from '../components/common/SlotCounter';
import Footer from '../components/Footer/Footer';
import { motion } from 'framer-motion';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [addressInput, setAddressInput] = useState(''); // for guests
  const [selectedAddressId, setSelectedAddressId] = useState(''); // for logged in
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [orderId, setOrderId] = useState(null);

  const tax = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + tax;

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
      
      const defaultAddr = user.addresses?.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
      } else if (user.addresses?.length > 0) {
        setSelectedAddressId(user.addresses[0]._id);
      }
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getFinalAddress = () => {
    if (!isAuthenticated) return addressInput;
    if (!selectedAddressId) return '';
    const addr = user.addresses.find(a => a._id === selectedAddressId);
    if (!addr) return '';
    return `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}, ${addr.city}${addr.state ? ', ' + addr.state : ''} - ${addr.pincode}`;
  };

  const handlePayment = async () => {
    const finalAddress = getFinalAddress();
    
    if (!form.name || !form.phone || !finalAddress) {
      alert('Please fill in all delivery details.');
      return;
    }
    setStatus('processing');

    try {
      // 1. Create order on our backend (passing token if available)
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: items.map(i => {
            const itemData = { name: i.name, quantity: i.quantity, price: i.price };
            // Only attach menuItem if it's a valid MongoDB ObjectId (string length 24)
            if (typeof i.id === 'string' && i.id.length === 24) {
              itemData.menuItem = i.id;
            }
            return itemData;
          }),
          totalAmount: grandTotal,
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email,
          customerAddress: finalAddress, // Will be mapped to deliveryAddress.formatted
        }),
      });
      
      if (!res.ok) throw new Error('Failed to create order');
      const backendOrder = await res.json();
      setOrderId(backendOrder._id);

      // 2. Create Razorpay order (mocking if not fully setup, but we call the route anyway)
      const rzpRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      });
      
      let rzpOrderData = {};
      if (rzpRes.ok) {
        rzpOrderData = await rzpRes.json();
      } else {
        console.warn('Backend payment order failed, using fallback values for demo purposes.');
      }

      // 3. Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: rzpOrderData.amount || (grandTotal * 100),
        currency: rzpOrderData.currency || 'INR',
        name: 'Bootstrapped Cafe',
        description: 'Healthy Meal Order',
        ...(rzpOrderData.id && { order_id: rzpOrderData.id }),
        handler: async (response) => {
          if (!rzpOrderData.id) {
            // Mock success if we are in demo mode (no backend razorpay order)
            setStatus('success');
            clearCart();
            return;
          }
          // Verify payment
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: backendOrder._id // pass our DB order ID to mark paid
              }),
            });
            if (verifyRes.ok) {
              setStatus('success');
              clearCart();
            } else {
              setStatus('error');
            }
          } catch {
            setStatus('error');
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
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

  if (status === 'success') {
    const wrapperVariants = {
      hidden: { scale: 0.5, opacity: 0 },
      visible: { 
        scale: 1, 
        opacity: 1, 
        transition: { type: 'spring', stiffness: 300, damping: 20, staggerChildren: 0.2 } 
      }
    };
    
    const circleVariants = {
      hidden: { scale: 0, opacity: 0 },
      visible: { 
        scale: 1, 
        opacity: 1, 
        transition: { type: 'spring', stiffness: 200, damping: 15 } 
      }
    };

    const checkVariants = {
      hidden: { pathLength: 0, opacity: 0 },
      visible: { 
        pathLength: 1, 
        opacity: 1, 
        transition: { duration: 0.4, ease: "easeOut", delay: 0.2 } 
      }
    };

    return (
      <>
        <main className={styles.checkoutPage}>
          <motion.div 
            className={styles.successState}
            initial="hidden"
            animate="visible"
            variants={wrapperVariants}
          >
            <div className={styles.animatedCheckWrapper}>
              <svg viewBox="0 0 50 50" className={styles.checkSvg}>
                <motion.circle
                  cx="25"
                  cy="25"
                  r="24"
                  fill="var(--forest-green)"
                  variants={circleVariants}
                />
                <motion.path
                  d="M16 26 L22 32 L34 18"
                  fill="none"
                  stroke="var(--white)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={checkVariants}
                />
              </svg>
            </div>
            
            <motion.h2 
              className={styles.successTitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Order Confirmed!
            </motion.h2>
            
            <motion.p 
              className={styles.successText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Thank you for your order, {form.name}. We'll begin preparing your healthy meals right away.
            </motion.p>
            
            <motion.div 
              className={styles.successActions}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, type: 'spring' }}
            >
              {isAuthenticated && orderId ? (
                <Button variant="filled" href={`/track/${orderId}`}>Track Order</Button>
              ) : (
                <Button variant="filled" href="/">Back to Home</Button>
              )}
            </motion.div>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className={styles.checkoutPage}>
        <div className={styles.checkoutHero}>
          <h2 className={styles.checkoutTitle}>Checkout</h2>
        </div>

        <div className={styles.checkoutContent}>
          {/* Form */}
          <div className={styles.formSection}>
            <h4 className={styles.formTitle}>Delivery Details</h4>
            
            {!isAuthenticated && (
              <div className={styles.guestNotice}>
                <p>Checking out as guest. <a href="/login?from=/checkout">Sign in</a> to save your details.</p>
              </div>
            )}

            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={styles.fieldInput} placeholder="Your name" required />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={styles.fieldInput} placeholder="+91 98765 43210" required />
              </div>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.fieldLabel}>Email</label>
                <input name="email" value={form.email} onChange={handleChange} className={styles.fieldInput} placeholder="you@email.com" type="email" />
              </div>
              
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.fieldLabel}>Delivery Address *</label>
                
                {isAuthenticated && user?.addresses?.length > 0 ? (
                  <div className={styles.addressSelector}>
                    {user.addresses.map(addr => (
                      <label key={addr._id} className={`${styles.addressOption} ${selectedAddressId === addr._id ? styles.selectedAddress : ''}`}>
                        <input 
                          type="radio" 
                          name="addressSelection" 
                          value={addr._id}
                          checked={selectedAddressId === addr._id}
                          onChange={() => setSelectedAddressId(addr._id)}
                          className={styles.addressRadio}
                        />
                        <div className={styles.addressDetails}>
                          <strong>{addr.label}</strong>
                          <p>{addr.line1}{addr.line2 ? ', ' + addr.line2 : ''}, {addr.city} - {addr.pincode}</p>
                        </div>
                      </label>
                    ))}
                    <Button variant="outline" href="/profile?tab=addresses" style={{marginTop: '8px'}}>+ Add New Address</Button>
                  </div>
                ) : (
                  <textarea 
                    value={addressInput} 
                    onChange={e => setAddressInput(e.target.value)} 
                    className={styles.fieldTextarea} 
                    placeholder="Full delivery address" 
                    rows={3} 
                    required 
                  />
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.summarySection}>
            <h4 className={styles.formTitle}>Order Summary</h4>
            {items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <>
                <div className={styles.summaryItems}>
                  {items.map(item => (
                    <div key={item.id} className={styles.summaryItem}>
                      <span>{item.name} × {item.quantity}</span>
                      <SlotCounter value={item.price * item.quantity} />
                    </div>
                  ))}
                </div>
                <div className={styles.summaryRow}><span>Subtotal</span><SlotCounter value={totalPrice} /></div>
                <div className={styles.summaryRow}><span>GST (5%)</span><SlotCounter value={tax} /></div>
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Total</span><SlotCounter value={grandTotal} /></div>
                <Button 
                  variant="filled" 
                  size="lg" 
                  onClick={handlePayment} 
                  style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-lg)' }}
                  disabled={items.length === 0}
                >
                  {status === 'processing' ? 'Processing...' : `Pay ₹${grandTotal}`}
                </Button>
                {status === 'error' && <p className={styles.errorText}>Payment failed. Please try again.</p>}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;
