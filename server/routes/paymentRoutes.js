const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, failPayment } = require('../controllers/paymentController');

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.post('/fail', failPayment);

module.exports = router;
