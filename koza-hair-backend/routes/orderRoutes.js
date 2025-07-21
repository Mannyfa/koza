// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.put('/:id/status', orderController.updateOrderStatus); // Add this line

module.exports = router;
