'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('navbar', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      productosLabel: {
        type: Sequelize.STRING,
        allowNull: false
      },

      aboutLabel: {
        type: Sequelize.STRING,
        allowNull: false
      },

      contactoLabel: {
        type: Sequelize.STRING,
        allowNull: false
      },

      contactoRuta: {
        type: Sequelize.STRING,
        allowNull: false
      },

      siguenos: {
        type: Sequelize.STRING,
        allowNull: false
      },

      buscarPlaceholder: {
        type: Sequelize.STRING,
        allowNull: false
      },

      aboutMenu: {
        type: Sequelize.JSON,
        allowNull: false
      },

      productosMenu: {
        type: Sequelize.JSON,
        allowNull: false
      },

      redes: {
        type: Sequelize.JSON,
        allowNull: false
      },

      logoActual: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('navbar');
  }
};