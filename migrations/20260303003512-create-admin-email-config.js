'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('admin_email_config', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fromEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'contacto@tudominio.com'
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Nuevo contacto: {firstName} {lastName}'
      },
      htmlTemplate: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('admin_email_config');
  }
};