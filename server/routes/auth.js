const express = require('express');
const { body } = require('express-validator'); // Validates req.body fields
const authController = require('../controllers/auth');
const validationHandler = require('../middlewares/validationHandler');

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email') // Check if provided entry satisfies the email construct
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          // If user already exists in the database, reject the email input
          if (userDoc) {
            return Promise.reject('Email already exists');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ], // Input Validation
  validationHandler,
  authController.signup
);

module.exports = router;
