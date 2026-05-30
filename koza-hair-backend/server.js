const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // JWT for Authentication
const bcrypt = require('bcryptjs'); // For securely hashing passwords
require('dotenv').config();

// Cloudinary Imports
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
// 2. DATABASE SCHEMAS & MODELS
// ==========================================

// --- Admin Schema ---
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['superadmin', 'manager', 'editor'], 
        default: 'editor' 
    }
}, { timestamps: true });
const Admin = mongoose.model('Admin', adminSchema);

// --- Customer User Schema (NEW) ---
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: { type: Array, default: [] } // Stores liked product IDs
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// --- Product Schema ---
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: String,
    bottleSize: { type: String, default: '' },
    stockAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }, // Controls visibility on main site
    reviews: { type: Array, default: [] } // Stores customer reviews (NEW)
});
const Product = mongoose.model('Product', productSchema);

// --- Order Schema ---
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
// 3. MONGODB CONNECTION & INITIALIZATION
// ==========================================
if (!process.env.MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
    process.exit(1); 
}

// Setup initial Superadmin if database is empty
const initializeAdmin = async () => {
    try {
        const count = await Admin.countDocuments();
        if (count === 0 && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
            await Admin.create({
                name: 'Master Admin',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: 'superadmin'
            });
            console.log('✅ Default Superadmin created from .env credentials');
        }
    } catch (error) {
        console.error('❌ Error initializing default admin:', error);
    }
};

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Successfully connected to MongoDB Atlas!');
        await initializeAdmin(); // Run initialization after successful connection
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));


// ==========================================
// 4. EMAILJS SERVICE LOGIC (NEW)
// ==========================================

const sendEmailJS = async (templateParams) => {
    // Check if EmailJS keys exist in environment
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY || !process.env.EMAILJS_PRIVATE_KEY) {
        console.log("⚠️ Skipping EmailJS: Missing environment variables.");
        return;
    }

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: templateParams
            })
        });

        if (response.ok) {
            console.log(`✅ EmailJS sent successfully to ${templateParams.to_email}`);
        } else {
            const errorText = await response.text();
            console.error('❌ EmailJS API Error:', errorText);
        }
    } catch (error) {
        console.error('❌ Failed to trigger EmailJS API:', error);
    }
};

const sendStatusEmail = async (order, status) => {
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

    // Trigger EmailJS
    await sendEmailJS({
        to_email: order.customer.email,
        subject: subjects[status] || `Update on your Order`,
        html_message: fullHtml
    });
};

// ==========================================
// 5. SECURITY & ROLE MIDDLEWARES (JWT)
// ==========================================

// Middleware for Admins
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Contains id, email, and role
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

// Middleware for Regular Customers
const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains id and email
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

// Middleware to check required Admin roles
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.admin || !allowedRoles.includes(req.admin.role)) {
            return res.status(403).json({ 
                message: `Forbidden: Your role (${req.admin.role}) does not have permission to perform this action.` 
            });
        }
        next();
    };
};

// ==========================================
// 6. API ROUTES
// ==========================================

// --- Admin Auth & Management Routes ---
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );
        res.status(200).json({ status: 'success', token: token, role: admin.role, name: admin.name });
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
});

app.post('/api/admin/register', verifyAdmin, authorizeRoles('superadmin'), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Email already in use." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({ name, email, password: hashedPassword, role });
        await newAdmin.save();

        res.status(201).json({ status: 'success', message: 'Admin registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: "Failed to register admin", error: error.message });
    }
});

// --- Customer Auth Routes ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ token, user: { id: newUser._id, email: newUser.email, wishlist: newUser.wishlist } });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(200).json({ token, user: { id: user._id, email: user.email, wishlist: user.wishlist } });
    } catch (error) {
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
});

// CUSTOMER: Update their Wishlist in the database
app.put('/api/users/wishlist', verifyUser, async (req, res) => {
    try {
        const { wishlist } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            { wishlist: wishlist }, 
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Wishlist saved successfully", wishlist: updatedUser.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Failed to update wishlist", error: error.message });
    }
});

// --- Product Routes ---
app.get('/api/products', async (req, res) => { 
    try {
        const products = await Product.find({});
        res.status(200).json({ status: 'success', data: { products } });
    } catch (error) { 
        res.status(500).json({ message: "Failed to fetch products" }); 
    }
});

app.post('/api/products', verifyAdmin, authorizeRoles('superadmin', 'manager'), upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, bottleSize, stockAmount, isActive } = req.body;
        const imagePath = req.file ? req.file.path : '';
        
        const newProduct = new Product({ 
            name, 
            price, 
            description, 
            bottleSize: bottleSize || '',
            stockAmount: parseInt(stockAmount) || 0,
            image: imagePath,
            isActive: isActive === 'false' || isActive === false ? false : true
        });
        
        await newProduct.save();
        res.status(201).json({ status: 'success', data: { product: newProduct } });
    } catch (error) { 
        res.status(400).json({ message: "Failed to create product", error: error.message }); 
    }
});

