'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ContactPage = sequelize.define(
  'ContactPage',
  {
    regions: {
      type: DataTypes.JSON,
      allowNull: false
    },
    content: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    tableName: 'contact_page',
    timestamps: true
  }
);

module.exports = ContactPage;
