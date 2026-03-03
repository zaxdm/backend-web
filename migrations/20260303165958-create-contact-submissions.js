'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contact_submissions', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      firstName: { type: Sequelize.STRING(100), allowNull: false },
      lastName:  { type: Sequelize.STRING(100), allowNull: false },
      email:     { type: Sequelize.STRING(200), allowNull: false },
      phone:     { type: Sequelize.STRING(30),  allowNull: true  },
      company:   { type: Sequelize.STRING(150), allowNull: true  },
      message:   { type: Sequelize.TEXT,        allowNull: false },
      region:    { type: Sequelize.STRING(150), allowNull: false },
      toEmail:   { type: Sequelize.STRING(200), allowNull: false },
      createdAt: { type: Sequelize.DATE,        allowNull: false },
      updatedAt: { type: Sequelize.DATE,        allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('contact_submissions');
  }
};