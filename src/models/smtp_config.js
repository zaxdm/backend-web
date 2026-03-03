'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SmtpConfig = sequelize.define(
  'SmtpConfig',
  {
    host:     { type: DataTypes.STRING(200), allowNull: false },
    port:     { type: DataTypes.INTEGER,     allowNull: false, defaultValue: 587 },
    secure:   { type: DataTypes.BOOLEAN,     allowNull: false, defaultValue: false },
    user:     { type: DataTypes.STRING(200), allowNull: false },
    pass:     { type: DataTypes.STRING(500), allowNull: false },
    fromName: { type: DataTypes.STRING(200), allowNull: false, defaultValue: 'Formulario Web' }
  },
  {
    tableName: 'smtp_config',
    timestamps: true
  }
);

module.exports = SmtpConfig;