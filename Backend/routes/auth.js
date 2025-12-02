const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { runValidation } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
  ],
  runValidation,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists()
  ],
  runValidation,
  login
);

router.get('/me', authMiddleware, me);

module.exports = router;
