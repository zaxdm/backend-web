'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      codigo_dni: {
        type: Sequelize.STRING,
        allowNull: false
      },

      apellidos: {
        type: Sequelize.STRING,
        allowNull: false
      },

      nombres: {
        type: Sequelize.STRING,
        allowNull: false
      },

      cargo: {
        type: Sequelize.STRING,
        allowNull: true
      },

      rol: {
        type: Sequelize.STRING,
        allowNull: true
      },

      correo: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};