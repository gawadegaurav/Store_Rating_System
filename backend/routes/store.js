const express = require('express');
const router = express.Router();
const storeCtrl = require('../controllers/storeController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.get('/', auth, storeCtrl.listAllStores); // anyone logged in can view stores
router.get('/owner/ratings', auth, role('OWNER'), storeCtrl.ownerStoresRatings);

module.exports = router;
