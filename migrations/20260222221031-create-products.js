'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      ruta: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        comment: 'Ruta única del producto, ej: /productos/ridgeback. Debe coincidir con items[].ruta del navbar'
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
        allowNull: false,
        defaultValue: []
      },
      mainImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      thumbnails: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      contactLink: {
        type: Sequelize.STRING,
        allowNull: true
      },
      breadcrumbs: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      features: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
      },
      downloads: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: []
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