'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('general_product_page', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      headerData: {
        type: Sequelize.JSON,
        allowNull: false
      },
      infoSection: {
        type: Sequelize.JSON,
        allowNull: false
      },
      products: {
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
    await queryInterface.dropTable('general_product_page');
  }
};