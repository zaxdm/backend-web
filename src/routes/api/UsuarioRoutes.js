const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/UsuarioController');

// Montado en /api/usuarios
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

router.get('/perfil', usuarioController.obtenerPerfil);

module.exports = router;
