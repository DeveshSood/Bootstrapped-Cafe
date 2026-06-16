const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRE } = require('../middleware/auth');

// Generate JWT
const signToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });

// Shape user data for response (never leak password)
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  addresses: user.addresses,
  createdAt: user.createdAt,
});

// ─── Register ───────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Login ──────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    res.json({ user: sanitizeUser(user), token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Profile ────────────────────────────────────────
exports.getProfile = async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
};

// ─── Update Profile ─────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (email && email !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase(), _id: { $ne: user._id } });
      if (exists) {
        return res.status(400).json({ message: 'Email already in use by another account' });
      }
      user.email = email;
    }

    await user.save();
    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Add Address ────────────────────────────────────────
exports.addAddress = async (req, res) => {
  try {
    const { label, line1, line2, city, state, pincode, isDefault } = req.body;
    const user = req.user;

    // If this is the first address or isDefault, unset all others
    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach(a => { a.isDefault = false; });
    }

    user.addresses.push({
      label: label || 'Home',
      line1,
      line2: line2 || '',
      city,
      state: state || '',
      pincode,
      isDefault: isDefault || user.addresses.length === 0, // First address auto-default
    });

    await user.save();
    res.status(201).json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Update Address ─────────────────────────────────────
exports.updateAddress = async (req, res) => {
  try {
    const user = req.user;
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    const { label, line1, line2, city, state, pincode } = req.body;
    if (label) addr.label = label;
    if (line1) addr.line1 = line1;
    if (line2 !== undefined) addr.line2 = line2;
    if (city) addr.city = city;
    if (state !== undefined) addr.state = state;
    if (pincode) addr.pincode = pincode;

    await user.save();
    res.json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Delete Address ─────────────────────────────────────
exports.deleteAddress = async (req, res) => {
  try {
    const user = req.user;
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    const wasDefault = addr.isDefault;
    addr.deleteOne();

    // If we removed the default, promote the first remaining
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Set Default Address ────────────────────────────────
exports.setDefaultAddress = async (req, res) => {
  try {
    const user = req.user;
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ message: 'Address not found' });

    user.addresses.forEach(a => { a.isDefault = false; });
    addr.isDefault = true;

    await user.save();
    res.json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Sync Cart (overwrite server cart with client state) ─
exports.syncCart = async (req, res) => {
  try {
    const { cart } = req.body;
    req.user.cart = cart || [];
    await req.user.save();
    res.json({ cart: req.user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Get Cart ───────────────────────────────────────────
exports.getCart = async (req, res) => {
  res.json({ cart: req.user.cart || [] });
};
