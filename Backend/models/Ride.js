const mongoose = require('mongoose');

// Seat schema
const seatSchema = new mongoose.Schema({
  seatId: { type: String, required: true },   // e.g. "A1", "A2"
  price: { type: Number, required: true },
  available: { type: Boolean, default: true }
}, { _id: false });

const rideSchema = new mongoose.Schema({

  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  from: { type: String, required: true },
  to: { type: String, required: true },

  pickupGeo: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }  // [lng, lat]
  },

  dropGeo: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },

  vehicleType: { 
    type: String, 
    enum: ['car','bike','auto'], 
    default: 'car' 
  },

  seats: { type: Number, required: true }, // total seats
  seatPrice: { type: Number, required: true },

  seatBreakdown: { type: [seatSchema], default: [] },

  availableSeats: { type: Number, default: 0 },

  time: { type: Date, required: true },

  bookings: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  ],

  status: { 
    type: String, 
    enum: ['open','ongoing','completed','cancelled'], 
    default: 'open' 
  },

  // Optional but useful for ML dynamic pricing
  estimatedDistanceKm: Number,
  estimatedDurationMin: Number,

  createdAt: { type: Date, default: Date.now }

});

// Geo Index
rideSchema.index({ pickupGeo: '2dsphere' });

// Auto-calc availableSeats if not set
rideSchema.pre('save', function (next) {
  if (this.seatBreakdown?.length > 0) {
    this.availableSeats = this.seatBreakdown.filter(s => s.available).length;
  }
  next();
});

module.exports = mongoose.model('Ride', rideSchema);
