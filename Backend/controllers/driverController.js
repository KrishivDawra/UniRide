const User = require('../models/User');

// register driver with verification status false initially
exports.registerDriver = async (req, res, next) => {
  try {
    // This simply marks a user as driver role and stores any driver-specific details
    const { userId, licenseImage, vehicleNumber } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.role = 'driver';
    user.verified = false; // admin must verify
    // store extra details optionally (left as profileImage or any field)
    if (licenseImage) user.profileImage = licenseImage;
    await user.save();
    res.json({ msg: 'Driver registration submitted', user });
  } catch (err) {
    next(err);
  }
};

// admin verifies driver
exports.verifyDriver = async (req, res, next) => {
  try {
    const { driverId } = req.params;
    const user = await User.findById(driverId);
    if (!user) return res.status(404).json({ msg: 'Driver not found' });
    user.verified = true;
    await user.save();
    res.json({ msg: 'Driver verified', user });
  } catch (err) {
    next(err);
  }
};
