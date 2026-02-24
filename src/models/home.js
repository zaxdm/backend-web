'use strict';

module.exports = (sequelize, DataTypes) => {
  const Home = sequelize.define(
    'Home',
    {
      hero: {
        type: DataTypes.JSON,
        allowNull: false
      },
      cards: {
        type: DataTypes.JSON,
        allowNull: false
      },
      about: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      tableName: 'home',
      timestamps: true
    }
  );

  return Home;
};