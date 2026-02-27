'use strict';

const express = require('express');
const router = express.Router();
const productsController = require('../../controllers/productscontroller');
const verificarToken = require('../../middleware/auth');

// ✅ Sin multer — todo viene como JSON
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProductById);
router.post('/', verificarToken, productsController.createProduct);
router.put('/:id', verificarToken, productsController.updateProduct);
router.delete('/:id', verificarToken, productsController.deleteProduct);

module.exports = router;