const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT Helper
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// --- AUTH ROUTES ---
router.post('/auth/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const userExists = await User.findOne({ email });
        
        if (userExists) return res.status(400).json({ message: 'User already exists' });
        
        const user = await User.create({ email, password, name });
        res.status(201).json({
            _id: user._id, email: user.email, name: user.name, wishlist: user.wishlist,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id, email: user.email, name: user.name, wishlist: user.wishlist,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- ORDER ROUTES ---
router.get('/orders/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update your existing payment verification to actually save the order
router.post('/payments/verify', protect, async (req, res) => {
    try {
        const { reference, cart, customer } = req.body;
        
        // 1. Verify Paystack reference here via Paystack API (Recommended)
        
        // 2. Save the order to DB
        const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        
        const newOrder = await Order.create({
            user: req.user._id,
            paymentReference: reference,
            items: cart.map(item => ({
                product: item.id, name: item.name, price: item.price, quantity: item.quantity, image: item.image
            })),
            totalAmount,
            shippingAddress: { address: customer.address, city: customer.city, state: customer.state, phone: customer.phone }
        });

        // 3. Optional: Decrease product stock levels here

        res.status(201).json({ status: 'success', order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- REVIEW ROUTES ---
router.post('/products/:id/reviews', protect, async (req, res) => {
    try {
        const { rating, text } = req.body;
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Optional Backend Check: Did the user actually buy this?
        const hasBought = await Order.findOne({ user: req.user._id, 'items.product': product._id });
        if (!hasBought) return res.status(400).json({ message: 'You must purchase this product to leave a review' });

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) return res.status(400).json({ message: 'Product already reviewed' });

        const review = {
            user: req.user._id,
            userName: req.user.email.split('@')[0], // Or use req.user.name
            rating: Number(rating),
            text
        };

        product.reviews.push(review);
        await product.save();

        res.status(201).json({ message: 'Review added', reviews: product.reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;