const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect private routes using JWT authentication
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header (Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token with secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'expense_tracker_super_secret_jwt_key_2024');

      // Attach user details to request object (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next(); // Proceed to next middleware/controller
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
