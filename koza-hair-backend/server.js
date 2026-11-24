const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const https = require('https'); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 
require('dotenv').config();
const { OrderError, buildOrderCart, toKobo, verifyPaystackTransaction } = require('./utils/orderPricing');
const { escapeHtml, escapeRegex } = require('./utils/escapeHtml');
const { limits } = require('./utils/rateLimit');
const { LOW_STOCK_THRESHOLD, deductStock, restoreStock } = require('./utils/stock');
const { PRODUCT_CATEGORIES, cleanCategory } = require('./utils/categories');

// Cloudinary Imports
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.set('trust proxy', 1); // Render sits behind a proxy; needed for per-visitor rate limits
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ==========================================
// 1. FILE UPLOAD CONFIGURATION (CLOUDINARY)
// ==========================================

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'opevickyscents_products', 
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], 
    },
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 2. DATABASE SCHEMAS & MODELS
// ==========================================

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

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: { type: Array, default: [] },
    resetCode: { type: String },
    resetCodeExpires: { type: Date },
    resetAttempts: { type: Number, default: 0 } // wrong codes entered; code is wiped after 5
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }, // Legacy primary image
    images: { type: Array, default: [] }, // NEW: Array for multiple images
    description: String,
    bottleSize: { type: String, default: '' },
    stockAmount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }, 
    isOutOfStock: { type: Boolean, default: false }, // Manual "Out of Stock" switch from the admin panel
    category: { type: String, default: '' },
    reviews: { type: Array, default: [] },
    discountPercentage: { type: Number, default: 0 } 
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
    date: { type: Date, default: Date.now },
    stockDeducted: { type: Boolean, default: false }, // stock was taken off when the order was paid
    stockRestored: { type: Boolean, default: false }  // stock was put back because the order was cancelled
});
const Order = mongoose.model('Order', orderSchema);

// ==========================================
// 3. MONGODB CONNECTION & INITIALIZATION
// ==========================================
if (!process.env.MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
    process.exit(1); 
}

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
        await initializeAdmin(); 
    })
    .catch((err) => console.error('❌ MongoDB connection error:', err));


// ==========================================
// 4. EMAILJS SERVICE LOGIC (BULLETPROOF VERSION)
// ==========================================

const sendEmailJS = (templateParams) => {
    return new Promise((resolve) => {
        if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID || !process.env.EMAILJS_PUBLIC_KEY || !process.env.EMAILJS_PRIVATE_KEY) {
            console.log("⚠️ Skipping EmailJS: Missing environment variables in Render.");
            return resolve(); 
        }

        const payload = JSON.stringify({
            service_id: process.env.EMAILJS_SERVICE_ID,
            template_id: process.env.EMAILJS_TEMPLATE_ID,
            user_id: process.env.EMAILJS_PUBLIC_KEY,
            accessToken: process.env.EMAILJS_PRIVATE_KEY,
            template_params: templateParams
        });

        const options = {
            hostname: 'api.emailjs.com',
            path: '/api/v1.0/email/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`✅ EmailJS sent successfully to ${templateParams.to_email}`);
                } else {
                    console.error(`❌ EmailJS API Error (${res.statusCode}):`, data);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error('❌ Failed to trigger EmailJS API:', e.message);
            resolve();
        });

        req.write(payload);
        req.end();
    });
};

