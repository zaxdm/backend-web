const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/UsuarioController');

router.post('/register', usuarioController.registrarUsuario);

router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;