'use strict';

const { DataTypes } = require('sequelize');
const { withDB } = require('../config/sequelize');

const History = sequelize.define(
  'History',
  {
    heroTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timeline: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'history',
    timestamps: true
  }
);

module.exports = History;
