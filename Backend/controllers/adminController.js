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