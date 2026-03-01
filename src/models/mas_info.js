'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const MasInfo = sequelize.define(
  'MasInfo',
  {
    hero: {
      type: DataTypes.JSON,
      allowNull: false
    },
    contentSections: {
      type: DataTypes.JSON,
      allowNull: false
    },
    sections: {
      type: DataTypes.JSON,
      allowNull: false
    },
    bottomBanner: {
      type: DataTypes.JSON,
      allowNull: true
    }
  },
  {
    tableName: 'mas_info',
    timestamps: true
  }
);

module.exports = MasInfo;
