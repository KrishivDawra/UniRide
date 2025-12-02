const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  
  ride: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ride', 
    required: true 
  },

  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  // multiple seat support
  seats: { 
    type: [String], 
    default: [] 
  },

  seatsBooked: { 
    type: Number, 
    default: 1 
  },

  amount: { 
    type: Number, 
    required: true 
  },

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  paymentStatus: { 
    type: String, 
    enum: ['pending','paid','failed'], 
    default: 'pending' 
  },

  transactionId: { 
    type: String, 
    default: null 
  },

  status: { 
    type: String, 
    enum: ['booked','cancelled','completed'], 
    default: 'booked' 
  },

  cancellationReason: { 
    type: String, 
    default: null 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Auto-fill driver from ride
bookingSchema.pre("save", async function(next) {
  if (!this.driver) {
    const Ride = mongoose.model("Ride");
    const ride = await Ride.findById(this.ride).select("postedBy");
    this.driver = ride?.postedBy;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
