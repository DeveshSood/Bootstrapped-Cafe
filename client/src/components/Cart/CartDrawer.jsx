import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import SlotCounter from '../common/SlotCounter';
import styles from './CartDrawer.module.css';

const CartDrawer = ({ isOpen, onClose, onCheckout }) => {
  const { items, addItem, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [lastRemoved, setLastRemoved] = useState(null);

  // Auto clear undo toast after 5 seconds
  useEffect(() => {
    let timer;
    if (lastRemoved) {
      timer = setTimeout(() => {
        setLastRemoved(null);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [lastRemoved]);

  const handleRemove = (item) => {
    setLastRemoved(item);
    removeItem(item.id);
  };

  const handleUndo = () => {
    if (lastRemoved) {
      addItem(lastRemoved);
      setLastRemoved(null);
    }
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles['overlay--open'] : ''}`}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      
      {/* Floating Drawer */}
      <div className={styles.drawer}>
        <div className={styles.drawerHeader}>
          <h4 className={styles.drawerTitle}>Your Cart</h4>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {/* Persistent list container so exit animations can fire when empty */}
        <div className={styles.itemsList}>
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div 
                key="empty" 
                className={styles.emptyState}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className={styles.emptyIcon}>🛒</span>
                <p className={styles.emptyText}>Your cart is empty</p>
                <p className={styles.emptySubtext}>Explore our menu and add some healthy meals!</p>
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div 
                  layout
                  key={item.id} 
                  className={styles.cartItem}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, filter: 'blur(8px)', rotate: 2 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                >
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemInfo}>
                    <h5 className={styles.itemName}>{item.name}</h5>
                    <span className={styles.itemPrice}>₹{item.price}</span>
                    <div className={styles.quantityControls}>
                      <button className={styles.qtyBtn} onClick={() => {
                        if (item.quantity === 1) handleRemove(item);
                        else updateQuantity(item.id, item.quantity - 1);
                      }}>−</button>
                      
                      <SlotCounter value={item.quantity} className={styles.qtyValue} prefix="" />
                      
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <button className={styles.removeBtn} onClick={() => handleRemove(item)} aria-label={`Remove ${item.name}`}>✕</button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
        
        {/* Persistent footer */}
        <div className={styles.drawerFooter} style={{ position: 'relative' }}>
          {/* Undo Toast */}
          <AnimatePresence>
            {lastRemoved && (
              <motion.div 
                className={styles.undoToast}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <span className={styles.undoText}>{lastRemoved.name} removed</span>
                <button className={styles.undoBtn} onClick={handleUndo}>Undo</button>
              </motion.div>
            )}
          </AnimatePresence>

          {items.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <SlotCounter value={totalPrice} className={styles.totalAmount} />
              </div>
              {isAuthenticated ? (
                <Button variant="filled" size="lg" onClick={onCheckout} style={{ width: '100%', justifyContent: 'center' }}>
                  Proceed to Checkout
                </Button>
              ) : (
                <Link
                  to="/login"
                  state={{ from: '/checkout' }}
                  onClick={onClose}
                  className={styles.loginToOrderBtn}
                >
                  Sign in to Order
                </Link>
              )}
              <button className={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