const sendStatusEmail = async (order, status) => {
    const shortOrderId = (order._id || order.id || 'ORDER').toString().slice(-6).toUpperCase();
    const orderDate = new Date(order.date || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    let subject = '';
    let bodyContent = '';

    if (status === 'Processing') {
        subject = 'Your Opevicky Order Has Been Received';
        
        // Build the dynamic HTML table rows for the cart items
        const cartHtmlRows = (order.cart || []).map(item => `
            <tr>
                <td style="padding: 15px 10px; border-bottom: 1px solid #333; color: #fff; font-size: 14px; text-align: left;">
                    ${escapeHtml(item.name)} ${item.bottleSize ? `<br><span style="color: #888; font-size: 12px;">(${escapeHtml(item.bottleSize)})</span>` : ''}
                </td>
                <td style="padding: 15px 10px; border-bottom: 1px solid #333; color: #fff; font-size: 14px; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 15px 10px; border-bottom: 1px solid #333; color: #fff; font-size: 14px; text-align: right;">
                    ₦${(item.price * item.quantity).toLocaleString()}
                </td>
            </tr>
        `).join('');

        bodyContent = `
            <p style="color: #aaa; font-size: 15px; margin-bottom: 25px;">Thank you for shopping with Opevicky Scents.</p>
            <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                Hi ${escapeHtml(order.customer.name)},<br><br>
                We’ve received your order and we’re excited to prepare it for you. Your order is currently being processed by our team, and we’ll make sure everything is carefully checked and packaged before it leaves us.
            </p>
            
            <h3 style="color: #D4AF37; margin-top: 0; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ORDER #${shortOrderId}<br>
                <span style="color: #888; font-weight: normal; font-size: 14px; text-transform: none;">Order Date: ${orderDate}</span>
            </h3>
            
            <!-- Receipt Table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 20px; margin-bottom: 25px; width: 100%;">
                <thead>
                    <tr>
                        <th style="text-align: left; padding: 12px 10px; border-bottom: 2px solid #444; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Product</th>
                        <th style="text-align: center; padding: 12px 10px; border-bottom: 2px solid #444; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                        <th style="text-align: right; padding: 12px 10px; border-bottom: 2px solid #444; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${cartHtmlRows}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="text-align: left; padding: 20px 10px 10px 10px; font-weight: bold; color: #aaa; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Total Paid:</td>
                        <td style="text-align: right; padding: 20px 10px 10px 10px; font-weight: bold; color: #D4AF37; font-size: 18px;">₦${order.total.toLocaleString()}</td>
                    </tr>
                </tfoot>
            </table>

            <!-- Shipping Details Block -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
                <h3 style="color: #fff; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px;">Shipping Details</h3>
                <p style="color: #aaa; line-height: 1.6; margin: 0; font-size: 14px;">
                    <strong>${escapeHtml(order.customer.name)}</strong><br>
                    ${escapeHtml(order.customer.address)}<br>
                    ${escapeHtml(order.customer.city)}, ${escapeHtml(order.customer.state)}<br>
                    ${escapeHtml(order.customer.phone)}
                </p>
            </div>

            <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin-top: 35px;">
                We’ll send you another email as soon as your order has been shipped.<br><br>
                Thank you for choosing Opevicky Scents. We truly appreciate your support and can’t wait for your fragrance to get to you.
            </p>
        `;
    } else if (status === 'Shipped') {
        subject = 'Your Opevicky Order Is On Its Way';
        bodyContent = `
            <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                Hi ${escapeHtml(order.customer.name)},<br><br>
                Good news — your Opevicky order has officially left us and is now on its way to you.
            </p>
            <h3 style="color: #D4AF37; margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ORDER #${shortOrderId}
            </h3>
            <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                Your fragrance is making its way to the shipping address provided at checkout. Please keep an eye out for your delivery.<br><br>
                We hope you’re just as excited to receive it as we were to prepare it for you.<br><br>
                Thank you for trusting Opevicky Scents with your fragrance needs. We truly appreciate your order.
            </p>
        `;
    } else if (status === 'Delivered') {
        subject = 'Your Opevicky Order Has Arrived';
        bodyContent = `
            <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                Hi ${escapeHtml(order.customer.name)},<br><br>
                Your Opevicky order has officially been delivered.<br><br>
                We hope your new fragrance brings you exactly the experience you were looking for and becomes a scent you genuinely enjoy.
            </p>
            <h3 style="color: #D4AF37; margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ORDER #${shortOrderId}
            </h3>
            <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                Thank you for choosing Opevicky Scents and for allowing us to be part of your fragrance journey.<br><br>
                If you have a moment after trying your order, we’d love to hear what you think. Your feedback means a lot to us and helps us continue to serve you better.<br><br>
                Enjoy your new scent, and we look forward to welcoming you back soon.
            </p>
        `;
    } else if (status === 'Cancelled') {
        subject = 'Your Opevicky Order Has Been Cancelled';
        bodyContent = `
            <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin-bottom: 25px;">
                Hi ${escapeHtml(order.customer.name)},<br><br>
                Your Opevicky order has been cancelled.
            </p>
            <h3 style="color: #D4AF37; margin-top: 0; margin-bottom: 20px; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                ORDER #${shortOrderId}
            </h3>
            <p style="color: #aaa; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                If you have already paid, our team will contact you about your refund. If you did not request this cancellation or have any questions, please reply to this email or reach us on WhatsApp.<br><br>
                Thank you for choosing Opevicky Scents.
            </p>
        `;
    }

    if (!subject) return; // no email for other statuses

    // The core HTML wrapper structure all emails will use
    const fullHtml = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; background-color: #111111; color: #ffffff; border: 1px solid #222;">
            
            <!-- Header Banner -->
            <div style="background-color: #FAFAFA; padding: 30px 20px; text-align: center;">
                <h1 style="color: #111; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 4px;">Opevicky</h1>
            </div>
            
            <!-- Dynamic Body Content -->
            <div style="padding: 40px 30px;">
                ${bodyContent}
            </div>
            
            <!-- Custom Footer -->
            <div style="text-align: center; padding: 25px; border-top: 1px solid #222; background-color: #0A0A0A;">
                <p style="font-size: 14px; font-weight: bold; color: #D4AF37; margin: 0 0 8px 0;">Opevicky Scents</p>
                <p style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 2px; margin: 0;">Scented perfection timeless impression</p>
            </div>
        </div>
    `;

    await sendEmailJS({
        to_email: order.customer.email,
        subject: subject,
        html_message: fullHtml
    });
};

// ==========================================
// 5. SECURITY & ROLE MIDDLEWARES (JWT)
// ==========================================
const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; 
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

const verifyUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

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
app.post('/api/admin/login', limits.adminLogin, async (req, res) => {
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

app.get('/api/admin/users', verifyAdmin, authorizeRoles('superadmin'), async (req, res) => {
    try {
        const admins = await Admin.find({}).select('-password'); 
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch admins" });
    }
});

app.delete('/api/admin/users/:id', verifyAdmin, authorizeRoles('superadmin'), async (req, res) => {
    try {
        if (req.admin.id === req.params.id) return res.status(400).json({ message: "Cannot delete your own account." });
        await Admin.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Admin removed" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete admin" });
    }
});

// --- Analytics Routes ---
app.get('/api/analytics', verifyAdmin, authorizeRoles('superadmin', 'manager'), async (req, res) => {
    try {
        const allOrders = await Order.find({}).sort({ date: 1 });
        const orders = allOrders.filter((order) => order.status !== 'Cancelled');
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        const salesData = orders.reduce((acc, order) => {
            const date = new Date(order.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            if (!acc[date]) {
                acc[date] = { revenue: 0, ordersCount: 0 };
            }

            acc[date].revenue += order.total || 0;
            acc[date].ordersCount += 1;
            return acc;
        }, {});

        const chartData = Object.keys(salesData).map(date => ({
            date,
            revenue: salesData[date].revenue,
            ordersCount: salesData[date].ordersCount
        }));

        // Orders by status (all orders, including cancelled)
        const statusCounts = allOrders.reduce((acc, order) => {
            const status = order.status || 'Processing';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Best sellers by revenue (cancelled orders excluded)
        const productTotals = new Map();
        for (const order of orders) {
            for (const item of order.cart || []) {
                const key = String(item.product || item.id || item._id || item.name);
                const entry = productTotals.get(key) || { id: key, name: item.name, quantity: 0, revenue: 0 };
                const quantity = Number(item.quantity) || 0;
                entry.quantity += quantity;
                entry.revenue += (Number(item.price) || 0) * quantity;
                productTotals.set(key, entry);
            }
        }
        const topProducts = [...productTotals.values()]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 10);

        // Products running low or switched to out of stock (active products only)
        const products = await Product.find({ isActive: { $ne: false } }).select('name stockAmount isOutOfStock category image images');
        const lowStock = products
            .filter((p) => p.isOutOfStock || (p.stockAmount || 0) <= LOW_STOCK_THRESHOLD)
            .map((p) => ({
                id: p._id,
                name: p.name,
                stockAmount: p.stockAmount || 0,
                isOutOfStock: !!p.isOutOfStock,
                category: p.category || '',
                image: p.image || (p.images && p.images[0]) || '',
            }))
            .sort((a, b) => a.stockAmount - b.stockAmount);

        // Revenue per category, using each product's current category
        const categoryById = new Map(products.map((p) => [String(p._id), p.category || 'Uncategorised']));
        const categoryTotals = {};
        for (const entry of productTotals.values()) {
            const category = categoryById.get(entry.id) || 'Uncategorised';
            categoryTotals[category] = (categoryTotals[category] || 0) + entry.revenue;
        }
        const categoryRevenue = Object.entries(categoryTotals)
            .map(([category, revenue]) => ({ category, revenue }))
            .sort((a, b) => b.revenue - a.revenue);

        res.status(200).json({
            totalRevenue,
            totalOrders: orders.length,
            averageOrderValue: orders.length ? Math.round(totalRevenue / orders.length) : 0,
            chartData,
            statusCounts,
            topProducts,
            lowStock,
            lowStockThreshold: LOW_STOCK_THRESHOLD,
            categoryRevenue,
        });
    } catch (error) {
        console.error('Analytics failed:', error);
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
});

// --- Customer Auth Routes ---
app.post('/api/auth/register', limits.register, async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email already in use." });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ token, email: newUser.email, wishlist: newUser.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration", error: error.message });
    }
});

app.post('/api/auth/login', limits.customerLogin, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(200).json({ token, email: user.email, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
});

app.post('/api/auth/forgot-password', limits.forgotPassword, async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: new RegExp('^' + escapeRegex(String(email || '')) + '$', 'i') });
        if (!user) {
            return res.status(404).json({ message: "No account found with that email address." });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetCode = resetCode;
        user.resetCodeExpires = Date.now() + 15 * 60 * 1000;
        user.resetAttempts = 0; 
        await user.save();

        const htmlMessage = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; text-align: center;">
                <h2 style="color: #191970;">OpevickyScents Password Reset</h2>
                <p>You requested to reset your password. Please use the verification code below:</p>
                <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <h1 style="font-size: 40px; letter-spacing: 8px; color: #D4AF37; margin: 0;">${resetCode}</h1>
                </div>
                <p style="color: #777; font-size: 12px;">This code will expire in 15 minutes. If you did not request this, please ignore this email.</p>
            </div>
        `;

        await sendEmailJS({
            to_email: user.email,
            subject: `Your Password Reset Code: ${resetCode}`,
            html_message: htmlMessage
        });

        res.status(200).json({ message: "Success! Code sent." });
    } catch (error) {
        res.status(500).json({ message: "Error processing request", error: error.message });
    }
});

