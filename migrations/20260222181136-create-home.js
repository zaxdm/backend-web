'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('home', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      hero: {
        type: Sequelize.JSON,
        allowNull: false
      },
      cards: {
        type: Sequelize.JSON,
        allowNull: false
      },
      about: {
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
    await queryInterface.dropTable('home');
  }
};