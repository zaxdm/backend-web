'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const AdminEmailConfig = sequelize.define(
  'AdminEmailConfig',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fromEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'contacto@tudominio.com'
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Nuevo contacto: {firstName} {lastName}'
    },
    htmlTemplate: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: `
        <h2>Nuevo Mensaje de Contacto</h2>
        <p><strong>Región:</strong> {region}</p>
        <p><strong>De:</strong> {firstName} {lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
        <p><strong>Empresa:</strong> {company}</p>
        <hr />
        <p><strong>Mensaje:</strong></p>
        <p>{message}</p>
      `
    }
  },
  {
    tableName: 'admin_email_config',
    timestamps: true
  }
);

module.exports = AdminEmailConfig;