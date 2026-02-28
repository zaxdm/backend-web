'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/generalProductPagecontroller');
const verificarToken = require('../../middleware/auth');

// GET todas las páginas (útil para debug)
router.get('/', verificarToken, controller.getAllGeneralProductPages);

// GET página de una categoría específica por su ruta (ej: /api/general-product-page//productos/general)
// El frontend llama a esto al seleccionar una categoría
router.get('/:categoryKey(*)', controller.getGeneralProductPage);

// PUT actualiza (o crea si no existe) la página de una categoría
// El frontend llama a esto al guardar cambios
router.put('/:categoryKey(*)', verificarToken, controller.updateGeneralProductPage);

// DELETE elimina la página de una categoría
router.delete('/:categoryKey(*)', verificarToken, controller.deleteGeneralProductPage);

module.exports = router;