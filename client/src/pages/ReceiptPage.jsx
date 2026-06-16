import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './ReceiptPage.module.css';
import { apiGetOrder } from '../utils/api'; // Wait, does this exist? I will use fetch.

const ReceiptPage = () => {
  const { id } = useParams();
  const { token, isStaff, isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    
    // We can fetch via /api/orders/:id, since admin and staff have access.
    fetch(`/api/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Order not found');
      return res.json();
    })
    .then(data => {
      setOrder(data);
    })
    .catch(err => {
      setError(err.message);
    });
  }, [id, token]);

  if (!isStaff && !isAdmin) return <div className={styles.container}>Unauthorized</div>;
  if (error) return <div className={styles.container}>Error: {error}</div>;
  if (!order) return <div className={styles.container}>Loading receipt...</div>;

  return (
    <div className={styles.receiptWrapper}>
      <div className={styles.receipt}>
        <div className={styles.header}>
          <h1>BOOTSTRAPPED CAFE</h1>
          <p>123 Healthy Way, Tech Hub</p>
          <p>Phone: +91 98765 43210</p>
        </div>
        
        <div className={styles.divider} />
        
        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <span>Order ID:</span>
            <strong>{order.orderNumber || '#' + order._id.slice(-6)}</strong>
          </div>
          <div className={styles.metaRow}>
            <span>Date:</span>
            <span>{new Date(order.createdAt).toLocaleString()}</span>
          </div>
          {order.deliveredAt && (
            <div className={styles.metaRow}>
              <span>Delivered:</span>
              <span>{new Date(order.deliveredAt).toLocaleString()}</span>
            </div>
          )}
          <div className={styles.metaRow}>
            <span>Customer:</span>
            <span>{order.customerName}</span>
          </div>
          <div className={styles.metaRow}>
            <span>Phone:</span>
            <span>{order.customerPhone}</span>
          </div>
          {order.paymentStatus === 'completed' && (
            <div className={styles.metaRow}>
              <span>Payment:</span>
              <span>PAID via Razorpay</span>
            </div>
          )}
        </div>
        
        <div className={styles.divider} />
        
        <table className={styles.itemsTable}>
          <thead>
            <tr>
              <th style={{textAlign: 'left'}}>Item</th>
              <th style={{textAlign: 'center'}}>Qty</th>
              <th style={{textAlign: 'right'}}>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td style={{textAlign: 'left'}}>{item.name}</td>
                <td style={{textAlign: 'center'}}>{item.quantity}</td>
                <td style={{textAlign: 'right'}}>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className={styles.divider} />
        
        <div className={styles.totals}>
          <div className={styles.totalRow}>
            <span>Subtotal</span>
            <span>₹{order.totalAmount}</span>
          </div>
          <div className={styles.totalRow + ' ' + styles.grandTotal}>
            <span>Total</span>
            <span>₹{order.totalAmount}</span>
          </div>
        </div>
        
        <div className={styles.divider} />
        
        <div className={styles.footer}>
          <p>Thank you for choosing Bootstrapped Cafe!</p>
          <p>Have a healthy and productive day.</p>
        </div>
      </div>
      <div className={styles.noPrint}>
        <button onClick={() => window.print()}>Print Receipt</button>
        <button onClick={() => window.close()}>Close Tab</button>
      </div>
      <style>{`
        body, a, button, input, textarea { cursor: auto !important; }
      `}</style>
    </div>
  );
};

export default ReceiptPage;
