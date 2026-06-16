const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// POST /api/payment/create-order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

// POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId, // Receive the backend order ID from the frontend
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update existing order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentId = razorpay_payment_id;
    order.razorpayOrderId = razorpay_order_id;
    
    // Advance status to payment_confirmed to indicate payment success
    order.paymentStatus = 'completed';
    order.status = 'payment_confirmed';
    order.statusHistory.push({
      status: 'payment_confirmed',
      timestamp: new Date(),
      note: 'Payment successful',
    });

    await order.save();

    // Broadcast to SSE clients (e.g. restaurant dashboard)
    const { broadcastOrderUpdate } = require('./sseController');
    broadcastOrderUpdate(order._id.toString(), {
      type: 'status_update',
      orderId: order._id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      statusHistory: order.statusHistory,
    });

    res.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};
