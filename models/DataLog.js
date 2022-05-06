'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DataLog extends Model {
    static associate(models) {
      this.belongsTo(models.User);
    }
  }
  DataLog.init({
    user_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'DataLog',
    underscored: true,
    updatedAt: false,
  });
  return DataLog;
};