const Booking = require('../models/Booking');
const Ride = require('../models/Ride');
const sendNotification = require('../utils/sendNotification'); // optional email notifications

/**
 * @desc Create a booking for a ride
 * @access Private (Student)
 */
exports.createBooking = async (req, res, next) => {
  try {
    const { rideId, seats } = req.body;

    if (!rideId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ msg: 'Please provide rideId and seats to book' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });
    if (ride.status !== 'open') return res.status(400).json({ msg: 'Ride is not open for booking' });

    // Check seat availability
    const unavailableSeats = seats.filter(seatId => {
      const seat = ride.seatBreakdown.find(s => s.seatId === seatId);
      return !seat || !seat.available;
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({ msg: `Seats not available: ${unavailableSeats.join(', ')}` });
    }

    // Mark seats as booked
    ride.seatBreakdown.forEach(seat => {
      if (seats.includes(seat.seatId)) seat.available = false;
    });
    ride.availableSeats -= seats.length;
    await ride.save();

    // Calculate total amount
    const amount = seats.reduce((total, seatId) => {
      const seat = ride.seatBreakdown.find(s => s.seatId === seatId);
      return total + (seat ? seat.price : 0);
    }, 0);

    const booking = new Booking({
      ride: ride._id,
      user: req.user.id,
      seats,
      seatsBooked: seats.length,
      amount,
      paymentStatus: 'pending'
    });
    await booking.save();

    // Add booking reference to ride
    ride.bookings.push(booking._id);
    await ride.save();

    // Optional: Send notification to student & driver
    // await sendNotification(req.user.email, 'Booking Confirmed', `You booked seats ${seats.join(', ')} for ride ${ride.from} → ${ride.to}`);

    res.status(201).json({ msg: 'Booking created', booking });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Cancel a booking
 * @access Private (Student)
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('ride');
    if (!booking) return res.status(404).json({ msg: 'Booking not found' });

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to cancel this booking' });
    }

    if (booking.status !== 'booked') {
      return res.status(400).json({ msg: 'Booking cannot be cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Update ride seats
    const ride = await Ride.findById(booking.ride._id);
    ride.seatBreakdown.forEach(seat => {
      if (booking.seats.includes(seat.seatId)) seat.available = true;
    });
    ride.availableSeats += booking.seatsBooked;
    await ride.save();

    // Optional: Send notification
    // await sendNotification(req.user.email, 'Booking Cancelled', `Your booking for ride ${ride.from} → ${ride.to} has been cancelled.`);

    res.json({ msg: 'Booking cancelled', booking });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get all bookings for logged-in user
 * @access Private
 */
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('ride', 'from to time vehicleType seatPrice status')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Get all bookings for a ride (Driver)
 * @access Private (Driver only)
 */
exports.getRideBookings = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.status(404).json({ msg: 'Ride not found' });

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
