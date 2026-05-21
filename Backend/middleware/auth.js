const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      msg: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        msg: 'Invalid token',
      });
    }

    if (user.suspended) {
      return res.status(403).json({
        msg: 'Account suspended',
      });
    }

    req.user = user;

    next();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Auth error:', err.message);
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        msg: 'Token expired',
      });
    }

    return res.status(401).json({
      msg: 'Invalid token',
    });
  }
};