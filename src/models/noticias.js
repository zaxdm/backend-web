'use strict';

const { DataTypes } = require('sequelize');
const { withDB } = require('../config/sequelize');

const Noticias = sequelize.define(
  'Noticias',
  {
    categoria: {
      type: DataTypes.STRING,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaPublicacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    parrafos: {
      type: DataTypes.JSON,
      allowNull: false
    },
    contactoNombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contactoEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    firmaNombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firmaCargo: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'noticias',
    timestamps: true
  }
);

module.exports = Noticias;
