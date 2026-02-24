'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Products = sequelize.define(
  'Products',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descriptions: {
      type: DataTypes.JSON,
      allowNull: false
    },
    mainImage: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnails: {
      type: DataTypes.JSON,
      allowNull: false
    },
    contactLink: {
      type: DataTypes.STRING,
      allowNull: false
    },
    breadcrumbs: {
      type: DataTypes.JSON,
      allowNull: false
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false
    },
    downloads: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'products',
    timestamps: true
  }
);

module.exports = Products;
