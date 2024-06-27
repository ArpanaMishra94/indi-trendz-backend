const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Get all products
router.get('/', productController.getProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', productController.getProductById);

// POST /api/products - Create a new product
router.post('/', productController.createProduct);

// PUT /api/products/:id - Update product by ID
router.put('/:id', productController.updateProductById);

// DELETE /api/products/:id - Delete product by ID
router.delete('/:id', productController.deleteProductById);

module.exports = router;
