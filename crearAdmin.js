// crearAdmin.js
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');

// Configura tu conexión a la DB igual que en tu proyecto
const sequelize = new Sequelize('nombre_base_datos', 'usuario', 'contraseña', {
  host: 'localhost',
  dialect: 'mysql', // o 'postgres', según tu DB
});

// Define modelo Usuario (igual que tu modelo real)
const Usuario = sequelize.define('Usuario', {
  codigo_dni: { type: DataTypes.STRING, allowNull: false },
  apellidos: { type: DataTypes.STRING, allowNull: false },
  nombres: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.STRING, allowNull: true },
  correo: { type: DataTypes.STRING, allowNull: true, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'usuarios',
  timestamps: true
});

async function crearAdmin() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a DB exitosa');

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash('Admin123', 10); // <-- Cambia la contraseña si quieres

    // Crear usuario admin
    const admin = await Usuario.create({
      codigo_dni: '00000000',
      apellidos: 'Admin',
      nombres: 'Admin',
      rol: 'admin',
      correo: 'admins@example.com',
      password: hashedPassword
    });

    console.log('Usuario admin creado:', admin.toJSON());
    process.exit(0);
  } catch (err) {
    console.error('Error al crear admin:', err);
    process.exit(1);
  }
}

crearAdmin();