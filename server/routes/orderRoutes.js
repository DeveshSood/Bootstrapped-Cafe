const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const {
  createOrder,
  getOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  requestCancellation,
  approveCancellation,
  rejectCancellation,
  deleteOrder,
  getOrderStats,
  updateSequence,
} = require('../controllers/orderController');
const { subscribeToOrder, subscribeToDashboard } = require('../controllers/sseController');

// SSE streams (no auth required for order tracking — the orderId is the "secret")
router.get('/dashboard/stream', protect, authorize('restaurant', 'admin'), subscribeToDashboard);
router.get('/:id/stream', subscribeToOrder);

// Admin stats & sequence
router.get('/stats', protect, authorize('admin'), getOrderStats);
router.put('/sequence', protect, authorize('admin'), updateSequence);

// User's own orders
router.get('/my', protect, getUserOrders);

// All orders (restaurant/admin)
router.get('/all', protect, authorize('restaurant', 'admin'), getAllOrders);

// CRUD
router.post('/', optionalAuth, createOrder);
router.get('/:id', getOrder);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

// Status management
router.put('/:id/status', protect, authorize('restaurant', 'admin'), updateOrderStatus);
router.post('/:id/cancel-request', protect, authorize('restaurant'), requestCancellation);
router.put('/:id/cancel-approve', protect, authorize('admin'), approveCancellation);
router.put('/:id/cancel-reject', protect, authorize('admin'), rejectCancellation);

module.exports = router;

