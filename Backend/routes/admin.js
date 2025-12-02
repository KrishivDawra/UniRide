const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/role'); // <-- make sure this exists
const adminController = require('../controllers/adminController');

// Use middleware
router.use(authMiddleware, requireRole('admin'));

router.get('/users', adminController.listUsers);
router.get('/rides', adminController.listRides);
router.get('/bookings', adminController.listBookings);
router.patch('/user/:id/suspend', adminController.suspendUser);

module.exports = router;
