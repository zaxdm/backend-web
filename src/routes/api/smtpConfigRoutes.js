'use strict';

const express = require('express');
const router = express.Router();
const smtpConfigController = require('../../controllers/smtpConfigController');
const verificarToken = require('../../middleware/auth');

router.get('/',  verificarToken, smtpConfigController.getSmtpConfig);   // solo admin
router.put('/',  verificarToken, smtpConfigController.updateSmtpConfig);

module.exports = router;