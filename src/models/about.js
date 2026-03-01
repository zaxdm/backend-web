'use strict';

const { DataTypes } = require('sequelize');
const { withDB } = require('../config/sequelize');

const About = sequelize.define(
  'About',
  {
    aboutData: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'about',
    timestamps: true
  }
);

module.exports = About;
