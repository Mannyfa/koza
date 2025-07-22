// controllers/userController.js

// Placeholder for users. In a real app, this would be a database table.
// Passwords should be hashed in a real application.
let users = [
    { id: 1, email: 'test@example.com', password: 'password123', wishlist: [1, 3] },
    { id: 2, email: 'qwerty1@gmail.com', password: 'password1234', wishlist: [] }
];
let nextUserId = 3;

// User Registration
exports.registerUser = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists.' });
    }
    const newUser = { id: nextUserId++, email, password, wishlist: [] };
    users.push(newUser);
    // In a real app, you'd return a JWT token here, not the full user object.
    res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email } });
};

// User Login
exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // In a real app, you'd return a JWT token here.
    res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email, wishlist: user.wishlist } });
};

// Get User's Wishlist
exports.getWishlist = (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ wishlist: user.wishlist });
};

// Add to Wishlist
exports.addToWishlist = (req, res) => {
    const userId = parseInt(req.params.userId);
    const { productId } = req.body;
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
    }
    res.status(200).json({ message: 'Product added to wishlist.', wishlist: user.wishlist });
};

// Remove from Wishlist
exports.removeFromWishlist = (req, res) => {
    const userId = parseInt(req.params.userId);
    const productId = parseInt(req.params.productId);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    user.wishlist = user.wishlist.filter(id => id !== productId);
    res.status(200).json({ message: 'Product removed from wishlist.', wishlist: user.wishlist });
};
