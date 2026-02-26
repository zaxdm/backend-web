'use strict';

const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productscontroller');
const uploadPdf = require('../../config/uploadPdfOperaciones');
const verificarToken = require('../../middleware/auth');

// GET
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);

// POST con subida de archivos
router.post('/', uploadPdf.any(),verificarToken, productsController.createProduct);

// PUT con subida de archivos
router.put('/:id', uploadPdf.any(),verificarToken, productsController.updateProduct);

// DELETE
router.delete('/:id',verificarToken, productsController.deleteProduct);

module.exports = router;
