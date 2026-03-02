'use strict';

const express = require('express');
const router = express.Router();
const adminEmailConfigController = require('../../controllers/adminEmailConfigController');
const verificarToken = require('../../middleware/auth');

// GET: Obtener configuración actual
router.get('/', adminEmailConfigController.getEmailConfig);

// PUT: Actualizar configuración (requiere autenticación)
router.put('/', verificarToken, adminEmailConfigController.updateEmailConfig);

module.exports = router;