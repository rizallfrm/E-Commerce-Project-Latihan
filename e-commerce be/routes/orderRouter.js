const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getOrderDetail, 
  createOrder, 
  updateOrderStatus, 
  cancelOrder 
} = require('../controllers/orderController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.get('/', authenticateToken, getOrders);
router.get('/:id', authenticateToken, getOrderDetail);
router.post('/', authenticateToken, createOrder);
router.put('/:id/status', authenticateToken, isAdmin, updateOrderStatus);
router.put('/:id/cancel', authenticateToken, cancelOrder);

module.exports = router;
