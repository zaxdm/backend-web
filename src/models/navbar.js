'use strict';

const { DataTypes } = require('sequelize');
const { withDB } = require('../config/sequelize');

const Navbar = sequelize.define(
  'Navbar',
  {
    productosLabel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    aboutLabel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactoLabel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactoRuta: {
      type: DataTypes.STRING,
      allowNull: false
    },
    siguenos: {
      type: DataTypes.STRING,
      allowNull: false
    },
    buscarPlaceholder: {
      type: DataTypes.STRING,
      allowNull: false
    },
    aboutMenu: {
      type: DataTypes.JSON,
      allowNull: false
    },
    productosMenu: {
      type: DataTypes.JSON,
      allowNull: false
    },
    redes: {
      type: DataTypes.JSON,
      allowNull: false
    },
    logoActual: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'navbar',
    timestamps: true
  }
);

module.exports = Navbar;
