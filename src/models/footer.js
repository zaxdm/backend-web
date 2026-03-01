'use strict';

const { DataTypes } = require('sequelize');
const { withDB } = require('../config/sequelize');

const Footer = sequelize.define(
  'Footer',
  {
    content: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'footer',
    timestamps: true
  }
);

module.exports = Footer;
