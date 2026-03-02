const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const MailConfig = sequelize.define(
  'MailConfig',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'  // ✅ Nombre explícito de columna
    },
    mailUser: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'mailUser'  // ✅ IMPORTANTE: Coincide con columna de BD
    },
    mailPass: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'mailPass'  // ✅ IMPORTANTE: Coincide con columna de BD
    }
  },
  {
    tableName: 'mail_config',  // ✅ Nombre de tabla exacto
    timestamps: true,
    underscored: false,  // ✅ NO convertir nombres
    freezeTableName: true  // ✅ Mantener nombre exacto
  }
);

module.exports = MailConfig;