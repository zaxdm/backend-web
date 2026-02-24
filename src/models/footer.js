'use strict';

module.exports = (sequelize, DataTypes) => {
  const Footer = sequelize.define(
    'Footer',
    {
      content: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      tableName: 'footer',
      timestamps: true
    }
  );

  return Footer;
};