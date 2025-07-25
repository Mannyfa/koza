// controllers/productController.js

// Use 'exports.products' to make this array available to other files like the dashboard controller.
exports.products = [
    { id: 1, name: 'Bone Straight HD Lace Wig', price: 150000, stock: 10, image: 'https://placehold.co/400x400/EAD3C3/5C3A2F?text=Bone+Straight' },
    { id: 2, name: 'Deep Wave Frontal Wig', price: 125000, stock: 15, image: 'https://placehold.co/400x400/D4BBAA/5C3A2F?text=Deep+Wave' },
    { id: 3, name: 'Bouncy Curls with Closure', price: 135000, stock: 5, image: 'https://placehold.co/400x400/C8A998/5C3A2F?text=Bouncy+Curls' },
];
let nextProductId = 4;

// Get all products
exports.getAllProducts = (req, res) => {
    res.status(200).json({ status: 'success', data: { products: exports.products } });
};

// Get a single product
exports.getProductById = (req, res) => {
    const product = exports.products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }
    res.status(200).json({ status: 'success', data: { product } });
};

// Create a new product
exports.createProduct = (req, res) => {
    const { name, price, stock } = req.body;
    if (!name || !price) {
        return res.status(400).json({ status: 'fail', message: 'Name and price are required' });
    }
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : 'https://placehold.co/400x400/cccccc/333333?text=No+Image';

    const newProduct = {
        id: nextProductId++,
        name,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        image: imagePath
    };
    exports.products.push(newProduct);
    res.status(201).json({ status: 'success', data: { product: newProduct } });
};

// Update a product
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const productIndex = exports.products.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }

    const updatedProduct = { ...exports.products[productIndex], name, price, stock };
    if (req.file) {
        updatedProduct.image = req.file.path.replace(/\\/g, "/");
    }

    exports.products[productIndex] = updatedProduct;
    res.status(200).json({ status: 'success', data: { product: updatedProduct } });
};

// Delete a product
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    const initialLength = exports.products.length;
    exports.products = exports.products.filter(p => p.id !== parseInt(id));

    if (exports.products.length === initialLength) {
        return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }

    res.status(204).json({ status: 'success', data: null });
};
