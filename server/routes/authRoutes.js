const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  syncCart,
  getCart,
} = require('../controllers/authController');

// Public
router.post('/register', register);
router.post('/login', login);

// Protected — require valid JWT
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Addresses
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.put('/addresses/:addressId/default', protect, setDefaultAddress);

// Cart sync
router.get('/cart', protect, getCart);
router.put('/cart', protect, syncCart);

module.exports = router;
