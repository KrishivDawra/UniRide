const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const bookingController = require('../controllers/bookingController');

// Book seats
router.post('/', authMiddleware, bookingController.createBooking);

// Cancel booking
router.patch('/:id/cancel', authMiddleware, bookingController.cancelBooking);

// User bookings
router.get('/user', authMiddleware, bookingController.getUserBookings);

// Ride bookings (Driver)
router.get('/ride/:rideId', authMiddleware, requireRole('driver'), bookingController.getRideBookings);

module.exports = router;
