'use strict';
const express = require('express');
const router = express.Router();
const verificarToken = require('../../middleware/auth');
const { getMailConfig, saveMailConfig, testMailConfig } = require('../../controllers/mailConfigController');

router.get('/', verificarToken, getMailConfig);
router.post('/', verificarToken, saveMailConfig);
router.post('/test', verificarToken, testMailConfig);

module.exports = router;