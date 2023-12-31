const express = require('express');
const router = express.Router();
const UserService = require('./UserService');
const { check, validationResult } = require('express-validator');

router.post(
  '/api/1.0/users',
  check('username')
    .notEmpty()
    .withMessage('Username cannot be null')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('Must have min 4 and max 32 characters'),
  check('email')
    .notEmpty()
    .withMessage('Email cannot be null')
    .bail()
    .isEmail()
    .withMessage('Email is not valid')
    .bail()
    .custom(async (email) => {
      const user = await UserService.findByEmail(email);
      if (user) {
        throw new Error('Email in use');
      }
    }),
  check('password')
    .notEmpty()
    .withMessage('Password cannot be null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .bail()
    .matches(/^(?=.*[Aa-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage(
      'Password must have at least one uppercase, 1 lowercase letter and one number'
    ),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = {};
      errors
        .array()
        .forEach((error) => (validationErrors[error.path] = error.msg));
      return res.status(400).send({ validationErrors: validationErrors });
    }
    try {
      await UserService.save(req.body);
      return res.send({ message: 'User Created' });
    } catch (err) {
      return res.status(502).send({ message: 'Failed to deliver email' });
    }
  }
);

router.post('/api/1.0/users/token/:token', async (req, res) => {
  const token = req.params.token;
  try {
    await UserService.activate(token);
  } catch (err) {
    return res
      .status(400)
      .send({ message: 'Account is either active or token is invalid' });
  }
  res.send({ message: 'Success!' });
});

module.exports = router;
