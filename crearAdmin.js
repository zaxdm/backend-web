// require('dotenv').config();
// const { Sequelize, DataTypes } = require('sequelize');
// const bcrypt = require('bcryptjs');

// ── Conexión directa a Clever Cloud ──────────────────────────
// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host:    process.env.DB_HOST,
//     port:    process.env.DB_PORT || 3306,
//     dialect: 'mysql',
//     logging: false,
//   }
// );

// ── Datos del usuario a crear ────────────────────────────────
// const USUARIO = {
//   codigo_dni: '12345678',
//   apellidos:  'Administrador',
//   nombres:    'Sistema',
//   correo:     'admin@sistema.com',   // ← cambia esto
//   password:   'Admin123',            // ← cambia esto
//   rol:        'admin',
//   cargo:      null,
// };

// ── Script ───────────────────────────────────────────────────
// async function crearUsuario() {
//   try {
//     await sequelize.authenticate();
//     console.log('✅ Conexión a la base de datos exitosa');

//     const hashedPassword = await bcrypt.hash(USUARIO.password, 10);

//     const [result] = await sequelize.query(
//       `INSERT INTO usuarios 
//         (codigo_dni, apellidos, nombres, correo, password, rol, cargo, createdAt, updatedAt)
//        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
//       {
//         replacements: [
//           USUARIO.codigo_dni,
//           USUARIO.apellidos,
//           USUARIO.nombres,
//           USUARIO.correo,
//           hashedPassword,
//           USUARIO.rol,
//           USUARIO.cargo,
//         ]
//       }
//     );

//     console.log('✅ Usuario creado correctamente');
//     console.log('─────────────────────────────────');
//     console.log('  Correo  :', USUARIO.correo);
//     console.log('  Password:', USUARIO.password);
//     console.log('  Rol     :', USUARIO.rol);
//     console.log('─────────────────────────────────');
//     console.log('Ya puedes iniciar sesión con estas credenciales.');

//   } catch (error) {
//     if (error.original?.code === 'ER_DUP_ENTRY') {
//       console.error('❌ Ya existe un usuario con ese correo o DNI.');
//     } else {
//       console.error('❌ Error:', error.message);
//     }
//   } finally {
//     await sequelize.close();
//     process.exit(0);
//   }
// }

// crearUsuario();