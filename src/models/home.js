'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Home = sequelize.define(
  'Home',
  {
    hero: {
      type: DataTypes.JSON,
      allowNull: false
    },
    cards: {
      type: DataTypes.JSON,
      allowNull: false
    },
    about: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'home',
    timestamps: true
  }
);

module.exports = Home;
