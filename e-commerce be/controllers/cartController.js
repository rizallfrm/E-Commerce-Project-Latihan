const { CartItem, Product, ProductImage } = require('../models');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            {
              model: ProductImage,
              as: 'images',
              where: { is_primary: true },
              required: false,
              limit: 1
            }
          ]
        }
      ]
    });
    
    // Calculate total
    let total = 0;
    cartItems.forEach(item => {
      total += item.quantity * item.product.price;
    });
    
    res.json({
      status: 'success',
      data: {
        items: cartItems,
        total
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity = 1 } = req.body;
    
    // Validate product exists and is active
    const product = await Product.findOne({
      where: { id: product_id, is_active: true }
    });
    
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found or inactive'
      });
    }
    
    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Not enough stock available'
      });
    }
    
    // Check if product already in cart
    const existingItem = await CartItem.findOne({
      where: { user_id: userId, product_id }
    });
    
    if (existingItem) {
      // Update quantity if already in cart
      const newQuantity = existingItem.quantity + quantity;
      
      // Check stock for updated quantity
      if (product.stock < newQuantity) {
        return res.status(400).json({
          status: 'error',
          message: 'Not enough stock available'
        });
      }
      
      await existingItem.update({ quantity: newQuantity });
      
      const updatedItem = await CartItem.findByPk(existingItem.id, {
        include: [{ model: Product, as: 'product' }]
      });
      
      return res.json({
        status: 'success',
        data: updatedItem,
        message: 'Item quantity updated in cart'
      });
    }
    
    // Add new item to cart
    const cartItem = await CartItem.create({
      user_id: userId,
      product_id,
      quantity
    });
    
    const newItem = await CartItem.findByPk(cartItem.id, {
      include: [{ model: Product, as: 'product' }]
    });
    
    res.status(201).json({
      status: 'success',
      data: newItem,
      message: 'Item added to cart'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;
    
    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Quantity must be greater than 0'
      });
    }
    
    // Find cart item
    const cartItem = await CartItem.findOne({
      where: { id, user_id: userId },
      include: [{ model: Product, as: 'product' }]
    });
    
    if (!cartItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart item not found'
      });
    }
    
    // Check stock
    if (cartItem.product.stock < quantity) {
      return res.status(400).json({
        status: 'error',
        message: 'Not enough stock available'
      });
    }
    
    // Update quantity
    await cartItem.update({ quantity });
    
    const updatedItem = await CartItem.findByPk(id, {
      include: [{ model: Product, as: 'product' }]
    });
    
    res.json({
      status: 'success',
      data: updatedItem,
      message: 'Cart item updated'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const cartItem = await CartItem.findOne({
      where: { id, user_id: userId }
    });
    
    if (!cartItem) {
      return res.status(404).json({
        status: 'error',
        message: 'Cart item not found'
      });
    }
    
    await cartItem.destroy();
    
    res.json({
      status: 'success',
      message: 'Item removed from cart'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    await CartItem.destroy({
      where: { user_id: userId }
    });
    
    res.json({
      status: 'success',
      message: 'Cart cleared'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
};