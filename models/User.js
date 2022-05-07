'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
    static async hashPassword(password) {
      return await bcrypt.hash(password, 10);
    }
    async isValidPassword(password) {
      return await bcrypt.compare(password, this.password);
    }
  }

  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
  });
  return User;
};