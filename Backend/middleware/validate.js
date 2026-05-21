const { validationResult } = require('express-validator');

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      msg: errors.array()[0].msg,
      errors: errors.array()
    });
  }

  next();
};