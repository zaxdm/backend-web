'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('noticias', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      categoria: {
        type: Sequelize.STRING,
        allowNull: false
      },

      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },

      fechaPublicacion: {
        type: Sequelize.DATE,
        allowNull: false
      },

      parrafos: {
        type: Sequelize.JSON,
        allowNull: false
      },

      contactoNombre: {
        type: Sequelize.STRING,
        allowNull: false
      },

      contactoEmail: {
        type: Sequelize.STRING,
        allowNull: false
      },

      firmaNombre: {
        type: Sequelize.STRING,
        allowNull: false
      },

      firmaCargo: {
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
    await queryInterface.dropTable('noticias');
  }
};