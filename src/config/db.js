const mysql = require('mysql2');
require('dotenv').config();  


const pool = mysql.createPool({
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT || 3306, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    // Agregar esto:
    connectionLimit: 4,
    waitForConnections: true,
    queueLimit: 0
});

module.exports = pool.promise();
