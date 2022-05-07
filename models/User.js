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
      let hash = '';
      if (this.password) {
        hash = this.password
      }
      else {
        const user = await this.constructor.unscoped().findByPk(this.id);
        hash = user.password;
      }

      if (!hash) return false;
      return await bcrypt.compare(password, hash);
    }
  }

  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
  });
  return User;
};