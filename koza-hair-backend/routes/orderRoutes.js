// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById); // Add this line
router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;