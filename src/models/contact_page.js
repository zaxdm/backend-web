'use strict';

module.exports = (sequelize, DataTypes) => {
  const ContactPage = sequelize.define(
    'ContactPage',
    {
      regions: {
        type: DataTypes.JSON,
        allowNull: false
      },
      content: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      tableName: 'contact_page',
      timestamps: true
    }
  );

  return ContactPage;
};