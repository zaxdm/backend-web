'use strict';

module.exports = (sequelize, DataTypes) => {
  const History = sequelize.define(
    'History',
    {
      heroTitle: {
        type: DataTypes.STRING,
        allowNull: false
      },
      timeline: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      tableName: 'history',
      timestamps: true
    }
  );

  return History;
};