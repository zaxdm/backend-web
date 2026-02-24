'use strict';

module.exports = (sequelize, DataTypes) => {
  const About = sequelize.define(
    'About',
    {
      aboutData: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      tableName: 'about',
      timestamps: true
    }
  );

  return About;
};