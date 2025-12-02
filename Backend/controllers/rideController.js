const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

/**
 * @desc Create a new ride (Driver only)
 */
exports.createRide = async (req, res, next) => {
  try {
    const { from, to, time, vehicleType, seats, seatPrice, pickupGeo, dropGeo } = req.body;

    // Build seatBreakdown array automatically
    const seatBreakdown = [];
    for (let i = 1; i <= seats; i++) {
      seatBreakdown.push({ seatId: `A${i}`, price: seatPrice, available: true });
    }

    const ride = new Ride({
      postedBy: req.user.id,
      from,
      to,
      time,
      vehicleType: vehicleType || 'car',
      seats,
      seatPrice,
      seatBreakdown,
      pickupGeo,
      dropGeo,
      availableSeats: seats
    });

    await ride.save();
    res.status(201).json({ msg: 'Ride created successfully', ride });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc List/search rides
 * Optional query params: from, to, date
 */
exports.listRides = async (req, res, next) => {
  try {
    const { from, to, date } = req.query;
    const query = { status: 'open' };

    if (from) query.from = { $regex: from, $options: 'i' };
    if (to) query.to = { $regex: to, $options: 'i' };
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.time = { $gte: start, $lt: end };
    }

    const rides = await Ride.find(query)
      .populate('postedBy', 'name email role mobile')
      .sort({ time: 1 });

    res.json(rides);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get ride details by ID
 */
exports.getRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('postedBy', 'name email role mobile')
      .populate('bookings');

    if (!ride) return res.status(404).json({ msg: 'Ride not found' });

    res.json(ride);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Cancel a ride (Driver only)
 */
exports.cancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) return res.status(404).json({ msg: 'Ride not found' });
    if (ride.postedBy.toString() !== req.user.id)
      return res.status(403).json({ msg: 'Not authorized to cancel this ride' });

    ride.status = 'cancelled';
    await ride.save();

    // Optionally cancel all bookings
    await Booking.updateMany(
      { ride: ride._id, status: 'booked' },
      { $set: { status: 'cancelled' } }
    );

    res.json({ msg: 'Ride cancelled successfully', ride });
  } catch (err) {
    next(err);
  }
};
