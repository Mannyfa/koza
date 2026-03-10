const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Dummy admin user for demonstration
const adminUser = {
  email: process.env.ADMIN_EMAIL || 'admin@example.com',
  password: process.env.ADMIN_PASSWORD || 'password123', // In a real app, hash this password!
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email === adminUser.email && password === adminUser.password) {
    const token = jwt.sign({ id: adminUser.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Admin login successful',
      token,
      email: adminUser.email,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = { authAdmin };
