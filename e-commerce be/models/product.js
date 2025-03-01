'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    category_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    stock: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
    Product.hasMany(models.ProductImage, {
      foreignKey: 'product_id',
      as: 'images'
    });
    Product.hasMany(models.OrderItem, {
      foreignKey: 'product_id',
      as: 'orderItems'
    });
    Product.hasMany(models.CartItem, {
      foreignKey: 'product_id',
      as: 'cartItems'
    });
  };

  return Product;
};