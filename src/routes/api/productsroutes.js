'use strict';

const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productscontroller');
const verificarToken = require('../../middleware/auth');

// GET todos los productos
router.get('/', productsController.getProducts);

// GET / PUT / DELETE por ruta (query param) — PRINCIPAL para el frontend
router.get('/by-ruta',    productsController.getProductByRuta);
router.put('/by-ruta',    verificarToken, productsController.updateProductByRuta);
router.delete('/by-ruta', verificarToken, productsController.deleteProductByRuta); // ✅ NUEVO

// GET / PUT / DELETE por ID numérico (compatibilidad)
router.get('/:id',    productsController.getProductById);
router.post('/',      verificarToken, productsController.createProduct);
router.put('/:id',    verificarToken, productsController.updateProduct);
router.delete('/:id', verificarToken, productsController.deleteProduct);

module.exports = router;