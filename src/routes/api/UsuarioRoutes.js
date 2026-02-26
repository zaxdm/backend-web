const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/UsuarioController');

// Registro público
router.post('/register', usuarioController.registrarUsuario);

// Resto de rutas protegidas
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

router.get('/perfil', usuarioController.obtenerPerfil);

module.exports = router;