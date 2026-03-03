'use strict';

const express = require('express');
const router = express.Router();
const smtpConfigController = require('../../controllers/smtpConfigController');
const verificarToken = require('../../middleware/auth');

// ✅ OPTIONS debe pasar libre para el preflight de CORS
router.options('*', (req, res) => res.sendStatus(200));

router.get('/',  verificarToken, smtpConfigController.getSmtpConfig);
router.put('/',  verificarToken, smtpConfigController.updateSmtpConfig);

module.exports = router;