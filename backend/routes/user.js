const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.post('/submit-rating', auth, userCtrl.submitRating);

module.exports = router;
