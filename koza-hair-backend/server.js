const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // JWT for Admin Authentication
require('dotenv').config();

// 👇 ADDED: Cloudinary Imports 👇
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ==========================================
// 1. FILE UPLOAD CONFIGURATION (CLOUDINARY)
// ==========================================

// Configure Cloudinary with your credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'opevickyscents_products', // The folder name in your Cloudinary account
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Allowed image formats
    },
});

const upload = multer({ storage: storage });

// We keep this just in case old images still point to the local server
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 2. MONGODB CONNECTION
// ==========================================
if (!process.env.MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
    process.exit(1); 
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Successfully connected to MongoDB Atlas!'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// ==========================================
// 3. MAILING SERVICE SETUP (NODEMAILER)
// ==========================================
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ==========================================
// 4. DATABASE SCHEMAS & MODELS
// ==========================================
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: String,
    // Added new fields to support frontend updates
    bottleSize: { type: String, default: '' },
    stockAmount: { type: Number, default: 0 }
});
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
    reference: { type: String, required: true, unique: true }, 
    customer: { 
        name: String, email: String, phone: String, address: String, city: String, state: String 
    },
    cart: Array,
    total: Number,
    status: { type: String, default: 'Processing' }, 
    date: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// ==========================================
// 5. MAILING SERVICE LOGIC
// ==========================================
const sendStatusEmail = async (order, status) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("Skipping email: Credentials missing in .env");
        return;
    }

    const shortOrderId = order._id.toString().slice(-6).toUpperCase();
    const subjects = {
        'Processing': `Your OpevickyScents Order #${shortOrderId} is being processed`,
        'Shipped': `Great news! Your OpevickyScents Order #${shortOrderId} has shipped`,
        'Delivered': `Your OpevickyScents Order #${shortOrderId} has been delivered!`
    };
    const messages = {
        'Processing': `We have received your order and our team is currently preparing it.`,
        'Shipped': `Your fragrance is on its way to ${order.customer.address}, ${order.customer.city}!`,
        'Delivered': `Your order has been delivered. We hope you enjoy your new scent!`
    };

    const fullHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #191970;">OpevickyScents</h2>
            <p>Hello ${order.customer.name},</p>
            <p>${messages[status]}</p>
            <div style="background: #f9f9f9; padding: 15px; margin: 20px 0;">
                <p><strong>Order ID:</strong> #${shortOrderId}</p>
                <p><strong>Status:</strong> ${status}</p>
            </div>
            <p>Thank you for shopping with us!</p>
            <p style="font-size: 12px; color: #777;">OpevickyScents - Luxury in every drop.</p>
        </div>
    `;

    const mailOptions = {
        from: `"OpevickyScents" <${process.env.EMAIL_USER}>`, 
        to: order.customer.email, 
        subject: subjects[status] || `Update on your Order`, 
        html: fullHtml, 
    };

    try { 
        await transporter.sendMail(mailOptions); 
        console.log(`✅ Email sent to ${order.customer.email} for status: ${status}`);
    } catch (error) { 
        console.error('❌ Error sending email:', error); 
    }
};

// ==========================================
// 6. SECURITY MIDDLEWARE (JWT)
// ==========================================
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Attach admin details to request
        next(); // Allow them to proceed to the route
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

// ==========================================
// 7. API ROUTES
// ==========================================

// --- Admin Auth Route ---
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // Generate a token valid for 24 hours
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ status: 'success', token: token });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
});

// --- Product Routes ---
// PUBLIC: Get all products
app.get('/api/products', async (req, res) => { 
    try {
        const products = await Product.find({});
        res.status(200).json({ status: 'success', data: { products } });
    } catch (error) { 
        res.status(500).json({ message: "Failed to fetch products" }); 
    }
});

// PROTECTED: Create product (Admin only)
app.post('/api/products', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, bottleSize, stockAmount } = req.body;
        
        // 👇 UPDATED: Cloudinary automatically provides a secure URL in req.file.path
        const imagePath = req.file ? req.file.path : '';
        
        const newProduct = new Product({ 
            name, 
            price, 
            description, 
            bottleSize: bottleSize || '',
            stockAmount: parseInt(stockAmount) || 0,
            image: imagePath 
        });
        
        await newProduct.save();
        res.status(201).json({ status: 'success', data: { product: newProduct } });
    } catch (error) { 
        res.status(400).json({ message: "Failed to create product", error: error.message }); 
    }
});

// PROTECTED: Update product (Admin only)
app.put('/api/products/:id', verifyAdmin, upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, bottleSize, stockAmount } = req.body;
        
        let updateData = { 
            name, 
            price, 
            description,
            bottleSize,
            stockAmount: parseInt(stockAmount) || 0
        };
        
        // 👇 UPDATED: If a new image was uploaded, attach the new Cloudinary URL
        if (req.file) updateData.image = req.file.path;
        
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ status: 'success', data: { product: updatedProduct } });
    } catch (error) { 
        res.status(400).json({ message: "Failed to update product", error: error.message }); 
    }
});

// PROTECTED: Delete product (Admin only)
app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) { 
        res.status(400).json({ message: "Failed to delete product", error: error.message }); 
    }
});

// --- Order Routes ---
// PROTECTED: Get all orders (Admin only)
app.get('/api/orders', verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ date: -1 });
        const formattedOrders = orders.map(o => ({
            id: o._id, customer: o.customer, total: o.total, status: o.status, date: o.date
        }));
        res.status(200).json({ data: { orders: formattedOrders } });
    } catch (error) { 
        res.status(500).json({ message: "Failed to fetch orders" }); 
    }
});

// PROTECTED: Update order status & send email (Admin only)
app.patch('/api/orders/:id/status', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        
        await sendStatusEmail(updatedOrder, status);
        res.json({ status: 'success', order: { ...updatedOrder.toObject(), id: updatedOrder._id } });
    } catch (error) { 
        res.status(500).json({ message: "Failed to update order status", error: error.message }); 
    }
});

// PUBLIC: Customer checkout saves an order
app.post('/api/payments/verify', async (req, res) => {
    try {
        const { reference, cart, customer } = req.body;
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder = new Order({ reference, customer, cart, total, status: 'Processing' });
        const savedOrder = await newOrder.save();
        
        await sendStatusEmail(savedOrder, 'Processing');
        
        res.status(200).json({ status: 'success', message: 'Order saved successfully!' });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ status: 'fail', message: 'Order already processed.' });
        res.status(500).json({ status: 'fail', message: 'Failed to save order.' });
    }
});

app.listen(PORT, async () => {
    console.log(`\n--- OpevickyScents Backend ---`);
    console.log(`Server running on http://localhost:${PORT}`);
});