'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const MailConfig = sequelize.define(
  'MailConfig',
  {
    mailUser: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mailPass: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'mail_config',
    timestamps: true
  }
);

module.exports = MailConfig;