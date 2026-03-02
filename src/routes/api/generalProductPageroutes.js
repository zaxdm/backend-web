'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/generalProductPagecontroller');
const verificarToken = require('../../middleware/auth');

// GET todas las páginas (útil para debug/admin)
router.get('/all', verificarToken, controller.getAllGeneralProductPages);

// GET / PUT / DELETE por categoryKey como query param
// Ej: GET /api/general-product-page?categoryKey=/productos/categoria-1
router.get('/',    controller.getGeneralProductPage);
router.put('/',    verificarToken, controller.updateGeneralProductPage);
router.delete('/', verificarToken, controller.deleteGeneralProductPage);

module.exports = router;