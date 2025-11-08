const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { nameValidation, addressValidation, emailValidation, passwordValidation } = require('../utils/validators');

router.get('/dashboard', auth, role('ADMIN'), adminCtrl.dashboard);
router.post('/add-user', auth, role('ADMIN'), [ nameValidation, emailValidation, passwordValidation, addressValidation ], adminCtrl.addUser);
router.get('/stores', auth, role('ADMIN'), adminCtrl.listStores);
router.get('/users', auth, role('ADMIN'), adminCtrl.listUsers);
router.get('/user/:id', auth, role('ADMIN'), adminCtrl.viewUserDetails);

module.exports = router;
