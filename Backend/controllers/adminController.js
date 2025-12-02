const User = require('../models/User');
const Ride = require('../models/Ride');
const Booking = require('../models/Booking');

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { next(err); }
};

exports.listRides = async (req, res, next) => {
  try {
    const rides = await Ride.find().populate('postedBy', 'name email');
    res.json(rides);
  } catch (err) { next(err); }
};

exports.listBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('ride', 'from to');
    res.json(bookings);
  } catch (err) { next(err); }
};

exports.suspendUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).json({ msg: 'User not found' });
    user.suspended = true;
    await user.save();
    res.json({ msg: 'User suspended', user });
  } catch(err) { next(err); }
};
