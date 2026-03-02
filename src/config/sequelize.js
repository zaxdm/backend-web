'use strict';
const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
require('dotenv').config();

// ✅ Singleton global para Sequelize (solo se crea UNA vez)
if (!global._sequelize) {
  console.log('📊 Inicializando Sequelize con pool optimizado...');

  global._sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      dialectModule: mysql2,

      // ✅ Pool de conexiones CRÍTICO para Vercel (max_user_connections = 5)
      pool: {
        max: 2,           // ✅ Máximo 2 conexiones simultáneas (Vercel = 5, dejamos margen)
        min: 0,           // No mantener conexiones inactivas
        acquire: 30000,   // 30 segundos para obtener conexión
        idle: 5000,       // Liberar conexión después de 5 segundos inactiva
        evict: 1000,      // Revisar conexiones inactivas cada 1 segundo
        validate: function(connection) {
          // ✅ Validar que la conexión siga activa
          return connection.ping !== false;
        }
      },

      // ✅ Opciones de dialecto
      dialectOptions: {
        connectTimeout: 20000,
        // ✅ SSL para conexiones remotas (importante si BD está en cloud)
        ssl: process.env.DB_SSL === 'true' ? {
          require: true,
          rejectUnauthorized: false
        } : false
      },

      // ✅ Logging (disable en producción)
      logging: process.env.NODE_ENV === 'production' ? false : console.log,

      // ✅ Opciones adicionales
      define: {
        timestamps: true,
        underscored: true,
        charset: 'utf8mb4'
      }
    }
  );

  // ✅ Probar conexión al inicializar
  global._sequelize
    .authenticate()
    .then(() => {
      console.log('✅ Conexión a BD establecida correctamente');
    })
    .catch(err => {
      console.error('❌ Error autenticando BD:', err.message);
    });
}

const sequelize = global._sequelize;

// ✅ Función helper para ejecutar queries con BD
const withDB = async (fn) => {
  try {
    return await fn(sequelize);
  } catch (error) {
    console.error('Error en withDB:', error.message);
    throw error;
  }
};

module.exports = sequelize;
module.exports.withDB = withDB;