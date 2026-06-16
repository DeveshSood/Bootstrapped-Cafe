import React, { useState } from 'react';
import { useCart } from '../components/Cart/CartContext';
import Button from '../components/common/Button';
import SlotCounter from '../components/common/SlotCounter';
import Footer from '../components/Footer/Footer';
import styles from './CheckoutPage.module.css';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle | processing | success | error

  const tax = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + tax;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    if (!form.name || !form.phone || !form.address) {
      alert('Please fill in all delivery details.');
      return;
    }
    setStatus('processing');

    try {
      // Create order on backend
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      });
      let orderData = {};
      if (res.ok) {
        orderData = await res.json();
      } else {
        console.warn('Backend payment order failed, using fallback values for demo purposes.');
      }

      // Open Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        amount: orderData.amount || (grandTotal * 100),
        currency: orderData.currency || 'INR',
        name: 'Bootstrap Cafe',
        description: 'Healthy Meal Order',
        order_id: orderData.id,
        handler: async (response) => {
          if (!orderData.id) {
            // Mock success if we are in demo mode (no backend order)
            setStatus('success');
            clearCart();
            return;
          }
          // Verify payment on backend
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items,
                customer: form,
                totalAmount: grandTotal,
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
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <>
        <main className={styles.checkoutPage}>
          <div className={styles.successState}>
            <span className={styles.successIcon}>✓</span>
            <h2 className={styles.successTitle}>Order Confirmed!</h2>
            <p className={styles.successText}>Thank you for your order, {form.name}. We'll begin preparing your healthy meals right away.</p>
            <Button variant="filled" href="/">Back to Home</Button>
          </div>
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
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className={styles.fieldInput} placeholder="Your name" required />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Phone *</label>
                <input name="phone" value={form.phone} onChange={handleChange} className={styles.fieldInput} placeholder="+91 98765 43210" required />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email</label>
                <input name="email" value={form.email} onChange={handleChange} className={styles.fieldInput} placeholder="you@email.com" type="email" />
              </div>
              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.fieldLabel}>Delivery Address *</label>
                <textarea name="address" value={form.address} onChange={handleChange} className={styles.fieldTextarea} placeholder="Full delivery address" rows={3} required />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className={styles.summarySection}>
            <h4 className={styles.formTitle}>Order Summary</h4>
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
            <Button variant="filled" size="lg" onClick={handlePayment} style={{ width: '100%', justifyContent: 'center', marginTop: 'var(--space-lg)' }}>
              {status === 'processing' ? 'Processing...' : `Pay ₹${grandTotal}`}
            </Button>
            {status === 'error' && <p className={styles.errorText}>Payment failed. Please try again.</p>}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;
