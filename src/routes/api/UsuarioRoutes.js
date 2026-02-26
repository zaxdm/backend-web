const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/UsuarioController');

// ------------------ PERFIL ------------------
// Esto debe ir antes de '/:id' para que no choque
router.get('/perfil', usuarioController.obtenerPerfil);

// ------------------ USUARIOS ------------------
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// ------------------ REGISTRO PÚBLICO ------------------
router.post('/', usuarioController.registrarUsuario);

// ------------------ ACTUALIZAR Y ELIMINAR ------------------
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;