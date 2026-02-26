const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Usuario = require('../models/Usuario');
const verificarToken = require('../middleware/auth');

/* ======================================================
   OBTENER TODOS LOS USUARIOS
====================================================== */
exports.obtenerUsuarios = [
  verificarToken,
  async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['password'] },
        order: [['apellidos', 'ASC']]
      });

      res.status(200).json(usuarios);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  }
];


/* ======================================================
   OBTENER USUARIO POR ID
====================================================== */
exports.obtenerUsuarioPorId = [
  verificarToken,
  async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id, {
        attributes: { exclude: ['password'] }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  }
];


/* ======================================================
   CREAR USUARIO
====================================================== */
exports.crearUsuario = [
  async (req, res) => {
    try {
      const { codigo_dni, apellidos, nombres, cargo, rol, correo, password } = req.body;

      // Validar DNI duplicado
      const existeDni = await Usuario.findOne({ where: { codigo_dni } });
      if (existeDni) {
        return res.status(400).json({ error: 'Ya existe un usuario con ese DNI' });
      }

      // Validar correo duplicado
      if (correo) {
        const existeCorreo = await Usuario.findOne({ where: { correo } });
        if (existeCorreo) {
          return res.status(400).json({ error: 'El correo ya está en uso' });
        }
      }

      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const nuevoUsuario = await Usuario.create({
        codigo_dni,
        apellidos,
        nombres,
        cargo: cargo || null,
        rol: rol || null,
        correo: correo || null,
        password: hashedPassword
      });

      res.status(201).json({
        message: 'Usuario creado correctamente',
        usuario: {
          id: nuevoUsuario.id,
          codigo_dni,
          apellidos,
          nombres,
          cargo,
          rol,
          correo
        }
      });

    } catch (error) {
      console.error('Error al crear usuario:', error);
      // Responder errores comunes con 400 para el frontend
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'El correo ya está en uso' });
      }
      if (error.name === 'SequelizeValidationError') {
        const msg = error.errors?.[0]?.message || 'Datos inválidos';
        return res.status(400).json({ error: msg });
      }
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }
];


/* ======================================================
   ACTUALIZAR USUARIO
====================================================== */
exports.actualizarUsuario = [
  verificarToken,
  async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const { codigo_dni, apellidos, nombres, cargo, rol, correo, password } = req.body;

      // Validar correo duplicado si cambia
      if (correo && correo !== usuario.correo) {
        const existeCorreo = await Usuario.findOne({ where: { correo } });
        if (existeCorreo) {
          return res.status(400).json({ error: 'El correo ya está en uso' });
        }
      }

      // Si envían nueva contraseña
      if (password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(password, salt);
      }

      usuario.codigo_dni = codigo_dni ?? usuario.codigo_dni;
      usuario.apellidos = apellidos ?? usuario.apellidos;
      usuario.nombres = nombres ?? usuario.nombres;
      usuario.cargo = cargo ?? usuario.cargo;
      usuario.rol = rol ?? usuario.rol;
      usuario.correo = correo ?? usuario.correo;

      await usuario.save();

      res.status(200).json({ message: 'Usuario actualizado correctamente' });

    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }
];


/* ======================================================
   ELIMINAR USUARIO
====================================================== */
exports.eliminarUsuario = [
  verificarToken,
  async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await usuario.destroy();

      res.status(200).json({ message: 'Usuario eliminado correctamente' });

    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
];


/* ======================================================
   OBTENER PERFIL DEL USUARIO LOGUEADO
====================================================== */
exports.obtenerPerfil = [
  verificarToken,
  async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.status(200).json(usuario);

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  }
];

