const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  durationDays: {
    type: Number,
    default: 30 // defaults to 30 for monthly plans
  },
  durationHours: {
    type: Number
  },
  isHourly: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'cancelled', 'expired'],
    default: 'pending'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  paused: {
    type: Boolean,
    default: false
  },
  pauseDate: {
    type: Date
  },
  remainingDays: {
    type: Number
  },
  totalMeals: {
    type: Number
  },
  mealsRemaining: {
    type: Number
  },
  activeTicket: {
    ticketId: String,
    mealType: String,
    createdAt: Date,
    expiresAt: Date
  },
  redemptions: [{
    date: Date,
    mealType: String
  }],
  razorpayOrderId: {
    type: String
  },
  razorpayPaymentId: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
