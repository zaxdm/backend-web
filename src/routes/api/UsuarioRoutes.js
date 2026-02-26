const express = require('express');
const router = express.Router();
const usuarioController = require('../../controllers/UsuarioController');
const verificarToken = require('../../middleware/auth'); // si quieres proteger rutas de admin

// ==============================================
// Rutas públicas
// ==============================================
// Registro público: cualquier persona puede crear su cuenta
router.post('/register', usuarioController.registrarUsuario);

// ==============================================
// Rutas protegidas (requieren token/admin)
// ==============================================
router.get('/', verificarToken, usuarioController.obtenerUsuarios);
router.get('/:id', verificarToken, usuarioController.obtenerUsuarioPorId);
router.post('/', verificarToken, usuarioController.crearUsuario);
router.put('/:id', verificarToken, usuarioController.actualizarUsuario);
router.delete('/:id', verificarToken, usuarioController.eliminarUsuario);
router.get('/perfil', verificarToken, usuarioController.obtenerPerfil);

module.exports = router;