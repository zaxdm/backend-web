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
        max: 1,
        min: 0,
        acquire: 30000,
        idle: 0,      // ← era 10000, ahora libera inmediatamente
        evict: 500    // ← era 10000, ahora limpia rápido
      },
      dialectOptions: { connectTimeout: 20000 },
      logging: false
    }
  );
}

const sequelize = global._sequelize;

const withDB = async (fn) => {
  try {
    return await fn(sequelize);
  } finally {
    try {
      await sequelize.connectionManager.pool.drain();
      sequelize.connectionManager.pool.clear();
    } catch (_) {}
  }
};

module.exports = sequelize;
module.exports.withDB = withDB;