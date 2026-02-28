'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // ✅ agregar nueva columna ruta
    await queryInterface.addColumn('products', 'ruta', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      comment:
        'Ruta única del producto, ej: /productos/ridgeback'
    });

    // ✅ mainImage ahora nullable
    await queryInterface.changeColumn('products', 'mainImage', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // ✅ contactLink ahora nullable
    await queryInterface.changeColumn('products', 'contactLink', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // ✅ defaults JSON
    await queryInterface.changeColumn('products', 'descriptions', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.changeColumn('products', 'thumbnails', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.changeColumn('products', 'breadcrumbs', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.changeColumn('products', 'features', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.changeColumn('products', 'downloads', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('products', 'ruta');

    await queryInterface.changeColumn('products', 'mainImage', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('products', 'contactLink', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};