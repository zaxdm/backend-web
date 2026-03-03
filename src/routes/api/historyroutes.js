// routes/history.js
'use strict';

const express = require('express');
const router = express.Router();
const historyController = require('../../controllers/historycontroller');
const verificarToken = require('../../middleware/auth');

// Rutas básicas CRUD
router.get('/', historyController.getHistory);
router.post('/', verificarToken, historyController.createHistory);
router.put('/', verificarToken, historyController.updateHistory);
router.delete('/', verificarToken, historyController.deleteHistory);

// Ruta para subir imagen base64 a Cloudinary
router.post('/upload', verificarToken, historyController.uploadImage);

module.exports = router;