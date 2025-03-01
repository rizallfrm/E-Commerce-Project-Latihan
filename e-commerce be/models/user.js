'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    full_name: DataTypes.STRING,
    phone_number: DataTypes.STRING
  });

  User.associate = (models) => {
    User.hasMany(models.Order, {
      foreignKey: 'user_id',
      as: 'orders'
    });
    User.hasMany(models.Address, {
      foreignKey: 'user_id',
      as: 'addresses'
    });
    User.hasMany(models.CartItem, {
      foreignKey: 'user_id',
      as: 'cartItems'
    });
  };

  return User;
};