app.put('/api/products/:id', verifyAdmin, authorizeRoles('superadmin', 'manager'), upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, bottleSize, stockAmount, isActive } = req.body;
        
        let updateData = { 
            name, 
            price, 
            description,
            bottleSize,
            stockAmount: parseInt(stockAmount) || 0,
            isActive: isActive === 'false' || isActive === false ? false : true
        };
        
        if (req.file) updateData.image = req.file.path;
        
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ status: 'success', data: { product: updatedProduct } });
    } catch (error) { 
        res.status(400).json({ message: "Failed to update product", error: error.message }); 
    }
});

app.delete('/api/products/:id', verifyAdmin, authorizeRoles('superadmin'), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json({ status: 'success', data: null });
    } catch (error) { 
        res.status(400).json({ message: "Failed to delete product", error: error.message }); 
    }
});

// CUSTOMER: Leave a review for a product
app.post('/api/products/:id/reviews', verifyUser, async (req, res) => {
    try {
        const { rating, text } = req.body;
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const review = {
            userName: req.user.email.split('@')[0],
            rating: Number(rating),
            text,
            date: new Date()
        };

        product.reviews.push(review);
        await product.save();

        res.status(201).json({ message: 'Review added', reviews: product.reviews });
    } catch (error) {
        res.status(500).json({ message: "Failed to add review", error: error.message });
    }
});

// --- Order Routes ---

app.get('/api/orders/my-orders', verifyUser, async (req, res) => {
    try {
        const orders = await Order.find({ "customer.email": req.user.email }).sort({ date: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch your orders" });
    }
});

app.get('/api/orders', verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ date: -1 });
        const formattedOrders = orders.map(o => ({
            id: o._id, 
            reference: o.reference,
            customer: o.customer, 
            cart: o.cart,
            total: o.total, 
            status: o.status, 
            date: o.date
        }));
        res.status(200).json({ data: { orders: formattedOrders } });
    } catch (error) { 
        res.status(500).json({ message: "Failed to fetch orders" }); 
    }
});

app.patch('/api/orders/:id/status', verifyAdmin, authorizeRoles('superadmin', 'manager'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        
        sendStatusEmail(updatedOrder, status);
        
        res.json({ status: 'success', order: { ...updatedOrder.toObject(), id: updatedOrder._id } });
    } catch (error) { 
        res.status(500).json({ message: "Failed to update order status", error: error.message }); 
    }
});

app.post('/api/payments/verify', async (req, res) => {
    try {
        const { reference, cart, customer } = req.body;
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const newOrder = new Order({ reference, customer, cart, total, status: 'Processing' });
        const savedOrder = await newOrder.save();
        
        // Notify Customer
        sendStatusEmail(savedOrder, 'Processing');
        
        // Notify Admin
        if (process.env.ADMIN_EMAIL) {
            const adminHtml = `
                <div style="font-family: sans-serif; color: #191970;">
                    <h2 style="color: #D4AF37;">New Order Received!</h2>
                    <p>You just received a new order on OpevickyScents.</p>
                    
                    <h3>Customer Details:</h3>
                    <p><strong>Name:</strong> ${customer.name}</p>
                    <p><strong>Email:</strong> ${customer.email}</p>
                    <p><strong>Phone:</strong> ${customer.phone}</p>
                    <p><strong>Address:</strong> ${customer.address}, ${customer.city}, ${customer.state}</p>
                    
                    <h3>Order Items:</h3>
                    <ul>
                        ${cart.map(item => `<li><strong>${item.quantity}x</strong> ${item.name}</li>`).join('')}
                    </ul>
                    <p><strong>Total:</strong> ${total}</p>
                    
                    <hr style="border: 1px solid #eee; margin: 20px 0;" />
                    <p>Log in to your Admin Panel to view full details and process the shipment.</p>
                </div>
            `;

            // Trigger EmailJS for Admin Alert
            await sendEmailJS({
                to_email: process.env.ADMIN_EMAIL,
                subject: `🚨 New Order Alert! from ${customer.name}`,
                html_message: adminHtml
            });
        }
        
        res.status(200).json({ status: 'success', message: 'Order saved successfully!', order: savedOrder });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ status: 'fail', message: 'Order already processed.' });
        res.status(500).json({ status: 'fail', message: 'Failed to save order.' });
    }
});

app.listen(PORT, async () => {
    console.log(`\n--- OpevickyScents Backend ---`);
    console.log(`Server running on http://localhost:${PORT}`);
});