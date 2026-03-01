const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    pool: {
      max: 2,        // Máximo 2 conexiones (tu límite es 5 en total)
      min: 0,
      acquire: 30000,
      idle: 10000,
      evict: 10000   // Libera conexiones inactivas rápido
    },
    logging: false
  }
);

module.exports = sequelize;