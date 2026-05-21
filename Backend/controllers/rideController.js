const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

/**
 * @desc Create a new ride
 * @access Private - Driver
 */
exports.createRide = async (req, res, next) => {
  try {
    const { from, to, time, vehicleType, seats, seatPrice, pickupGeo, dropGeo } = req.body;

    const seatBreakdown = [];

    for (let i = 1; i <= Number(seats); i++) {
      seatBreakdown.push({
        seatId: `A${i}`,
        price: Number(seatPrice),
        available: true
      });
    }

    const ride = await Ride.create({
      postedBy: req.user.id,
      from,
      to,
      time,
      vehicleType: vehicleType || 'car',
      seats: Number(seats),
      seatPrice: Number(seatPrice),
      seatBreakdown,
      pickupGeo,
      dropGeo,
      availableSeats: Number(seats),
      status: 'open'
    });

    res.status(201).json({
      msg: 'Ride created successfully',
      ride
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc List/search open rides
 * @access Public
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

      query.time = {
        $gte: start,
        $lt: end
      };
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
 * @desc Get ride details
 * @access Public
 */
exports.getRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('postedBy', 'name email role mobile')
      .populate({
        path: 'bookings',
        populate: {
          path: 'user',
          select: 'name email mobile'
        }
      });

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    res.json(ride);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get rides created by logged-in driver
 * @access Private - Driver
 */
exports.getMyRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ postedBy: req.user.id })
      .populate('bookings')
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Update ride
 * @access Private - Driver
 */
exports.updateRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    if (ride.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update this ride' });
    }

    if (ride.bookings.length > 0) {
      return res.status(400).json({ msg: 'Cannot edit ride after bookings are made' });
    }

    const allowedFields = ['from', 'to', 'time', 'vehicleType', 'seatPrice', 'pickupGeo', 'dropGeo'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        ride[field] = req.body[field];
      }
    });

    if (req.body.seatPrice !== undefined) {
      ride.seatBreakdown.forEach(seat => {
        seat.price = Number(req.body.seatPrice);
      });
    }

    await ride.save();

    res.json({
      msg: 'Ride updated successfully',
      ride
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Cancel ride
 * @access Private - Driver
 */
exports.cancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    if (ride.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to cancel this ride' });
    }

    ride.status = 'cancelled';
    await ride.save();

    await Booking.updateMany(
      { ride: ride._id, status: 'booked' },
      { $set: { status: 'cancelled' } }
    );

    res.json({
      msg: 'Ride cancelled successfully',
      ride
    });
  } catch (err) {
    next(err);
  }
};