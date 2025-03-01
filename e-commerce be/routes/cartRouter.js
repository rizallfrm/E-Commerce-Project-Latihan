const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getCart);
router.post('/items', authenticateToken, addToCart);
router.put('/items/:id', authenticateToken, updateCartItem);
router.delete('/items/:id', authenticateToken, removeFromCart);
router.delete('/', authenticateToken, clearCart);

module.exports = router;
