'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    user_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    CartItem.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product'
    });
  };

  return CartItem;
};