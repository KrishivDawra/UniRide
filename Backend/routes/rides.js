const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();

const rideController = require('../controllers/rideController');
const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const { runValidation } = require('../middleware/validate');

/**
 * @route POST /api/rides
 * @desc Driver posts a ride
 * @access Private (Driver only)
 */
router.post(
  '/',
  authMiddleware,
  requireRole('driver'),
  [
    body('from').notEmpty().withMessage('Pickup location is required'),
    body('to').notEmpty().withMessage('Drop location is required'),
    body('time').notEmpty().withMessage('Time is required'),
    body('vehicleType')
      .optional()
      .isIn(['car', 'bike', 'auto'])
      .withMessage('Invalid vehicle type'),
    body('seats').isInt({ min: 1 }).withMessage('Seats must be at least 1'),
    body('seatPrice').isNumeric().withMessage('Seat price must be a number'),
    body('pickupGeo.coordinates')
      .isArray({ min: 2, max: 2 })
      .withMessage('Pickup coordinates required [lng, lat]'),
    body('dropGeo.coordinates')
      .isArray({ min: 2, max: 2 })
      .withMessage('Drop coordinates required [lng, lat]')
  ],
  runValidation,
  rideController.createRide
);

/**
 * @route GET /api/rides
 * @desc List/search rides (filter by from/to/date/geo)
 * @access Public
 */
router.get('/', rideController.listRides);

/**
 * @route GET /api/rides/:id
 * @desc Get ride details
 * @access Public
 */
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid ride ID'),
  runValidation,
  rideController.getRide
);

/**
 * @route PATCH /api/rides/:id/cancel
 * @desc Cancel a ride
 * @access Private (Driver only)
 */
router.patch(
  '/:id/cancel',
  authMiddleware,
  requireRole('driver'),
  param('id').isMongoId().withMessage('Invalid ride ID'),
  runValidation,
  rideController.cancelRide
);

module.exports = router;
