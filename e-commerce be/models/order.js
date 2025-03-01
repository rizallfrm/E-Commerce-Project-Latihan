'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    user_id: DataTypes.INTEGER,
    order_number: DataTypes.STRING,
    total_amount: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    shipping_address_id: DataTypes.INTEGER
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Order.belongsTo(models.Address, {
      foreignKey: 'shipping_address_id',
      as: 'shippingAddress'
    });
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'orderItems'
    });
  };

  return Order;
};