const User = require('../models/User');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

// List all users (exclude passwords)
exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// List all rides with driver info
exports.listRides = async (req, res, next) => {
  try {
    const rides = await Ride.find()
      .populate('postedBy', 'name email') // driver info
      .lean(); // converts to plain JS object for easier manipulation

    // Optional: add a driver name field for frontend
    const ridesWithDriverName = rides.map(r => ({
      ...r,
      postedByName: r.postedBy?.name || 'Unknown'
    }));

    res.json(ridesWithDriverName);
  } catch (err) {
    next(err);
  }
};

// List all bookings with user and ride info
exports.listBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('ride', 'from to time vehicleType seatBreakdown availableSeats status')
      .lean();

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

// Suspend a user
exports.suspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.suspended = true;
    await user.save();

    res.json({ msg: 'User suspended', user });
  } catch (err) {
    next(err);
  }
};
exports.cancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    ride.status = 'cancelled';
    await ride.save();

    await Booking.updateMany(
      { ride: ride._id, status: 'booked' },
      { $set: { status: 'cancelled' } }
    );

    res.json({
      msg: 'Ride cancelled by admin',
      ride
    });
  } catch (err) {
    next(err);
  }
};
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ msg: 'Booking already cancelled' });
    }

    const ride = await Ride.findById(booking.ride._id);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found for this booking' });
    }

    booking.status = 'cancelled';
    await booking.save();

    ride.seatBreakdown.forEach(seat => {
      if (booking.seats.includes(seat.seatId)) {
        seat.available = true;
      }
    });

    if (ride.status === 'full') {
      ride.status = 'open';
    }

    await ride.save();

    res.json({
      msg: 'Booking cancelled by admin',
      booking
    });
  } catch (err) {
    next(err);
  }
};