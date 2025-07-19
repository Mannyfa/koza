// controllers/productController.js

let placeholderProducts = [
    { id: 1, name: 'Bone Straight HD Lace Wig', price: 150000, stock: 10, image: 'https://placehold.co/400x400/EAD3C3/5C3A2F?text=Bone+Straight' },
    { id: 2, name: 'Deep Wave Frontal Wig', price: 125000, stock: 15, image: 'https://placehold.co/400x400/D4BBAA/5C3A2F?text=Deep+Wave' },
];
let nextProductId = 3;

// ... (getAllProducts and getProductById are unchanged) ...
exports.getAllProducts = (req, res) => res.status(200).json({ status: 'success', data: { products: placeholderProducts } });
exports.getProductById = (req, res) => { /* ... */ };


// Create a new product - now handles req.file
exports.createProduct = (req, res) => {
    const { name, price, stock } = req.body;
    if (!name || !price) {
        return res.status(400).json({ status: 'fail', message: 'Name and price are required' });
    }
    
    // Multer adds the 'file' object to the request. We save its path.
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : 'https://placehold.co/400x400/cccccc/333333?text=No+Image';

    const newProduct = {
        id: nextProductId++,
        name,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        image: imagePath
    };
    placeholderProducts.push(newProduct);
    res.status(201).json({ status: 'success', data: { product: newProduct } });
};

// Update a product - now handles req.file
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, stock } = req.body;
    const productIndex = placeholderProducts.findIndex(p => p.id === parseInt(id));

    if (productIndex === -1) {
        return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }

    const updatedProduct = { ...placeholderProducts[productIndex], name, price, stock };
    
    // If a new file is uploaded, update the image path
    if (req.file) {
        updatedProduct.image = req.file.path.replace(/\\/g, "/");
    }

    placeholderProducts[productIndex] = updatedProduct;
    res.status(200).json({ status: 'success', data: { product: updatedProduct } });
};

// ... (deleteProduct is unchanged) ...
exports.deleteProduct = (req, res) => { /* ... */ };