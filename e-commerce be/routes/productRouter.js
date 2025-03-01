const express = require('express');
const router = express.Router();
const { getProducts, getProductDetail, createProduct } = require('../controllers/product.controller');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProductDetail);
router.post('/', authenticateToken, isAdmin, createProduct);

module.exports = router;