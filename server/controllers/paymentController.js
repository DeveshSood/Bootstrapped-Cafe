const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});


exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
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


exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;


    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }


    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentId = razorpay_payment_id;
    order.razorpayOrderId = razorpay_order_id;
    

    order.paymentStatus = 'completed';
    order.status = 'payment_confirmed';
    order.statusHistory.push({
      status: 'payment_confirmed',
      timestamp: new Date(),
      note: 'Payment successful',
    });

    await order.save();


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


exports.failPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only fail orders that are still pending payment
    if (order.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Order payment is not pending' });
    }

    order.paymentStatus = 'failed';
    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: 'Payment failed or dismissed by customer',
    });

    await order.save();

    const { broadcastOrderUpdate } = require('./sseController');
    broadcastOrderUpdate(order._id.toString(), {
      type: 'status_update',
      orderId: order._id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      statusHistory: order.statusHistory,
    });

    res.json({ success: true, message: 'Order cancelled due to payment failure' });
  } catch (error) {
    console.error('Payment failure handling error:', error);
    res.status(500).json({ message: 'Failed to handle payment failure' });
  }
};

