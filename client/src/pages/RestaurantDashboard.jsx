import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiGetAllOrders, apiUpdateOrderStatus, apiRequestCancellation } from '../utils/api';
import PrepTimer from '../components/PrepTimer/PrepTimer';
import styles from './RestaurantDashboard.module.css';

const TABS = ['active', 'all', 'completed', 'cancellations', 'cancelled', 'unpaid', 'subscriptions'];

const STATUS_FLOW = {
  payment_confirmed: { next: 'accepted', label: 'Accept Order' },
  accepted: { next: 'prepared', label: 'Mark Prepared' },
  prepared: { next: 'packaged', label: 'Mark Packaged' },
  packaged: { next: 'assigned_to_partner', label: 'Assigned to Partner' },
  assigned_to_partner: { next: 'handed_to_partner', label: 'Handed Over' },
};

const RestaurantDashboard = () => {
  const { token, isStaff } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  
  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [prepOrder, setPrepOrder] = useState(null);
  const [prepTime, setPrepTime] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');

  // Subscriptions cache
  const [subscriptions, setSubscriptions] = useState(null);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  const sseRef = useRef(null);

  // Initial load
  useEffect(() => {
    if (!token || !isStaff) return;
    
    setLoading(true);
    apiGetAllOrders(token, { limit: 100 }) // Load recent 100
      .then(data => {
        setOrders(data.orders);
        setLoading(false);
      })
      .catch(err => {
        toast.error('Failed to load dashboard: ' + err.message);
        setLoading(false);
      });
  }, [token, isStaff, toast]);

  // Fetch subscriptions
  useEffect(() => {
    if (activeTab === 'subscriptions' && subscriptions === null) {
      setLoadingSubscriptions(true);
      fetch('/api/subscriptions/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setSubscriptions(data);
        } else {
          setSubscriptions([]);
        }
        setLoadingSubscriptions(false);
      })
      .catch(err => {
        console.error("Subscription fetch error:", err);
        toast.error('Failed to load subscriptions');
        setLoadingSubscriptions(false);
      });
    }
  }, [activeTab, subscriptions, token, toast]);

  // SSE for live dashboard updates
  useEffect(() => {
    if (!token || !isStaff) return;

    const source = new EventSource(`/api/orders/dashboard/stream?token=${token}`);
    sseRef.current = source;

    const fetchLatestOrders = () => {
      apiGetAllOrders(token, { limit: 100, _t: Date.now() })
        .then(data => setOrders(data.orders))
        .catch(err => console.error('Failed to sync orders', err));
    };

    const playChime = () => {
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Chime blocked by browser:', e));
    };

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_order' || data.type === 'status_update' || data.type === 'cancel_requested') {
          fetchLatestOrders();
          
          if (data.type === 'new_order') {
            toast.success(`New order received from ${data.order.customerName}!`);
            playChime();
          }
        }
      } catch (_) {}
    };

    return () => source.close();
  }, [token, isStaff, toast]);

  const handleUpdateStatusClick = (order) => {
    if (order.status === 'payment_confirmed') {
      setPrepOrder(order);
      setPrepTime('15');
      setPrepModalOpen(true);
    } else {
      handleUpdateStatus(order._id);
    }
  };

  const handleUpdateStatus = async (orderId, bodyData = {}) => {
    try {
      const updated = await apiUpdateOrderStatus(token, orderId, bodyData);
      setOrders(prev => prev.map(o => o._id === orderId ? updated : o));
      toast.success('Order status updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const submitPrepTime = (e) => {
    e.preventDefault();
    if (!prepTime || isNaN(prepTime)) {
      toast.error('Enter valid minutes');
      return;
    }
    handleUpdateStatus(prepOrder._id, { prepTime });
    setPrepModalOpen(false);
    setPrepOrder(null);
  };

  const submitCancelRequest = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    try {
      await apiRequestCancellation(token, cancelOrder._id, cancelReason);
      toast.success('Cancellation request sent to admin');
      setCancelModalOpen(false);
      setCancelOrder(null);
      setCancelReason('');
      
      // Update local state optimistic
      setOrders(prev => prev.map(o => 
        o._id === cancelOrder._id 
          ? { ...o, cancelRequest: { status: 'pending', reason: cancelReason } } 
          : o
      ));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!isStaff) return <div className={styles.unauthorized}>Unauthorized</div>;

  // Filter orders based on tab
  const filteredOrders = orders.filter(o => {
    const isUnpaid = o.paymentStatus !== 'completed' && o.status === 'pending';
    
    if (activeTab === 'unpaid' && !isUnpaid) return false;
    if (activeTab !== 'unpaid' && isUnpaid) return false;

    // Filter by tab
    if (activeTab === 'active' && (o.status === 'handed_to_partner' || o.status === 'cancelled')) return false;
    if (activeTab === 'completed' && o.status !== 'handed_to_partner') return false;
    if (activeTab === 'cancellations' && o.cancelRequest?.status !== 'pending') return false;
    if (activeTab === 'cancelled' && o.status !== 'cancelled') return false;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const oId = (o.orderNumber || o._id.slice(-6)).toLowerCase();
      const name = (o.customerName || '').toLowerCase();
      const phone = (o.customerPhone || '').toLowerCase();
      const date = new Date(o.createdAt).toLocaleDateString().toLowerCase();
      return oId.includes(term) || name.includes(term) || phone.includes(term) || date.includes(term);
    }
    
    return true;
  });

  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleGroup}>
            <h2>Kitchen Dashboard</h2>
            <div className={styles.liveIndicator}>
              <span className={styles.pulseNode} /> Live Updates Active
            </div>
          </div>
          <input 
            type="text" 
            placeholder="Search by ID, name, phone, date..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button 
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'active' && (
                <span className={styles.badge}>
                  {orders.filter(o => o.status !== 'handed_to_partner' && o.status !== 'cancelled' && !(o.paymentStatus !== 'completed' && o.status === 'pending')).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>Loading orders...</div>
        ) : filteredOrders.length === 0 && activeTab !== 'subscriptions' ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>🍽️</span>
            <p>No orders found in this view.</p>
          </div>
        ) : activeTab === 'subscriptions' ? (
          <div className={styles.subscriptionsView}>
            <div className={styles.subscriptionsHeader}>
              <h2>Subscriptions & Meal Plans</h2>
              <div className={styles.subsLegend}>
                <span className={styles.legendItem}><span className={`${styles.statusDot} ${styles.activeDot}`}></span>Active</span>
                <span className={styles.legendItem}><span className={`${styles.statusDot} ${styles.expiredDot}`}></span>Expired</span>
                <span className={styles.legendItem}><span className={`${styles.statusDot} ${styles.cancelledDot}`}></span>Cancelled</span>
              </div>
            </div>
            {loadingSubscriptions ? (
              <p>Loading...</p>
            ) : subscriptions?.length > 0 ? (
              <div className={styles.subscriptionGroups}>
                {Object.entries(
                  subscriptions
                    .filter(sub => {
                       if (!searchTerm) return true;
                       const term = searchTerm.toLowerCase();
                       const name = (sub.user?.name || '').toLowerCase();
                       const phone = (sub.user?.phone || '').toLowerCase();
                       const plan = (sub.planName || '').toLowerCase();
                       return name.includes(term) || phone.includes(term) || plan.includes(term);
                    })
                    .reduce((acc, sub) => {
                      acc[sub.planName] = acc[sub.planName] || [];
                      acc[sub.planName].push(sub);
                      return acc;
                    }, {})
                ).map(([planName, subs]) => (
                  <div key={planName} className={styles.planGroup}>
                    <h3 className={styles.planGroupTitle}>{planName} <span className={styles.planCount}>({subs.length})</span></h3>
                    <div className={styles.planGroupGrid}>
                       {subs.map(sub => (
                         <div key={sub._id} className={`${styles.subCard} ${styles['subStatus_' + sub.status]}`}>
                           <div className={styles.subCardHeader}>
                             <strong>{sub.user?.name || 'Guest User'}</strong>
                             <span className={styles.subBadge}>{sub.status}</span>
                           </div>
                           <p className={styles.subPhone}>{sub.user?.phone}</p>
                           <p className={styles.subDates}>
                             Started: {new Date(sub.startDate || sub.createdAt).toLocaleDateString()}
                           </p>
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No subscriptions found matching your search.</p>
            )}
          </div>
        ) : (
          <div className={styles.orderGrid}>
            <AnimatePresence>
              {filteredOrders.map(order => (
                <motion.div 
                  key={order._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "tween", duration: 0.2 }}
                  className={`${styles.orderCard} ${styles['status_' + order.status]}`}
                >
                  <div className={styles.cardHeader}>
                    <div className={styles.orderMeta}>
                      <span className={styles.orderId}>{order.orderNumber || '#' + order._id.slice(-6)}</span>
                      <div className={styles.timeGroup}>
                        <span className={styles.time} title="Order Date">
                          📅 {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric'})}
                        </span>
                        {order.deliveredAt && (
                          <span className={styles.time} title="Delivered Date">
                            ✅ {new Date(order.deliveredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', month: 'short', day: 'numeric'})}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={styles.statusGroup}>
                      <span className={styles.statusBadge}>{order.status.replace(/_/g, ' ')}</span>
                      {order.paymentStatus === 'completed' && <span className={styles.paymentBadge}>Paid</span>}
                    </div>
                  </div>

                  <div className={styles.customerInfo}>
                    <strong>{order.customerName}</strong>
                    <span className={styles.phone}>{order.customerPhone}</span>
                  </div>

                  <div className={styles.itemsList}>
                    {order.items.map((item, i) => (
                      <div key={i} className={styles.itemRowWrapper}>
                        <div className={styles.itemRow}>
                          <span className={styles.qty}>{item.quantity}x</span>
                          <span className={styles.itemName}>{item.name}</span>
                        </div>
                        {item.isCustomBowl && item.customIngredients && (
                          <div className={styles.itemCustomDetails} style={{ paddingLeft: '24px', fontSize: '0.8rem', color: 'var(--espresso-soft)' }}>
                            {Object.entries(item.customIngredients).map(([key, vals]) => {
                              if (!vals || vals.length === 0) return null;
                              return <div key={key}><strong>{key}:</strong> {vals.join(', ')}</div>;
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {(order.status === 'accepted' || order.status === 'prepared') && order.acceptedAt && order.estimatedPrepTime && (
                    <PrepTimer acceptedAt={order.acceptedAt} estimatedPrepTime={order.estimatedPrepTime} />
                  )}

                  <div className={styles.cardFooter}>
                    <div className={styles.total}>₹{order.totalAmount}</div>
                    
                    <div className={styles.actions}>
                      {order.cancelRequest?.status === 'pending' ? (
                        <span className={styles.cancelPendingBadge}>Cancel Pending Approval</span>
                      ) : (
                        <>
                          <button
                            className={styles.secondaryAction}
                            onClick={() => window.open(`/receipt/${order._id}`, '_blank')}
                          >
                            Print Receipt
                          </button>
                          
                          {STATUS_FLOW[order.status] && (
                            <button 
                              className={styles.primaryAction}
                              onClick={() => handleUpdateStatusClick(order)}
                            >
                              {STATUS_FLOW[order.status].label}
                            </button>
                          )}
                          
                          {order.status !== 'handed_to_partner' && order.status !== 'cancelled' && (
                            <button 
                              className={styles.secondaryAction}
                              onClick={() => {
                                setCancelOrder(order);
                                setCancelModalOpen(true);
                              }}
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Cancel Request Modal */}
      <AnimatePresence>
        {cancelModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <h3>Request Order Cancellation</h3>
              <p>{cancelOrder?.orderNumber ? `Order ${cancelOrder.orderNumber}` : `Order #${cancelOrder?._id.slice(-6)}`} - {cancelOrder?.customerName}</p>
              
              <form onSubmit={submitCancelRequest} className={styles.modalForm}>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Reason for cancellation (e.g. Item out of stock)"
                  className={styles.textarea}
                  required
                />
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setCancelModalOpen(false)} className={styles.btnCancel}>Keep Order</button>
                  <button type="submit" className={styles.btnSubmit}>Request Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Prep Time Modal */}
      <AnimatePresence>
        {prepModalOpen && prepOrder && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <h3>Set Preparation Time</h3>
              <p>How many minutes will it take to prepare {prepOrder.orderNumber ? `Order ${prepOrder.orderNumber}` : `Order #${prepOrder._id.slice(-6)}`}?</p>
              
              <form onSubmit={submitPrepTime} className={styles.modalForm}>
                <input
                  type="number"
                  min="1"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="e.g. 15"
                  className={styles.textarea}
                  required
                  autoFocus
                />
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => { setPrepModalOpen(false); setPrepOrder(null); }} className={styles.btnCancel}>Cancel</button>
                  <button type="submit" className={styles.btnSubmit}>Accept Order</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default RestaurantDashboard;
