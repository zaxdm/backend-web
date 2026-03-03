// routes/mas-info.js
'use strict';

const express = require('express');
const router = express.Router();
const verificarToken = require('../../middleware/auth');
const masInfoController = require('../../controllers/masInfocontroller');

// GET / POST / PUT / DELETE básicos
router.get('/', masInfoController.getMasInfo);
router.post('/', verificarToken, masInfoController.createMasInfo);
router.put('/', verificarToken, masInfoController.updateMasInfo);
router.delete('/', verificarToken, masInfoController.deleteMasInfo);

// Ruta para subir imágenes
router.post('/upload', verificarToken, masInfoController.uploadImage);

module.exports = router;