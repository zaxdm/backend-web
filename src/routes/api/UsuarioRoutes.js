const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/UsuarioController');

router.get('/perfil', usuarioController.obtenerPerfil);

router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);

router.post('/', usuarioController.registrarUsuario);

router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;