'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GeneralProductPage = sequelize.define(
  'GeneralProductPage',
  {
    categoryKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Ruta de la categoría del navbar, ej: /productos/general'
    },
    headerData: {
      type: DataTypes.JSON,
      allowNull: false
    },
    infoSection: {
      type: DataTypes.JSON,
      allowNull: false
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'general_product_page',
    timestamps: true
  }
);

module.exports = GeneralProductPage;