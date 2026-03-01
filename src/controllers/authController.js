require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { withDB } = require('../config/sequelize');
const { QueryTypes } = require('sequelize');


exports.autenticarUsuario = async (req, res) => {
  const { correo, password } = req.body;
  try {
    const rows = await sequelize.query(
      'SELECT * FROM usuarios WHERE correo = ? LIMIT 1',
      { replacements: [correo], type: QueryTypes.SELECT }
    );
    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }
    const usuario = rows[0];
    const esValida = await bcrypt.compare(password, usuario.password);
    if (!esValida) {
      return res.status(400).json({ error: 'Credenciales incorrectas' });
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('La clave secreta (JWT_SECRET) no está configurada');
    }
    const payload = {
      id: usuario.id,
      codigo_dni: usuario.codigo_dni,
      apellidos: usuario.apellidos,
      nombres: usuario.nombres,
      rol: usuario.rol || null,
      correo: usuario.correo || null
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });
    const usuarioSanitizado = {
      id: usuario.id,
      codigo_dni: usuario.codigo_dni,
      apellidos: usuario.apellidos,
      nombres: usuario.nombres,
      rol: usuario.rol || null,
      correo: usuario.correo || null
    };
    res.status(200).json({ token, usuario: usuarioSanitizado });
  } catch (error) {
    console.error('Error al autenticar al usuario:', error.message);
    res.status(500).json({ error: 'Error al autenticar al usuario' });
  }
};
