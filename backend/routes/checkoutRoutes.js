const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createCheckoutOrder } = require('./orderRoutes');

// @route   POST /api/checkout
// @desc    Place an order from the checkout screen
// @access  Private
router.post('/', protect, upload.single('paymentSlip'), createCheckoutOrder);

module.exports = router;
