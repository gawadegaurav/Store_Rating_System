const { body } = require('express-validator');

const nameValidation = body('name')
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be between 20 and 60 characters');

const addressValidation = body('address')
  .optional()
  .isLength({ max: 400 })
  .withMessage('Address must be at most 400 characters');

const passwordValidation = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters long')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character');

const emailValidation = body('email').isEmail().withMessage('Invalid email');

module.exports = {
  nameValidation,
  addressValidation,
  passwordValidation,
  emailValidation
};
