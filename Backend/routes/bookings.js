const express = require('express');
const { body, param } = require('express-validator');

const router = express.Router();

const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { runValidation } = require('../middleware/validate');
const bookingController = require('../controllers/bookingController');

// Book seats - Student only
router.post(
  '/',
  authMiddleware,
  requireRole('student'),
  [
    body('rideId').isMongoId().withMessage('Valid rideId is required'),
    body('seats').isArray({ min: 1 }).withMessage('Select at least one seat')
  ],
  runValidation,
  bookingController.createBooking
);

// Cancel booking - Student only
router.patch(
  '/:id/cancel',
  authMiddleware,
  requireRole('student'),
  param('id').isMongoId().withMessage('Invalid booking ID'),
  runValidation,
  bookingController.cancelBooking
);

// Logged-in user bookings
router.get(
  '/user',
  authMiddleware,
  bookingController.getUserBookings
);

// Ride bookings - Driver only
router.get(
  '/ride/:rideId',
  authMiddleware,
  requireRole('driver'),
  param('rideId').isMongoId().withMessage('Invalid ride ID'),
  runValidation,
  bookingController.getRideBookings
);

module.exports = router;