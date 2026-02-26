const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/UsuarioController');

// Base mount is /api/usuarios in routes/index.js
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

// Extra endpoint: /api/usuarios/perfil
router.get('/perfil', usuarioController.obtenerPerfil);

module.exports = router;
