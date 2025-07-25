// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /api/payments/verify
router.post('/verify', paymentController.verifyPayment);

module.exports = router;