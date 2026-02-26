const { Sequelize } = require('sequelize');
// Ensure mysql2 is bundled and used explicitly in serverless environments
const mysql2 = require('mysql2');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,  
    process.env.DB_USER,  
    process.env.DB_PASSWORD,  
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectModule: mysql2,
        port: process.env.DB_PORT || 3306,
    }
);


sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos establecida con éxito');
    })
    .catch((err) => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

module.exports = sequelize;
