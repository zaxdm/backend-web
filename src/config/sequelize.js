const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
require('dotenv').config();

let sequelize;

if (!global.sequelize) {
  global.sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      dialectModule: mysql2,

      pool: {
        max: 1,
        min: 0,
        acquire: 30000,
        idle: 10000,
        evict: 10000
      },

      dialectOptions: {
        connectTimeout: 20000
      },

      retry: { max: 3 },
      logging: false
    }
  );
}

sequelize = global.sequelize;

module.exports = sequelize;