app.post('/api/auth/reset-password', limits.resetPassword, async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const MAX_RESET_ATTEMPTS = 5;

        if (typeof newPassword !== 'string' || newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        const user = await User.findOne({ email: new RegExp('^' + escapeRegex(String(email || '')) + '$', 'i') });
        const codeIsLive = user && user.resetCode && user.resetCodeExpires && user.resetCodeExpires > Date.now();

        if (!codeIsLive) {
            return res.status(400).json({ message: "Invalid or expired reset code." });
        }

        if (String(code || '').trim() !== user.resetCode) {
            user.resetAttempts = (user.resetAttempts || 0) + 1;
            if (user.resetAttempts >= MAX_RESET_ATTEMPTS) {
                // Too many wrong guesses: wipe the code so it cannot be brute-forced
                user.resetCode = undefined;
                user.resetCodeExpires = undefined;
                user.resetAttempts = 0;
                await user.save();
                return res.status(400).json({ message: "Too many incorrect codes. Please request a new reset code." });
            }
            await user.save();
            const left = MAX_RESET_ATTEMPTS - user.resetAttempts;
            return res.status(400).json({ message: `Invalid reset code. ${left} attempt${left === 1 ? '' : 's'} left.` });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        user.resetCode = undefined;
        user.resetCodeExpires = undefined;
        user.resetAttempts = 0;
        await user.save();

        res.status(200).json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
});

app.put('/api/users/wishlist', verifyUser, async (req, res) => {
    try {
        const { wishlist } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            { wishlist: wishlist }, 
            { returnDocument: 'after' } 
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
app.get('/api/products/categories', (req, res) => {
    res.status(200).json({ categories: PRODUCT_CATEGORIES });
});

app.get('/api/products', async (req, res) => { 
    try {
        const products = await Product.find({});
        res.status(200).json({ status: 'success', data: { products } });
    } catch (error) { 
        res.status(500).json({ message: "Failed to fetch products" }); 
    }
});

// UPDATED: Now accepts an array of up to 5 images
app.post('/api/products', verifyAdmin, authorizeRoles('superadmin', 'manager'), upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, description, bottleSize, stockAmount, isActive, isOutOfStock, discountPercentage, category } = req.body;
        
        const imagePaths = req.files ? req.files.map(file => file.path) : [];
        const primaryImage = imagePaths.length > 0 ? imagePaths[0] : '';
        
        const newProduct = new Product({ 
            name, price, description, 
            bottleSize: bottleSize || '',
            stockAmount: parseInt(stockAmount) || 0,
            discountPercentage: parseInt(discountPercentage) || 0,
            image: primaryImage, 
            images: imagePaths, 
            isActive: isActive === 'false' || isActive === false ? false : true,
            isOutOfStock: isOutOfStock === 'true' || isOutOfStock === true,
            category: cleanCategory(category)
        });
        
        await newProduct.save();
        res.status(201).json({ status: 'success', data: { product: newProduct } });
    } catch (error) { 
        res.status(400).json({ message: "Failed to create product", error: error.message }); 
    }
});

// UPDATED: Now accepts an array of up to 5 images
app.put('/api/products/:id', verifyAdmin, authorizeRoles('superadmin', 'manager'), upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, description, bottleSize, stockAmount, isActive, isOutOfStock, discountPercentage, category } = req.body;
        
        let updateData = { 
            name, price, description, bottleSize,
            stockAmount: parseInt(stockAmount) || 0,
            discountPercentage: parseInt(discountPercentage) || 0,
            isActive: isActive === 'false' || isActive === false ? false : true
        };
        // Only change the switch when the admin panel sends it (older admin builds don't)
        if (isOutOfStock !== undefined) {
            updateData.isOutOfStock = isOutOfStock === 'true' || isOutOfStock === true;
        }
        if (category !== undefined) {
            updateData.category = cleanCategory(category);
        }
        
        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => file.path);
            updateData.images = imagePaths;
            updateData.image = imagePaths[0]; // Set primary image to the first uploaded file
        }
        
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { returnDocument: 'after' });
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
            id: o._id, reference: o.reference, customer: o.customer, cart: o.cart,
            total: o.total, status: o.status, date: o.date
        }));
        res.status(200).json({ data: { orders: formattedOrders } });
    } catch (error) { 
        res.status(500).json({ message: "Failed to fetch orders" }); 
    }
});

