// middleware/role.js

/**
 * Middleware to check user role
 * @param {string} role - required role (e.g., 'admin', 'driver', 'student')
 */
exports.requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Unauthorized: no user logged in' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ msg: 'Forbidden: insufficient role' });
    }
    next();
  };
};

// Shortcut for admin role
exports.requireAdmin = exports.requireRole('admin');
