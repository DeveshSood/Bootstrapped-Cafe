import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { generateAvatar, getInitials } from '../../utils/avatarGenerator';
import styles from './UserMenu.module.css';

const UserMenu = () => {
  const { user, logout, isStaff, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const menuRef = useRef(null);
  const avatarUrl = user ? generateAvatar(user.name, 80) : '';

  // Fetch active orders count for staff
  useEffect(() => {
    if (isStaff) {
      const fetchCount = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('http://localhost:5000/api/orders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          const active = data.filter(o => ['pending', 'accepted', 'prepared', 'packaged'].includes(o.status));
          setActiveOrdersCount(active.length);
        } catch (err) {
          console.error('Failed to fetch orders count', err);
        }
      };
      fetchCount();

      const eventSource = new EventSource('http://localhost:5000/api/orders/stream');
      eventSource.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        if (payload.type === 'new_order' || payload.type === 'status_update') {
          fetchCount();
        }
      };
      return () => eventSource.close();
    }
  }, [isStaff]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  if (!user) return null;

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button
        className={styles.avatarBtn}
        onClick={() => setOpen(prev => !prev)}
        aria-label="User menu"
        aria-expanded={open}
      >
        <img src={avatarUrl} alt={user.name} className={styles.avatarImg} />
      </button>
      {isStaff && activeOrdersCount > 0 && (
        <span className={styles.navBadge}>{activeOrdersCount}</span>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Profile header */}
            <div className={styles.dropdownHeader}>
              <img src={avatarUrl} alt="" className={styles.dropdownAvatar} />
              <div>
                <span className={styles.dropdownName}>{user.name}</span>
                <span className={styles.dropdownEmail}>{user.email}</span>
              </div>
            </div>

            <div className={styles.dropdownDivider} />

            {/* Nav items */}
            <Link to="/profile" className={styles.dropdownItem} onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Your Profile
            </Link>

            <Link to="/profile?tab=orders" className={styles.dropdownItem} onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Order History
            </Link>

            <Link to="/profile?tab=subscriptions" className={styles.dropdownItem} onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              My Subscriptions
            </Link>

            {isStaff && (
              <Link to="/restaurant" className={styles.dropdownItem} onClick={() => setOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                Kitchen Dashboard
                {activeOrdersCount > 0 && (
                  <span className={styles.dropdownBadge}>{activeOrdersCount}</span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" className={styles.dropdownItem} onClick={() => setOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Admin Panel
              </Link>
            )}

            <div className={styles.dropdownDivider} />

            <button
              className={`${styles.dropdownItem} ${styles.logoutItem}`}
              onClick={() => { logout(); setOpen(false); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
