'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SmtpConfig = sequelize.define(
  'SmtpConfig',
  {
    user: { type: DataTypes.STRING(200), allowNull: false },
    pass: { type: DataTypes.STRING(500), allowNull: false }
  },
  {
    tableName: 'smtp_config',
    timestamps: true
  }
);

module.exports = SmtpConfig;