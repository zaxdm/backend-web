'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const GeneralProductPage = sequelize.define(
  'GeneralProductPage',
  {
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
