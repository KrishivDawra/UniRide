const Booking = require('../models/Booking');
const Ride = require('../models/Ride');

/**
 * @desc Create booking
 * @access Private - Student
 */
exports.createBooking = async (req, res, next) => {
  try {
    const { rideId, seats } = req.body;

    if (!rideId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ msg: 'Please provide rideId and seats to book' });
    }

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    if (ride.status !== 'open') {
      return res.status(400).json({ msg: 'Ride is not open for booking' });
    }

    if (ride.postedBy.toString() === req.user.id) {
      return res.status(400).json({ msg: 'You cannot book your own ride' });
    }

    const alreadyBooked = await Booking.findOne({
      ride: rideId,
      user: req.user.id,
      status: { $ne: 'cancelled' }
    });

    if (alreadyBooked) {
      return res.status(400).json({ msg: 'You have already booked this ride' });
    }

    const unavailableSeats = seats.filter(seatId => {
      const seat = ride.seatBreakdown.find(s => s.seatId === seatId);
      return !seat || !seat.available;
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        msg: `Seats not available: ${unavailableSeats.join(', ')}`
      });
    }

    let amount = 0;

    ride.seatBreakdown.forEach(seat => {
      if (seats.includes(seat.seatId)) {
        seat.available = false;
        amount += seat.price || ride.seatPrice || 0;
      }
    });

    const booking = await Booking.create({
      ride: ride._id,
      user: req.user.id,
      driver: ride.postedBy,
      seats,
      seatsBooked: seats.length,
      amount,
      status: 'booked',
      paymentStatus: 'pending'
    });

    ride.bookings.push(booking._id);

    if (ride.availableSeats <= 0) {
      ride.status = 'full';
    }

    await ride.save();

    res.status(201).json({
      msg: 'Booking created successfully',
      booking
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Cancel booking
 * @access Private - Student
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to cancel this booking' });
    }

    if (booking.status !== 'booked') {
      return res.status(400).json({ msg: 'Booking cannot be cancelled' });
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
      msg: 'Booking cancelled successfully',
      booking
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get bookings of logged-in user
 * @access Private
 */
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('ride', 'from to time vehicleType seatPrice status postedBy pickupGeo dropGeo')
      .populate('driver', 'name email mobile')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get bookings for driver's ride
 * @access Private - Driver
 */
exports.getRideBookings = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ msg: 'Ride not found' });
    }

    if (ride.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    const bookings = await Booking.find({ ride: ride._id })
      .populate('user', 'name email mobile')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};