'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('smtp_config', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      user:      { type: Sequelize.STRING(200), allowNull: false },
      pass:      { type: Sequelize.STRING(500), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('smtp_config');
  }
};