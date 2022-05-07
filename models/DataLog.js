'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DataLog extends Model {
    static associate(models) {
      this.belongsTo(models.User);
    };

    /**
     * Write the record of data change.
     * @param Model instance  the instance to be updated before saved
     * @param int   userId   the id of the user updating the data
     */
    static async writeUpdateLog(instance, userId) {
      userId = parseInt(userId);
      if (!(
        instance instanceof Model &&
        instance.changed() &&
        Number.isInteger(userId) &&
        userId > 0
      )) {
        return;
      }

      try {
        const newDataLog = this.build({
          user_id: userId,
          data_table_name: instance.constructor.getTableName(),
          prev_data: JSON.stringify(instance.previous()),
          curr_data: JSON.stringify(instance.get()),
        });
        await newDataLog.save();
      } catch (error) {
        // Ignore error when write data log
        console.log(`writeUpdateLog error: `, error.message);
      }
    }

    /**
     * Write the record of data change.
     * @param Model instance  the instance to be updated before saved
     * @param int   userId   the id of the user updating the data
     */
    static async writeDeleteLog(instance, userId) {
      userId = parseInt(userId);
      if (!(
        instance instanceof Model &&
        Number.isInteger(userId) &&
        userId > 0
      )) {
        return;
      }

      try {
        const newDataLog = this.build({
          user_id: userId,
          data_table_name: instance.constructor.getTableName(),
          prev_data: JSON.stringify(instance.get()),
          curr_data: "DELETED",
        });
        await newDataLog.save();
      } catch (error) {
        // Ignore error when write data log
        console.log(`writeDeleteLog error: `, error.message);
      }
    }

  }

  DataLog.init({
    user_id: DataTypes.BIGINT,
    data_table_name: DataTypes.STRING,
    prev_data: DataTypes.TEXT('long'),
    curr_data: DataTypes.TEXT('long'),
  }, {
    sequelize,
    modelName: 'DataLog',
    underscored: true,
    updatedAt: false,
  });
  return DataLog;
};