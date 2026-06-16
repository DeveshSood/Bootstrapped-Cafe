import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiGetAllOrders, apiApproveCancellation, apiRejectCancellation, apiDeleteOrder, apiGetOrderStats, apiUpdateSequence } from '../utils/api';
import styles from './AdminDashboard.module.css';

const TABS = ['active', 'all', 'completed', 'cancellations', 'cancelled', 'unpaid', 'deleted', 'subscriptions'];
const ACTIVE_STATUSES = ['pending', 'payment_confirmed', 'accepted', 'prepared', 'packaged', 'out_for_delivery'];

const AdminDashboard = () => {
  const { token, isAdmin } = useAuth();
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  
  // Modals state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteOrderTarget, setDeleteOrderTarget] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  
  const [seqEditMode, setSeqEditMode] = useState(false);
  const [seqEditValue, setSeqEditValue] = useState(0);
  
  // Deleted orders cache
  const [deletedOrders, setDeletedOrders] = useState(null);
  const [loadingDeleted, setLoadingDeleted] = useState(false);

  // Subscriptions cache
  const [subscriptions, setSubscriptions] = useState(null);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);

  const sseRef = useRef(null);

  // Load orders and stats
  useEffect(() => {
    if (!token || !isAdmin) return;
    
    setLoading(true);
    Promise.all([
      apiGetAllOrders(token, { limit: 200 }),
      apiGetOrderStats(token),
      fetch('/api/subscriptions/all', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json())
    ])
      .then(([orderData, statsData, subsData]) => {
        setOrders(orderData.orders);
        setStats(statsData);
        setSubscriptions(subsData);
        setLoading(false);
      })
      .catch(err => {
        toast.error('Failed to load dashboard: ' + err.message);
        setLoading(false);
      });
  }, [token, isAdmin]);

  // Fetch deleted orders when tab is selected
  useEffect(() => {
    if (activeTab === 'deleted' && deletedOrders === null) {
      setLoadingDeleted(true);
      apiGetAllOrders(token, { deleted: 'true', limit: 100 })
        .then(data => {
          setDeletedOrders(data.orders);
          setLoadingDeleted(false);
        })
        .catch(err => {
          toast.error('Failed to load deleted orders: ' + err.message);
          setLoadingDeleted(false);
        });
    }
  }, [activeTab, deletedOrders, token]);

  // SSE for live dashboard updates
  useEffect(() => {
    if (!token || !isAdmin) return;

    const source = new EventSource(`/api/orders/dashboard/stream?token=${token}`);
    sseRef.current = source;

    source.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'new_order') {
          setOrders(prev => [data.order, ...prev]);
          // Increment stats
          setStats(prev => prev ? { ...prev, yearlyOrderCount: prev.yearlyOrderCount + 1, activeCount: prev.activeCount + 1, currentSequence: prev.currentSequence + 1 } : prev);
        } 
        else if (data.type === 'status_update') {
          setOrders(prev => prev.map(o => 
            o._id === data.orderId ? { 
              ...o, 
              status: data.status, 
              statusHistory: data.statusHistory,
              paymentStatus: data.paymentStatus || o.paymentStatus 
            } : o
          ));
        }
        else if (data.type === 'cancel_requested') {
           setOrders(prev => prev.map(o => 
            o._id === data.orderId ? { ...o, cancelRequest: data.cancelRequest } : o
          ));
          toast.warning(`New cancellation request`);
        }
      } catch (_) {}
    };

    return () => source.close();
  }, [token, isAdmin]);

  const handleApproveCancel = async (orderId) => {
    try {
      await apiApproveCancellation(token, orderId);
      toast.success('Cancellation approved');
      setOrders(prev => prev.map(o => 
        o._id === orderId ? { ...o, status: 'cancelled', cancelRequest: { ...o.cancelRequest, status: 'approved' } } : o
      ));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRejectCancel = async (orderId) => {
    try {
      await apiRejectCancellation(token, orderId);
      toast.info('Cancellation rejected');
      setOrders(prev => prev.map(o => 
        o._id === orderId ? { ...o, cancelRequest: { ...o.cancelRequest, status: 'rejected' } } : o
      ));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEditSequence = () => {
    setSeqEditValue(stats?.currentSequence || 0);
    setSeqEditMode(true);
  };

  const handleSeqSubmitInline = async () => {
    const newSeqStr = seqEditValue;
    if (!newSeqStr && newSeqStr !== 0) return setSeqEditMode(false);
    
    const newSeq = parseInt(newSeqStr, 10);
    if (isNaN(newSeq) || newSeq < 0) {
      toast.error('Invalid sequence number');
      return setSeqEditMode(false);
    }

    try {
      await apiUpdateSequence(token, newSeq);
      setStats(prev => prev ? { ...prev, currentSequence: newSeq } : prev);
      toast.success(`Sequence updated to ${newSeq}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSeqEditMode(false);
    }
  };

  const openDeleteModal = (order) => {
    setDeleteOrderTarget(order);
    setDeleteReason('');
    setDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (!deleteReason.trim()) return toast.error('Please provide a reason');

    const orderId = deleteOrderTarget._id;
    setDeletingId(orderId);
    setDeleteModalOpen(false);

    try {
      await apiDeleteOrder(token, orderId, deleteReason);
      
      // Move from active list to deleted list
      setOrders(prev => prev.filter(o => o._id !== orderId));
      if (deletedOrders !== null) {
        setDeletedOrders(prev => [{ ...deleteOrderTarget, isDeleted: true, deletedReason: deleteReason, deletedAt: new Date() }, ...prev]);
      }
      
      toast.success('Order deleted');
      setStats(prev => prev ? { 
        ...prev, 
        yearlyOrderCount: Math.max(0, prev.yearlyOrderCount - 1),
        cancelledCount: prev.cancelledCount + 1 
      } : prev);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
      setDeleteOrderTarget(null);
    }
  };

  if (!isAdmin) return <div className={styles.unauthorized}>Unauthorized</div>;

  // Filter orders based on active tab
  const getDisplayOrders = () => {
    if (activeTab === 'deleted') {
      return (deletedOrders || []).filter(o => filterBySearch(o));
    }
    const filtered = orders.filter(o => filterBySearch(o));
    if (activeTab === 'all') return filtered;
    if (activeTab === 'active') return filtered.filter(o => ACTIVE_STATUSES.includes(o.status));
    if (activeTab === 'completed') return filtered.filter(o => o.status === 'delivered' || o.status === 'cancelled');
    if (activeTab === 'unpaid') return filtered.filter(o => o.paymentStatus !== 'completed' && o.status === 'pending');
    if (activeTab === 'cancellations') return filtered.filter(o => o.cancelRequest?.status === 'pending');
    if (activeTab === 'cancelled') return filtered.filter(o => o.status === 'cancelled');
    return filtered;
  };

  const filterBySearch = (o) => {
    if (activeTab === 'deleted') return true;
    if (activeTab === 'subscriptions') return false; // Handled separately
    
    const term = searchTerm.toLowerCase();
    const oId = (o.orderNumber || o._id.slice(-6)).toLowerCase();
    const name = (o.customerName || '').toLowerCase();
    const phone = (o.customerPhone || '').toLowerCase();
    const date = new Date(o.createdAt).toLocaleDateString().toLowerCase();
    return oId.includes(term) || name.includes(term) || phone.includes(term) || date.includes(term);
  };

  const feedOrders = getDisplayOrders();
  const cancelRequestsCount = orders.filter(o => o.cancelRequest?.status === 'pending').length;

  return (
    <main className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2>Admin Oversight</h2>
        </div>
      </header>

      <div className={styles.content}>
        {/* Stats Row */}
        {stats && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.yearlyOrderCount}</span>
              <span className={styles.statLabel}>Orders in {stats.year}</span>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>
                {seqEditMode ? (
                  <div className={styles.inlineEditGroup}>
                    <span className={styles.hashPrefix}>#</span>
                    <input 
                      autoFocus
                      type="number" 
                      min="0"
                      className={styles.inlineSeqInput} 
                      value={seqEditValue} 
                      onChange={(e) => setSeqEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSeqSubmitInline();
                        if (e.key === 'Escape') setSeqEditMode(false);
                      }}
                    />
                    <button onClick={handleSeqSubmitInline} className={styles.inlineSaveBtn} title="Save">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </button>
                    <button onClick={() => setSeqEditMode(false)} className={styles.inlineCancelBtn} title="Cancel">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ) : (
                  <>
                    #{stats.currentSequence}
                    <button onClick={handleEditSequence} className={styles.editIconBtn} title="Edit sequence" aria-label="Edit sequence">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                  </>
                )}
              </div>
              <span className={styles.statLabel}>Current Sequence</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardActive}`}>
              <span className={styles.statValue}>{stats.activeCount}</span>
              <span className={styles.statLabel}>Active</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardDelivered}`}>
              <span className={styles.statValue}>{stats.deliveredCount}</span>
              <span className={styles.statLabel}>Delivered</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardCancelled}`}>
              <span className={styles.statValue}>{stats.cancelledCount}</span>
              <span className={styles.statLabel}>Cancelled</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardSubscriptions}`}>
              <span className={styles.statValue}>{subscriptions?.filter(s => s.status === 'active').length || 0}</span>
              <span className={styles.statLabel}>Active Subs</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className={styles.loading}>Loading orders...</div>
        ) : (
          <div className={styles.singleColumn}>
            {/* Order Feed */}
            <div className={styles.feedPanel}>
              {/* Feed Header: Title + Search + Tabs */}
              <div className={styles.feedHeader}>
                <h3 className={styles.panelTitle} style={{ margin: 0 }}>Orders Feed</h3>
                <div className={styles.feedControls}>
                  <div className={styles.searchWrapper}>
                    <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Search orders..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.searchInput}
                    />
                  </div>
                  <div className={styles.tabs}>
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'active', label: 'Active' },
                      { key: 'completed', label: 'Completed' },
                      { key: 'unpaid', label: 'Unpaid' },
                      { key: 'cancellations', label: 'Cancellations', badge: cancelRequestsCount },
                      { key: 'cancelled', label: 'Cancelled' },
                      { key: 'deleted', label: 'Deleted' },
                      { key: 'subscriptions', label: 'Subscriptions' },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        className={`${styles.tabBtn} ${activeTab === tab.key ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label}
                        {tab.badge > 0 && <span className={styles.tabBadge}>{tab.badge}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {activeTab !== 'subscriptions' && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {(activeTab === 'deleted' && loadingDeleted) ? (
                      <div className={styles.loading}>Loading deleted orders...</div>
                    ) : activeTab === 'cancellations' ? (
                      <div className={styles.requestList} style={{ marginTop: '1rem' }}>
                        {feedOrders.length === 0 ? (
                          <div className={styles.emptyState}>No pending cancellation requests.</div>
                        ) : (
                          <AnimatePresence>
                            {feedOrders.map(order => (
                              <motion.div 
                                key={order._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={styles.requestCard}
                                style={{ maxWidth: '600px' }}
                              >
                                <div className={styles.reqHeader}>
                                  <span className={styles.reqId}>{order.orderNumber || '#' + order._id.slice(-6)}</span>
                                  <span className={styles.reqAmt}>₹{order.totalAmount}</span>
                                </div>
                                <p className={styles.reqReason}>
                                  <strong>Reason:</strong> {order.cancelRequest.reason}
                                </p>
                                <p className={styles.reqCustomer}>
                                  User: {order.customerName}
                                </p>
                                <div className={styles.reqActions}>
                                  <button onClick={() => handleApproveCancel(order._id)} className={styles.btnApprove}>Approve</button>
                                  <button onClick={() => handleRejectCancel(order._id)} className={styles.btnReject}>Reject</button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        )}
                      </div>
                    ) : (
                      <div className={styles.tableWrapper}>
                        {feedOrders.length === 0 ? (
                          <div className={styles.emptyState}>No orders match your filter.</div>
                        ) : (
                          <table className={styles.table}>
                            <thead>
                              <tr>
                                <th>Order ID</th>
                                <th>Time</th>
                                <th>Customer</th>
                                <th>Total</th>
                                <th>Status</th>
                                {activeTab === 'deleted' && <th>Delete Reason</th>}
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {feedOrders.slice(0, 100).map(order => (
                                <tr key={order._id} className={deletingId === order._id ? styles.rowDeleting : ''}>
                                  <td><span className={styles.tdId}>{order.orderNumber || '#' + order._id.slice(-6)}</span></td>
                                  <td>
                                    {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    {order.deliveredAt && (
                                      <div style={{fontSize: '0.8em', color: '#666', marginTop: '2px'}}>
                                        Del: {new Date(order.deliveredAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </div>
                                    )}
                                    {order.isDeleted && order.deletedAt && (
                                      <div style={{fontSize: '0.8em', color: '#dc3545', marginTop: '2px'}}>
                                        Del'd: {new Date(order.deletedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </div>
                                    )}
                                  </td>
                                  <td>{order.customerName}</td>
                                  <td>₹{order.totalAmount}</td>
                                  <td>
                                    <div className={styles.statusGroup}>
                                      {order.isDeleted ? (
                                        <span className={`${styles.statusPill} ${styles.status_cancelled}`}>DELETED</span>
                                      ) : (
                                        <span className={`${styles.statusPill} ${styles['status_' + order.status]}`}>
                                          {order.status.replace(/_/g, ' ')}
                                        </span>
                                      )}
                                      {order.paymentStatus === 'completed' && (
                                        <span className={styles.paymentBadge}>PAID</span>
                                      )}
                                    </div>

                                  </td>
                                  {activeTab === 'deleted' && (
                                    <td><span style={{ color: '#666', fontSize: '0.85rem' }}>{order.deletedReason}</span></td>
                                  )}
                                  <td>
                                    <div className={styles.actionGroup}>
                                      <button 
                                        onClick={() => window.open(`/receipt/${order._id}`, '_blank')} 
                                        className={styles.actionBtn}
                                        title="View Receipt"
                                      >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                                        </svg>
                                        Receipt
                                      </button>
                                      {activeTab !== 'deleted' && !order.isDeleted && (
                                        <button 
                                          onClick={() => openDeleteModal(order)} 
                                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                          title="Delete Order"
                                          disabled={deletingId === order._id}
                                        >
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'subscriptions' && (
                  <motion.div
                    key="subscriptions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={styles.ordersList}
                  >
                    {loadingSubscriptions ? (
                      <div className={styles.loader}>Loading subscriptions...</div>
                    ) : subscriptions?.length > 0 ? (
                      <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                          <thead>
                            <tr>
                              <th>User</th>
                              <th>Plan</th>
                              <th>Status</th>
                              <th>Price</th>
                              <th>Dates</th>
                            </tr>
                          </thead>
                          <tbody>
                            {subscriptions.map(sub => (
                              <tr key={sub._id}>
                                <td>
                                  <strong>{sub.user?.name || 'Unknown'}</strong><br/>
                                  <span style={{fontSize: '0.8rem', color: 'var(--espresso-muted)'}}>{sub.user?.email}</span>
                                </td>
                                <td>
                                  <strong>{sub.planName}</strong><br/>
                                  <span style={{fontSize: '0.8rem', color: 'var(--espresso-muted)'}}>
                                    {sub.durationDays < 30 ? `Daily Pass (${sub.durationDays} Days)` : 'Monthly'} • Qty: {sub.quantity || 1}
                                  </span>
                                </td>
                                <td>
                                  <span className={`${styles.statusBadge} ${styles['status_' + sub.status]}`}>
                                    {sub.status.toUpperCase()}
                                  </span>
                                </td>
                                <td>₹{sub.price}</td>
                                <td style={{fontSize: '0.85rem'}}>
                                  Start: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}<br/>
                                  End: {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className={styles.emptyState}>No subscriptions found.</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Delete Reason Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className={styles.modalOverlay}>
            <motion.div 
              className={styles.modal}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <h3>Delete Order</h3>
              <p>
                {deleteOrderTarget?.orderNumber ? `Order ${deleteOrderTarget.orderNumber}` : `Order #${deleteOrderTarget?._id.slice(-6)}`} 
                - {deleteOrderTarget?.customerName}
              </p>
              
              <form onSubmit={handleDeleteSubmit} className={styles.modalForm}>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Please provide a reason for deleting this order..."
                  className={styles.textarea}
                  required
                />
                <div className={styles.modalActions}>
                  <button type="button" onClick={() => setDeleteModalOpen(false)} className={styles.btnCancel}>Cancel</button>
                  <button type="submit" className={styles.btnSubmit}>Delete Order</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
};

export default AdminDashboard;
