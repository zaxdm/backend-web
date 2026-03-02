'use strict';
const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
require('dotenv').config();

if (!global._sequelize) {
  global._sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      dialectModule: mysql2,
      pool: {
        max: 2,
        min: 0,
        acquire: 30000,
        idle: 5000,   // ✅ libera antes (era 10000)
        evict: 1000   // ✅ revisa cada segundo (era 10000)
      },
      dialectOptions: { connectTimeout: 20000 },
      logging: false
    }
  );
}

const sequelize = global._sequelize;

const withDB = async (fn) => {
  return await fn(sequelize);
};

module.exports = sequelize;
module.exports.withDB = withDB;