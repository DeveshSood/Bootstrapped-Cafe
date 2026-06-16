const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect, authorize } = require('../middleware/auth');

// Using the same razorpay instance logic as paymentRoutes
const razorpayInstance = process.env.RAZORPAY_KEY_ID ? new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
}) : null;

// POST /api/subscriptions/checkout
// Create a pending subscription and razorpay order
router.post('/checkout', protect, async (req, res) => {
  try {
    const { planName, price, startDate, quantity, durationDays } = req.body;
    
    if (!planName || !price) {
      return res.status(400).json({ message: 'Plan name and price are required' });
    }

    // Default to tomorrow if no start date is provided
    let targetStartDate = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      targetStartDate.setDate(targetStartDate.getDate() + 1);
    }
    targetStartDate.setHours(0, 0, 0, 0);

    const subscription = new Subscription({
      user: req.user._id,
      planName,
      price,
      startDate: targetStartDate,
      quantity: quantity || 1,
      durationDays: durationDays || (planName === 'Corporate Lunch' ? 1 : 30),
      status: 'pending'
    });
    
    await subscription.save();

    if (razorpayInstance) {
      const options = {
        amount: price * 100, // paise
        currency: 'INR',
        receipt: `sub_receipt_${subscription._id}`
      };
      const order = await razorpayInstance.orders.create(options);
      
      subscription.razorpayOrderId = order.id;
      await subscription.save();
      
      res.json({
        subscriptionId: subscription._id,
        amount: order.amount,
        currency: order.currency,
        id: order.id
      });
    } else {
      res.json({
        subscriptionId: subscription._id,
        amount: price * 100,
        currency: 'INR',
        id: null
      });
    }
  } catch (error) {
    console.error('Subscription checkout error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/subscriptions/verify
// Verify payment signature, securely set timestamps, and activate
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionId } = req.body;
    
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

    let isAuthentic = false;

    if (process.env.RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_signature) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      isAuthentic = expectedSignature === razorpay_signature;
    } else if (!process.env.RAZORPAY_KEY_ID) {
      // Demo mode bypass
      isAuthentic = true;
    }

    if (isAuthentic) {
      subscription.status = 'active';
      subscription.razorpayPaymentId = razorpay_payment_id || 'demo_payment';
      
      // Calculate end date exactly based on durationDays
      const endDate = new Date(subscription.startDate);
      endDate.setDate(endDate.getDate() + subscription.durationDays);
      
      subscription.endDate = endDate;

      await subscription.save();
      return res.json({ message: 'Subscription verified and activated successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Subscription verification error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/subscriptions/my
// Get logged-in user's subscriptions
router.get('/my', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/subscriptions/all
// Get all subscriptions for admin/kitchen
router.get('/all', protect, authorize('admin', 'restaurant'), async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/subscriptions/:id/cancel
// Cancel a subscription (sets status to cancelled but keeps endDate)
router.post('/:id/cancel', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    subscription.status = 'cancelled';
    await subscription.save();
    
    res.json({ message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/subscriptions/:id/pause
router.post('/:id/pause', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    if (subscription.status !== 'active' || subscription.paused) {
      return res.status(400).json({ message: 'Cannot pause this subscription' });
    }

    const now = new Date();
    const remainingTime = subscription.endDate.getTime() - now.getTime();
    const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 3600 * 24)));

    subscription.paused = true;
    subscription.pauseDate = now;
    subscription.remainingDays = remainingDays;
    await subscription.save();

    res.json({ message: 'Subscription paused' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/subscriptions/:id/resume
router.post('/:id/resume', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ _id: req.params.id, user: req.user._id });
    if (!subscription) return res.status(404).json({ message: 'Subscription not found' });
    if (subscription.status !== 'active' || !subscription.paused) {
      return res.status(400).json({ message: 'Subscription is not paused' });
    }

    const now = new Date();
    subscription.paused = false;
    
    // Extend the end date by the remaining days
    const newEndDate = new Date(now);
    newEndDate.setDate(newEndDate.getDate() + (subscription.remainingDays || 0));
    subscription.endDate = newEndDate;
    
    subscription.pauseDate = null;
    subscription.remainingDays = null;
    await subscription.save();

    res.json({ message: 'Subscription resumed', endDate: subscription.endDate });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
