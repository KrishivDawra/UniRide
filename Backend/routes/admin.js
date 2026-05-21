const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const adminController = require('../controllers/adminController');

router.use(authMiddleware, requireRole('admin'));

router.get('/users', adminController.listUsers);
router.get('/rides', adminController.listRides);
router.get('/bookings', adminController.listBookings);

router.patch('/user/:id/suspend', adminController.suspendUser);
router.patch('/rides/:id/cancel', adminController.cancelRide);
router.patch('/bookings/:id/cancel', adminController.cancelBooking);
module.exports = router;