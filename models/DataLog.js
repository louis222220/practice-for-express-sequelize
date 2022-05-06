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
    static async writeLog(instance, userId) {
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
        console.log(newDataLog.toJSON());
        await newDataLog.save();
      } catch (error) {
        // Ignore error when write data log
        console.log(`writeLog error: `, error.message);
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