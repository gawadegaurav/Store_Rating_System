const express = require('express');
const router = express.Router();
const { signup, login, updatePassword } = require('../controllers/authController');
const { nameValidation, addressValidation, emailValidation, passwordValidation } = require('../utils/validators');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', [ nameValidation, emailValidation, passwordValidation, addressValidation ], signup);
router.post('/login', login);
router.post('/update-password', authMiddleware, [
  body('oldPassword').exists(),
  body('newPassword').isLength({ min:8, max:16 }).matches(/[A-Z]/).matches(/[^A-Za-z0-9]/)
], updatePassword);

module.exports = router;
