'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ContactSubmission = sequelize.define(
  'ContactSubmission',
  {
    firstName: { type: DataTypes.STRING(100), allowNull: false },
    lastName:  { type: DataTypes.STRING(100), allowNull: false },
    email:     { type: DataTypes.STRING(200), allowNull: false },
    phone:     { type: DataTypes.STRING(30),  allowNull: true  },
    company:   { type: DataTypes.STRING(150), allowNull: true  },
    message:   { type: DataTypes.TEXT,        allowNull: false },
    region:    { type: DataTypes.STRING(150), allowNull: false },
    toEmail:   { type: DataTypes.STRING(200), allowNull: false }
  },
  {
    tableName: 'contact_submissions',
    timestamps: true
  }
);

module.exports = ContactSubmission;