'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    slug: DataTypes.STRING
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: 'category_id',
      as: 'products'
    });
  };

  return Category;
};
