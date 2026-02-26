const express = require('express');
const router = express.Router();

const usuariosRoutes = require('./api/UsuarioRoutes');
const authRoutes = require('./api/authRoutes');
const homeRoutes = require('./api/homeroutes');
const aboutRoutes = require('./api/aboutroutes');
const contactPageRoutes = require('./api/contactPageroutes');
const footerRoutes = require('./api/footerroutes');
const generalProductPageRoutes = require('./api/generalProductPageroutes');
const historyRoutes = require('./api/historyroutes');
const masInfoRoutes = require('./api/masInforoutes');
const navbarRoutes = require('./api/navbarroutes');
const noticiasRoutes = require('./api/noticiasroutes');
const productsRoutes = require('./api/productsroutes');
const authController = require('../controllers/authController');

router.use('/usuarios', usuariosRoutes);
router.use('/auth', authRoutes);
router.use('/home', homeRoutes);
router.use('/about', aboutRoutes);
router.use('/contact-page', contactPageRoutes);
router.use('/footer', footerRoutes);
router.use('/general-product-page', generalProductPageRoutes);
router.use('/history', historyRoutes);
router.use('/mas-info', masInfoRoutes);
router.use('/navbar', navbarRoutes);
router.use('/noticias', noticiasRoutes);
router.use('/products', productsRoutes);

// Alias de compatibilidad: /api/login
router.post('/login', authController.autenticarUsuario);

module.exports = router;
