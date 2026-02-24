'use strict';

const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productscontroller');
const uploadPdf = require('../../config/uploadPdfOperaciones');

// GET
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);

// POST con subida de archivos
router.post('/', uploadPdf.any(), productsController.createProduct);

// PUT con subida de archivos
router.put('/:id', uploadPdf.any(), productsController.updateProduct);

// DELETE
router.delete('/:id', productsController.deleteProduct);

module.exports = router;
