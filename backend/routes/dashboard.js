const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { dashboard } = require('../controllers/dashboardController');

// This route is protected by the auth middleware
router.get('/', auth, dashboard);

module.exports = router;