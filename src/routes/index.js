const express = require('express');
const router = express.Router();
const https = require('https');

const usuariosRoutes          = require('./api/UsuarioRoutes');
const authRoutes              = require('./api/authRoutes');
const homeRoutes              = require('./api/homeroutes');
const aboutRoutes             = require('./api/aboutroutes');
const contactPageRoutes       = require('./api/contactPageroutes');
const footerRoutes            = require('./api/footerroutes');
const generalProductPageRoutes = require('./api/generalProductPageroutes');
const historyRoutes           = require('./api/historyroutes');
const masInfoRoutes           = require('./api/masInforoutes');
const navbarRoutes            = require('./api/navbarroutes');
const noticiasRoutes          = require('./api/noticiasroutes');
const productsRoutes          = require('./api/productsroutes');
const contactMessagesRoutes   = require('./api/contactMessagesroutes');

const authController          = require('../controllers/authController');

router.use('/usuarios',              usuariosRoutes);
router.use('/auth',                  authRoutes);
router.use('/home',                  homeRoutes);
router.use('/about',                 aboutRoutes);
router.use('/contact-page',          contactPageRoutes);
router.use('/footer',                footerRoutes);
router.use('/general-product-page',  generalProductPageRoutes);
router.use('/history',               historyRoutes);
router.use('/mas-info',              masInfoRoutes);
router.use('/navbar',                navbarRoutes);
router.use('/noticias',              noticiasRoutes);
router.use('/products',              productsRoutes);
router.use('/contact-messages',      contactMessagesRoutes);
router.post('/login',                authController.autenticarUsuario);

// ─── Proxy descarga de PDFs desde Cloudinary ─────────────────────────────────
router.get('/download-pdf', (req, res) => {
  const url = req.query.url;

  if (!url || !url.startsWith('https://res.cloudinary.com')) {
    return res.status(400).json({ message: 'URL inválida' });
  }

  const filename = req.query.filename || 'documento.pdf';

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  https.get(url, (stream) => {
    stream.pipe(res);
  }).on('error', (err) => {
    console.error('Error al descargar PDF:', err);
    res.status(500).json({ message: 'Error al descargar el archivo' });
  });
});

module.exports = router;