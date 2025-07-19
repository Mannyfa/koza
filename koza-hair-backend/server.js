// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import all route files
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const customerRoutes = require('./routes/customerRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Make the 'uploads' folder publicly accessible
// This line serves files from the 'uploads' directory at the '/uploads' URL path.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Koza Hair Plug API!');
});

// Use the imported routes for the API
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/payments', paymentRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});