const express = require('express');
const router = express.Router();
const { 
  getAddresses, 
  getAddress, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setPrimaryAddress 
} = require('../controllers/add');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, getAddresses);
router.get('/:id', authenticateToken, getAddress);
router.post('/', authenticateToken, createAddress);
router.put('/:id', authenticateToken, updateAddress);
router.delete('/:id', authenticateToken, deleteAddress);
router.put('/:id/primary', authenticateToken, setPrimaryAddress);

module.exports = router;