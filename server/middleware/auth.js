const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'bootstrap-cafe-secret-key-change-in-prod';
const JWT_EXPIRE = '7d';

/**
 * protect — Verifies JWT from Authorization header.
 * Attaches full user doc (minus password) to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized — token invalid' });
  }
};

/**
 * authorize — Restrict access to specific roles.
 * Usage: authorize('restaurant', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user?.role}' is not authorized for this action`,
      });
    }
    next();
  };
};

/**
 * optionalAuth — Same as protect but doesn't fail if no token.
 * If token present and valid, attaches req.user. Otherwise continues.
 * Useful for routes that behave differently for logged-in vs anonymous users.
 */
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (_) {
      // Token invalid — just continue as anonymous
    }
  }
  next();
};

module.exports = { protect, authorize, optionalAuth, JWT_SECRET, JWT_EXPIRE };
