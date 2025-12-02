// seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const connectDB = require('./config/db');

connectDB().then(async () => {
  const existing = await User.findOne({ email: 'admin@uniride.com' });
  if (existing) return console.log('Admin already exists');

  const hash = await bcrypt.hash('Admin123', 10);
  const admin = new User({
    name: 'Admin',
    email: 'admin@uniride.com',
    password: hash,
    role: 'admin',
    verified: true
  });

  await admin.save();
  console.log('Admin created');
  process.exit();
});
