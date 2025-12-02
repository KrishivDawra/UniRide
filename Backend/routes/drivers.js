const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { requireRole } = require('../middleware/role');
const driverController = require('../controllers/driverController');

router.post('/register', authMiddleware, driverController.registerDriver);
router.post('/verify/:driverId', authMiddleware, requireRole('admin'), driverController.verifyDriver);

module.exports = router;
