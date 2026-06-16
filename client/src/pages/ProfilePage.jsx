import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../components/Cart/CartContext';
import { generateAvatar } from '../utils/avatarGenerator';
import { apiGetUserOrders } from '../utils/api';
import Footer from '../components/Footer/Footer';
import styles from './ProfilePage.module.css';

const TABS = ['profile', 'addresses', 'orders', 'subscriptions'];
const TAB_LABELS = { profile: 'Personal Info', addresses: 'Addresses', orders: 'Order History', subscriptions: 'My Subscriptions & Passes' };

const STATUS_LABELS = {
  pending: 'Pending', payment_confirmed: 'Payment Confirmed', accepted: 'Accepted', prepared: 'Prepared',
  packaged: 'Packaged', out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered', cancelled: 'Cancelled',
};

const ProfilePage = () => {
  const [params, setParams] = useSearchParams();
  const activeTab = TABS.includes(params.get('tab')) ? params.get('tab') : 'profile';
  const { user, updateProfile, addAddress, deleteAddress, setDefaultAddress, token } = useAuth();
  const { addItems } = useCart();
  const toast = useToast();

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', email: '' });
  const [saving, setSaving] = useState(false);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '' });

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderPage, setOrderPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState([]);

  const toggleOrderItems = (orderId) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  // Subscriptions
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [subPage, setSubPage] = useState(1);
  const [cancelSubModal, setCancelSubModal] = useState(null); // id of subscription
  const [digitalPassModal, setDigitalPassModal] = useState(null); // full sub object

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileForm({ name: user.name, phone: user.phone || '', email: user.email });
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingOrders(true);
      apiGetUserOrders(token)
        .then(data => setOrders(data))
        .catch(() => toast.error('Failed to load orders'))
        .finally(() => setLoadingOrders(false));
    } else if (activeTab === 'subscriptions' && token) {
      setLoadingSubscriptions(true);
      fetch('/api/subscriptions/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setSubscriptions(data))
      .catch(() => toast.error('Failed to load subscriptions'))
      .finally(() => setLoadingSubscriptions(false));
    }
  }, [activeTab, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileForm);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!cancelSubModal) return;
    try {
      const res = await fetch(`/api/subscriptions/${cancelSubModal}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        toast.success('Subscription auto-renewal cancelled.');
        setSubscriptions(prev => prev.map(s => s._id === cancelSubModal ? { ...s, status: 'cancelled' } : s));
      } else {
        toast.error('Failed to cancel subscription.');
      }
    } catch (err) {
      toast.error('Network error');
    } finally {
      setCancelSubModal(null);
    }
  };
  const handlePauseSub = async (id) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}/pause`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Subscription paused successfully.');
        // Refresh subscriptions
        const updatedSubs = subscriptions.map(s => s._id === id ? { ...s, paused: true } : s);
        // Better to re-fetch but for now update state
        // To be safe:
        apiGetUserOrders(token).catch(console.error); // re-trigger fetch later or just reload
        window.location.reload(); 
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to pause subscription.');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleResumeSub = async (id) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}/resume`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Subscription resumed successfully.');
        window.location.reload();
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to resume subscription.');
      }
    } catch (err) {
      toast.error('Network error');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(addressForm);
      setAddressForm({ label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '' });
      setShowAddressForm(false);
      toast.success('Address added');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      toast.success('Address removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultAddress(id);
      toast.success('Default address updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleReorder = (order) => {
    // Map order items to match the expected format in CartContext
    const cartItems = order.items.map(item => ({
      id: item.menuItem || item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity
    }));
    
    addItems(cartItems);
    toast.success('Items added to cart!');
    window.dispatchEvent(new Event('open-cart'));
  };

  if (!user) return null;

  const avatar = generateAvatar(user.name, 120);

  return (
    <>
      <main className={styles.profilePage}>
        <div className={styles.profileContainer}>
          <aside className={styles.profileSidebar}>
            {/* Header */}
            <div className={styles.profileHeader}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatarGlow} />
                <motion.img
                  src={avatar}
                  alt={user.name}
                  className={styles.avatar}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                />
              </div>
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userEmail}>{user.email}</p>
              {user.role !== 'user' && (
                <span className={styles.roleBadge}>{user.role}</span>
              )}
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setParams({ tab })}
                >
                  <span className={styles.activeIndicator} />
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </div>
          </aside>

          {/* Tab Content */}
          <div className={styles.tabContent}>
          <AnimatePresence mode="wait">
            {/* ─── Profile Tab ─── */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <form onSubmit={handleProfileSave} className={styles.form}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Full Name</label>
                    <input
                      className={styles.fieldInput}
                      value={profileForm.name}
                      onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Email</label>
                    <input
                      type="email"
                      className={styles.fieldInput}
                      value={profileForm.email}
                      onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel}>Phone</label>
                    <div className={styles.phoneInputWrapper}>
                      <span className={styles.phonePrefix}>🇮🇳 +91</span>
                      <input
                        type="tel"
                        className={styles.phoneInput}
                        value={profileForm.phone ? profileForm.phone.replace(/^\+91\s?/, '') : ''}
                        onChange={e => {
                          const val = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                          setProfileForm(p => ({ ...p, phone: val ? `+91 ${val}` : '' }));
                        }}
                        placeholder="98765 43210"
                      />
                    </div>
                  </div>
                  <button type="submit" className={styles.saveBtn} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ─── Addresses Tab ─── */}
            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {user.addresses.length === 0 && !showAddressForm && (
                  <p className={styles.emptyText}>No addresses yet. Add one to speed up checkout.</p>
                )}

                <div className={styles.addressList}>
                  <AnimatePresence initial={false}>
                    {user.addresses.map(addr => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95, height: 0, padding: 0, margin: 0 }}
                        animate={{ opacity: 1, scale: 1, height: 'auto', padding: 'var(--space-xl)' }}
                        exit={{ opacity: 0, scale: 0.95, height: 0, padding: 0, margin: 0, overflow: 'hidden', border: 0 }}
                        transition={{ duration: 0.25 }}
                        key={addr._id}
                        className={`${styles.addressCard} ${addr.isDefault ? styles.addressDefault : ''}`}
                      >
                        <div className={styles.addressContent}>
                          <span className={styles.addressLabel}>{addr.label}</span>
                          {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}
                          <p className={styles.addressText}>
                            {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                            <br />{addr.city}{addr.state ? `, ${addr.state}` : ''} — {addr.pincode}
                          </p>
                        </div>
                        <div className={styles.addressActions}>
                          {!addr.isDefault && (
                            <button onClick={() => handleSetDefault(addr._id)} className={styles.setDefaultBtn}>
                              Set Default
                            </button>
                          )}
                          <button onClick={() => handleDeleteAddress(addr._id)} className={styles.deleteBtn}>
                            Remove
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                  {showAddressForm ? (
                    <motion.form
                      key="form"
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10, height: 0, padding: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleAddAddress}
                      className={styles.form}
                      style={{ marginTop: 'var(--space-lg)' }}
                    >
                      <div className={styles.fieldRow}>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>Label</label>
                          <select
                            className={styles.fieldInput}
                            value={addressForm.label}
                            onChange={e => setAddressForm(p => ({ ...p, label: e.target.value }))}
                          >
                            <option>Home</option>
                            <option>Work</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>Pincode</label>
                          <input
                            className={styles.fieldInput}
                            value={addressForm.pincode}
                            onChange={e => setAddressForm(p => ({ ...p, pincode: e.target.value }))}
                            required
                            placeholder="560001"
                          />
                        </div>
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Address Line 1</label>
                        <input
                          className={styles.fieldInput}
                          value={addressForm.line1}
                          onChange={e => setAddressForm(p => ({ ...p, line1: e.target.value }))}
                          required
                          placeholder="House/Flat No, Building, Street"
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.fieldLabel}>Address Line 2</label>
                        <input
                          className={styles.fieldInput}
                          value={addressForm.line2}
                          onChange={e => setAddressForm(p => ({ ...p, line2: e.target.value }))}
                          placeholder="Landmark, Area (optional)"
                        />
                      </div>
                      <div className={styles.fieldRow}>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>City</label>
                          <input
                            className={styles.fieldInput}
                            value={addressForm.city}
                            onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))}
                            required
                          />
                        </div>
                        <div className={styles.field}>
                          <label className={styles.fieldLabel}>State</label>
                          <input
                            className={styles.fieldInput}
                            value={addressForm.state}
                            onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className={styles.formActions}>
                        <button type="submit" className={styles.saveBtn}>Add Address</button>
                        <button type="button" className={styles.cancelBtn} onClick={() => setShowAddressForm(false)}>Cancel</button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.button
                      key="add-btn"
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0, padding: 0, overflow: 'hidden' }}
                      className={styles.addBtn}
                      onClick={() => setShowAddressForm(true)}
                    >
                      + Add New Address
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* ─── Orders Tab ─── */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                {loadingOrders ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.inlineSpinner}></div>
                    <p className={styles.loadingText}>Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className={styles.emptyOrders}>
                    <p className={styles.emptyText}>No orders yet.</p>
                    <Link to="/menu" className={styles.browseBtn}>Browse Menu</Link>
                  </div>
                ) : (
                  <>
                    <div className={styles.orderList}>
                      {orders.slice((orderPage - 1) * 3, orderPage * 3).map((order, index) => (
                        <motion.div 
                          key={order._id} 
                          className={styles.orderCard}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1, type: 'spring', bounce: 0.2 }}
                        >
                          <div className={styles.orderHeader}>
                            <div>
                              <span className={styles.orderId}>
                                {order.orderNumber || `ORD-${order._id.slice(-6).toUpperCase()}`}
                              </span>
                              <span className={styles.orderDate}>
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                })} at {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit', minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <span className={`${styles.statusBadge} ${styles[`status_${order.status}`]}`}>
                              {STATUS_LABELS[order.status] || order.status}
                            </span>
                          </div>
                          <div className={styles.orderItems}>
                            {(expandedOrders.includes(order._id) ? order.items : order.items.slice(0, 2)).map((item, i) => (
                              <span key={i} className={styles.orderItemName}>
                                {item.name} × {item.quantity}
                              </span>
                            ))}
                            {order.items.length > 2 && (
                              <button 
                                onClick={() => toggleOrderItems(order._id)}
                                className={styles.expandItemsBtn}
                              >
                                {expandedOrders.includes(order._id) 
                                  ? "Show less" 
                                  : `+ ${order.items.length - 2} more items`}
                              </button>
                            )}
                          </div>
                          <div className={styles.orderFooter}>
                            <span className={styles.orderTotal}>₹{order.totalAmount}</span>
                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                              <Link to={`/track/${order._id}`} className={styles.trackBtn}>
                                <span className={styles.trackBtnText}>Track Order</span>
                                <span className={styles.trackBtnIcon}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7"/>
                                  </svg>
                                </span>
                              </Link>
                            )}
                            <button onClick={() => handleReorder(order)} className={styles.reorderBtn}>
                              <span className={styles.trackBtnText}>Reorder</span>
                              <span className={styles.trackBtnIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                                  <path d="M3 3v5h5"/>
                                </svg>
                              </span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    {orders.length > 3 && (
                      <div className={styles.pagination}>
                        <button 
                          onClick={() => setOrderPage(p => Math.max(1, p - 1))}
                          disabled={orderPage === 1}
                          className={styles.pageBtn}
                        >
                          Previous
                        </button>
                        <span className={styles.pageInfo}>Page {orderPage} of {Math.ceil(orders.length / 3)}</span>
                        <button 
                          onClick={() => setOrderPage(p => p + 1)}
                          disabled={orderPage >= Math.ceil(orders.length / 3)}
                          className={styles.pageBtn}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'subscriptions' && (
              <motion.div
                key="subscriptions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={styles.tabContent}
              >
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>My Subscriptions & Passes</h3>
                </div>
                {loadingSubscriptions ? (
                  <div className={styles.loader}>Loading...</div>
                ) : subscriptions.length === 0 ? (
                  <div className={styles.emptyState}>
                    <p>You don't have any active subscriptions or passes.</p>
                    <Link to="/#coworking-pricing" className={styles.addAddressBtn}>Explore Plans</Link>
                  </div>
                ) : (
                  <>
                    <div className={styles.subGrid}>
                      {subscriptions.slice((subPage - 1) * 2, subPage * 2).map(sub => {
                        const isActive = sub.status === 'active';
                        const isOneTime = sub.durationDays < 30;
                        
                        return (
                          <motion.div 
                            key={sub._id} 
                            className={`${styles.subCard} ${isActive ? styles.subActive : ''}`} 
                          >
                            <div className={styles.subHeader}>
                              <div>
                                <h4 className={styles.subTitle}>
                                  {sub.planName}{' '}
                                  <span className={styles.subBadge}>{isOneTime ? `Daily Pass (${sub.durationDays} Days)` : 'Monthly'}</span>
                                </h4>
                                <p className={styles.subDates}>
                                  For {sub.quantity} {sub.quantity > 1 ? 'People' : 'Person'} • 
                                  Started: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'Pending'}
                                  {sub.endDate && ` • Expires: ${new Date(sub.endDate).toLocaleDateString()}`}
                                </p>
                              </div>
                            <div className={styles.subStatusWrapper}>
                              <span className={`${styles.statusBadge} ${styles['status_' + sub.status]}`}>
                                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                              </span>
                              {sub.paused && (
                                <span className={styles.statusBadge} style={{ background: '#FFF3E0', color: '#E65100', marginLeft: '8px' }}>
                                  PAUSED
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className={styles.subBody}>
                            <div className={styles.subPrice}>
                              <span className={styles.priceLabel}>Price</span>
                              <span className={styles.priceValue}>₹{sub.price}</span>
                            </div>
                          </div>

                          <div className={styles.subActions}>
                            {isActive && (
                              <button 
                                className={styles.showPassBtn}
                                onClick={() => setDigitalPassModal(sub)}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                Show Pass
                              </button>
                            )}
                            {isActive && !sub.paused && (
                              <button 
                                className={styles.showPassBtn}
                                onClick={() => handlePauseSub(sub._id)}
                              >
                                Pause
                              </button>
                            )}
                            {isActive && sub.paused && (
                              <button 
                                className={styles.showPassBtn}
                                onClick={() => handleResumeSub(sub._id)}
                              >
                                Resume
                              </button>
                            )}
                            {(isActive || sub.status === 'pending') && (
                              <button 
                                className={styles.cancelSubBtn}
                                onClick={() => setCancelSubModal(sub._id)}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                    </div>
                    
                    {subscriptions.length > 2 && (
                      <div className={styles.pagination}>
                        <button 
                          onClick={() => setSubPage(p => Math.max(1, p - 1))}
                          disabled={subPage === 1}
                          className={styles.pageBtn}
                        >
                          Previous
                        </button>
                        <span className={styles.pageInfo}>Page {subPage} of {Math.ceil(subscriptions.length / 2)}</span>
                        <button 
                          onClick={() => setSubPage(p => p + 1)}
                          disabled={subPage >= Math.ceil(subscriptions.length / 2)}
                          className={styles.pageBtn}
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>
        
        {/* Cancel Subscription Modal */}
        <AnimatePresence>
          {cancelSubModal && (
            <motion.div 
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className={styles.cancelModalCard}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className={styles.modalIconWarning}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <h3>Cancel Subscription</h3>
                <p>Are you sure you want to cancel this subscription? <strong>Refunds are not possible</strong>, but you will continue to have access to your daily meals until the expiry date.</p>
                <div className={styles.modalActions}>
                  <button className={styles.cancelModalBtn} onClick={() => setCancelSubModal(null)}>Keep it</button>
                  <button className={styles.confirmCancelBtn} onClick={handleCancelSubscription}>Yes, Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Digital Pass Modal */}
        <AnimatePresence>
          {digitalPassModal && (
            <motion.div 
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDigitalPassModal(null)}
            >
              <motion.div 
                className={styles.passModalCard}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button className={styles.closePassBtn} onClick={() => setDigitalPassModal(null)}>×</button>
                <div className={styles.passHeader}>
                  <div className={styles.passLogo}>BC</div>
                  <div className={styles.passActiveBadge}>ACTIVE</div>
                </div>
                <div className={styles.passBody}>
                  <h2 className={styles.passPlanName}>{digitalPassModal.planName}</h2>
                  <h3 className={styles.passUserName}>{user.name}</h3>
                  <div className={styles.passDivider}></div>
                  <div className={styles.passDetails}>
                    <div className={styles.passDetailCol}>
                      <span>Valid From</span>
                      <strong>{new Date(digitalPassModal.startDate).toLocaleDateString()}</strong>
                    </div>
                    <div className={styles.passDetailCol}>
                      <span>Valid Until</span>
                      <strong>{new Date(digitalPassModal.endDate).toLocaleDateString()}</strong>
                    </div>
                  </div>
                </div>
                <div className={styles.passFooter}>
                  <p>Show this pass at the counter to claim your meal.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