const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

app.patch('/api/orders/:id/status', verifyAdmin, authorizeRoles('superadmin', 'manager'), async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!ORDER_STATUSES.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${ORDER_STATUSES.join(', ')}` });
        }

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        const previousStatus = order.status;
        if (previousStatus === status) {
            return res.json({ status: 'success', order: { ...order.toObject(), id: order._id } });
        }

        // Keep stock in step: cancelling puts items back, un-cancelling takes them off again.
        // Only orders whose stock was deducted at checkout are touched (older orders were not).
        if (order.stockDeducted) {
            if (status === 'Cancelled' && !order.stockRestored) {
                await restoreStock(Product, order.cart || []);
                order.stockRestored = true;
            } else if (previousStatus === 'Cancelled' && order.stockRestored) {
                await deductStock(Product, order.cart || []);
                order.stockRestored = false;
            }
        }

        order.status = status;
        const updatedOrder = await order.save();

        await sendStatusEmail(updatedOrder, status);

        res.json({ status: 'success', order: { ...updatedOrder.toObject(), id: updatedOrder._id } });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status", error: error.message });
    }
});

// --- Guest order tracking ---
// Customers enter the email used at checkout and the order number from their receipt
// email (e.g. "A1B2C3"), or the full Paystack reference.
app.post('/api/orders/track', limits.trackOrder, async (req, res) => {
    try {
        const email = String((req.body || {}).email || '').trim();
        const orderNumber = String((req.body || {}).orderNumber || '').trim().replace(/^#/, '');
        if (!email || orderNumber.length < 6) {
            return res.status(400).json({ message: 'Enter your email and the 6-character order number from your receipt.' });
        }

        const orders = await Order.find({ 'customer.email': new RegExp('^' + escapeRegex(email) + '$', 'i') })
            .sort({ date: -1 })
            .limit(200);
        const wanted = orderNumber.toLowerCase();
        const order = orders.find((o) =>
            String(o.reference).toLowerCase() === wanted || String(o._id).toLowerCase().endsWith(wanted)
        );

        if (!order) {
            return res.status(404).json({ message: 'We could not find an order with those details. Please check and try again.' });
        }

        res.status(200).json({
            order: {
                orderNumber: String(order._id).slice(-6).toUpperCase(),
                status: order.status,
                date: order.date,
                total: order.total,
                city: order.customer?.city || '',
                state: order.customer?.state || '',
                items: (order.cart || []).map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    bottleSize: item.bottleSize || '',
                    image: item.image || (item.images && item.images[0]) || '',
                })),
            },
        });
    } catch (error) {
        console.error('Order tracking failed:', error);
        res.status(500).json({ message: 'Could not look up your order right now. Please try again.' });
    }
});

// --- Contact form ---
app.post('/api/contact', limits.contact, async (req, res) => {
    try {
        const body = req.body || {};
        const clean = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
        const name = clean(body.name, 100);
        const email = clean(body.email, 200);
        const phone = clean(body.phone, 40);
        const subject = clean(body.subject, 150) || 'General enquiry';
        const message = clean(body.message, 3000);

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please fill in your name, email and message.' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address.' });
        }
        if (!process.env.ADMIN_EMAIL) {
            console.error('Contact form received but ADMIN_EMAIL is not set.');
            return res.status(500).json({ message: 'Messages cannot be delivered right now. Please reach us on WhatsApp.' });
        }

        const html = `
            <div style="font-family: sans-serif; color: #191970;">
                <h2 style="color: #D4AF37;">New message from the website</h2>
                <p><strong>Name:</strong> ${escapeHtml(name)}</p>
                <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
                <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
                <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 6px;">${escapeHtml(message)}</p>
            </div>
        `;

        await sendEmailJS({
            to_email: process.env.ADMIN_EMAIL,
            subject: `Website enquiry: ${subject}`.slice(0, 200),
            html_message: html
        });

        res.status(200).json({ message: 'Thank you! We will get back to you shortly.' });
    } catch (error) {
        console.error('Contact form failed:', error);
        res.status(500).json({ message: 'Could not send your message. Please try again or reach us on WhatsApp.' });
    }
});

const CUSTOMER_FIELDS = ['name', 'email', 'phone', 'address', 'city', 'state'];

const cleanCustomer = (customer = {}) => {
    const cleaned = {};
    for (const field of CUSTOMER_FIELDS) {
        const value = typeof customer[field] === 'string' ? customer[field].trim().slice(0, 200) : '';
        if (!value) throw new OrderError(`Missing customer ${field}.`);
        cleaned[field] = value;
    }
    return cleaned;
};

const sendAdminPaymentAlert = (subject, rows) => {
    if (!process.env.ADMIN_EMAIL) return Promise.resolve();
    const html = `
        <div style="font-family: sans-serif; color: #191970;">
            <h2 style="color: #b91c1c;">${escapeHtml(subject)}</h2>
            ${rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join('')}
            <p>Check this reference in the Paystack dashboard and follow up with the customer.</p>
        </div>
    `;
    return sendEmailJS({ to_email: process.env.ADMIN_EMAIL, subject: `⚠️ ${subject}`, html_message: html });
};

const findProductsByIds = (ids) =>
    Product.find({ _id: { $in: ids.filter((id) => mongoose.isValidObjectId(id)) } });

// Checked by the storefront right before the Paystack popup opens, so customers are
// never charged for items that are out of stock or no longer sold.
app.post('/api/orders/validate-cart', async (req, res) => {
    try {
        const { cart, total } = await buildOrderCart((req.body || {}).cart, findProductsByIds);
        res.status(200).json({ status: 'success', cart, total });
    } catch (error) {
        if (error instanceof OrderError) return res.status(error.status).json({ status: 'fail', message: error.message });
        console.error('Cart validation failed:', error);
        res.status(500).json({ status: 'fail', message: 'Could not check your cart. Please try again.' });
    }
});

// Verifies a Paystack payment, re-prices the cart from the database and only
// then creates the order. Browser-supplied prices and totals are ignored.
app.post('/api/payments/verify', async (req, res) => {
    const { reference, cart: clientCart, customer: rawCustomer } = req.body || {};
    let payment = null; // set once Paystack confirms the customer was charged

    try {
        if (typeof reference !== 'string' || !reference.trim()) {
            throw new OrderError('Transaction reference is required.');
        }
        if (await Order.exists({ reference })) {
            return res.status(400).json({ status: 'fail', message: 'Order already processed.' });
        }

        const customer = cleanCustomer(rawCustomer);
        payment = await verifyPaystackTransaction(reference, process.env.PAYSTACK_SECRET_KEY);
        const { cart, total } = await buildOrderCart(clientCart, findProductsByIds);
        const expectedKobo = toKobo(total);

        if (payment.amount < expectedKobo) {
            console.error(`Underpayment for ${reference}: paid ${payment.amount} kobo, expected ${expectedKobo} kobo`);
            throw new OrderError(`The amount paid does not match your order total. Please contact support with reference ${reference}.`);
        }

        const savedOrder = await new Order({
            reference,
            customer,
            cart,
            total: payment.amount / 100,
            status: 'Processing',
        }).save();

        // Take the sold quantities off stock
        let lowStock = [];
        try {
            lowStock = await deductStock(Product, cart);
            savedOrder.stockDeducted = true;
            await savedOrder.save();
        } catch (stockError) {
            console.error(`Stock update failed for order ${savedOrder._id}:`, stockError);
        }

        await sendStatusEmail(savedOrder, 'Processing');

        if (process.env.ADMIN_EMAIL) {
            const adminHtml = `
                <div style="font-family: sans-serif; color: #191970;">
                    <h2 style="color: #D4AF37;">New Order Received!</h2>
                    <p>You just received a new order on OpevickyScents.</p>
                    <h3>Customer Details:</h3>
                    <p><strong>Name:</strong> ${escapeHtml(customer.name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(customer.email)}</p>
                    <p><strong>Phone:</strong> ${escapeHtml(customer.phone)}</p>
                    <p><strong>Address:</strong> ${escapeHtml(customer.address)}, ${escapeHtml(customer.city)}, ${escapeHtml(customer.state)}</p>
                    <h3>Order Items:</h3>
                    <ul>
                        ${cart.map(item => `<li><strong>${item.quantity}x</strong> ${escapeHtml(item.name)}</li>`).join('')}
                    </ul>
                    <p><strong>Total:</strong> ₦${savedOrder.total.toLocaleString()}</p>
                    <p><strong>Paystack reference:</strong> ${escapeHtml(reference)}</p>
                    ${lowStock.length ? `
                    <h3 style="color: #b91c1c;">Low stock (${LOW_STOCK_THRESHOLD} or fewer left):</h3>
                    <ul>${lowStock.map(p => `<li>${escapeHtml(p.name)}: <strong>${p.stockAmount}</strong> left</li>`).join('')}</ul>` : ''}
                </div>
            `;

            await sendEmailJS({
                to_email: process.env.ADMIN_EMAIL,
                subject: `🚨 New Order Alert! from ${customer.name}`,
                html_message: adminHtml
            });
        }

        res.status(200).json({ status: 'success', message: 'Order saved successfully!', order: savedOrder });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ status: 'fail', message: 'Order already processed.' });

        // The customer was charged (or we could not confirm either way), so the admin must follow up.
        const charged = payment !== null;
        const unconfirmed = error instanceof OrderError && error.status >= 500;
        if ((charged || unconfirmed) && typeof reference === 'string') {
            const items = Array.isArray(clientCart)
                ? clientCart.map((item) => `${item.quantity}x ${item.name || item.id || item._id}`).join(', ')
                : 'unknown';
            await sendAdminPaymentAlert(charged ? 'Paid order could not be completed' : 'Payment could not be verified', [
                ['Reference', reference],
                ['Amount paid', charged ? `₦${(payment.amount / 100).toLocaleString()}` : 'unknown'],
                ['Reason', error.message],
                ['Customer', rawCustomer ? `${rawCustomer.name} (${rawCustomer.email}, ${rawCustomer.phone})` : 'unknown'],
                ['Items', items],
            ]);
        }

        if (error instanceof OrderError) {
            const message = charged && !/contact support/i.test(error.message)
                ? `${error.message} Your payment was received; our team will contact you to resolve this (reference ${reference}).`
                : error.message;
            return res.status(error.status).json({ status: 'fail', message });
        }
        console.error('Failed to save order:', error);
        res.status(500).json({ status: 'fail', message: 'Failed to save order.' });
    }
});

app.listen(PORT, async () => {
    console.log(`\n--- OpevickyScents Backend ---`);
    console.log(`Server running on http://localhost:${PORT}`);
});