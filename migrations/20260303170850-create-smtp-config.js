'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('smtp_config', {
      id:        { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
      host:      { type: Sequelize.STRING(200), allowNull: false },
      port:      { type: Sequelize.INTEGER,     allowNull: false, defaultValue: 587 },
      secure:    { type: Sequelize.BOOLEAN,     allowNull: false, defaultValue: false },
      user:      { type: Sequelize.STRING(200), allowNull: false },
      pass:      { type: Sequelize.STRING(500), allowNull: false },
      fromName:  { type: Sequelize.STRING(200), allowNull: false, defaultValue: 'Formulario Web' },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('smtp_config');
  }
};