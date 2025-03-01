'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    user_id: DataTypes.INTEGER,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    province: DataTypes.STRING,
    postal_code: DataTypes.STRING,
    is_primary: DataTypes.BOOLEAN
  });

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Address.hasMany(models.Order, {
      foreignKey: 'shipping_address_id',
      as: 'orders'
    });
  };

  return Address;
};
