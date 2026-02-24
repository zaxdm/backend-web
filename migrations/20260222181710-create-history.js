'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('history', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      heroTitle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      timeline: {
        type: Sequelize.JSON,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('history');
  }
};