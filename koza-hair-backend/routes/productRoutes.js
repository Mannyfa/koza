// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware'); // Import the upload middleware

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Apply the middleware here. 'upload' will process the file first.
router.post('/', upload, productController.createProduct);
router.put('/:id', upload, productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

module.exports = router;