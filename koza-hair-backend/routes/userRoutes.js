// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Auth routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Wishlist routes
router.get('/:userId/wishlist', userController.getWishlist);
router.post('/:userId/wishlist', userController.addToWishlist);
router.delete('/:userId/wishlist/:productId', userController.removeFromWishlist);

module.exports = router;
