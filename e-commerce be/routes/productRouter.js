const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductDetail, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  addProductImage,
  deleteProductImage 
} = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProductDetail);
router.post('/', authenticateToken, isAdmin, createProduct);
router.put('/:id', authenticateToken, isAdmin, updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);
router.post('/:id/images', authenticateToken, isAdmin, addProductImage);
router.delete('/:productId/images/:imageId', authenticateToken, isAdmin, deleteProductImage);

module.exports = router;