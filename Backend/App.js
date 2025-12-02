const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');
const bookingRoutes = require('./routes/bookings');
const driverRoutes = require('./routes/drivers');
const adminRoutes = require('./routes/admin'); // <-- added admin routes

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/admin', adminRoutes); // <-- admin route

app.get('/', (req, res) => res.json({ msg: 'UniRide API - running' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err); // Log full error for debugging
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Server error' });
});

module.exports = app;
