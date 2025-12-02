const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI not defined in .env');

  await mongoose.connect(uri, {
    // options not needed with Mongoose 7+
  });
  console.log('MongoDB connected');
};

module.exports = connectDB;