'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Products = sequelize.define(
  'Products',
  {
    ruta: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Ruta única del producto. Debe coincidir con items[].ruta del navbar'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,   // ← era false, causaba error al crear producto vacío
      defaultValue: ''
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    descriptions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    thumbnails: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    contactLink: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    breadcrumbs: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    downloads: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    }
  },
  {
    tableName: 'products',
    timestamps: true
  }
);

module.exports = Products;