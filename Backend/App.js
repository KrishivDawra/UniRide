const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const authRoutes = require('./routes/auth');
const rideRoutes = require('./routes/rides');
const bookingRoutes = require('./routes/bookings');
const driverRoutes = require('./routes/drivers');
const adminRoutes = require('./routes/admin');

const app = express();

/* =========================================
   TRUST PROXY
========================================= */
app.set('trust proxy', 1);

/* =========================================
   SECURITY HEADERS
========================================= */
app.use(helmet());

/* =========================================
   RATE LIMITING
========================================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  message: {
    msg: 'Too many requests, please try again later.'
  }
});

app.use(limiter);

/* =========================================
   CORS
========================================= */
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,PATCH,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* =========================================
   BODY PARSER
========================================= */
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

/* =========================================
   SANITIZE REQUESTS
========================================= */
app.use(mongoSanitize());

/* =========================================
   LOGGER
========================================= */
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* =========================================
   ROUTES
========================================= */
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({
    msg: 'UniRide API running successfully'
  });
});

/* =========================================
   ERROR HANDLER
========================================= */
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(err.status || 500).json({
    msg: err.message || 'Internal Server Error'
  });
});

module.exports = app;