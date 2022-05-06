'use strict';
const tablename = 'data_logs';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tablename, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      data_table_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      prev_data: {
        allowNull: false,
        type: Sequelize.TEXT('long'),
      },
      curr_data: {
        allowNull: false,
        type: Sequelize.TEXT('long'),
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tablename);
  }
};