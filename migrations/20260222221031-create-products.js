'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false
      },

      subtitle: {
        type: Sequelize.STRING,
        allowNull: true
      },

      descriptions: {
        type: Sequelize.JSON,
        allowNull: false
      },

      mainImage: {
        type: Sequelize.STRING,
        allowNull: false
      },

      thumbnails: {
        type: Sequelize.JSON,
        allowNull: false
      },

      contactLink: {
        type: Sequelize.STRING,
        allowNull: false
      },

      breadcrumbs: {
        type: Sequelize.JSON,
        allowNull: false
      },

      features: {
        type: Sequelize.JSON,
        allowNull: false
      },

      downloads: {
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
    await queryInterface.dropTable('products');
  }
};