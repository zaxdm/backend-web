'use strict';

const express = require('express');
const router = express.Router();
const noticiasController = require('../../controllers/noticiascontroller');
const verificarToken = require('../../middleware/auth');


router.get('/', noticiasController.getNoticias);
router.get('/:id', noticiasController.getNoticiaById);

router.post('/',verificarToken, noticiasController.createNoticia);

router.put('/:id',verificarToken, noticiasController.updateNoticia);
router.delete('/:id',verificarToken, noticiasController.deleteNoticia);

module.exports = router;