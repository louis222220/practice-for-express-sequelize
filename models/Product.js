'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {}

  Product.init({
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
    underscored: true,
    paranoid: true,
  });
  return Product;
};