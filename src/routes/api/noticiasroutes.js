'use strict';

const express = require('express');
const router = express.Router();
const noticiasController = require('../../controllers/noticiascontroller');

router.get('/', noticiasController.getNoticias);
router.get('/:id', noticiasController.getNoticiaById);
router.post('/', noticiasController.createNoticia);
router.put('/:id', noticiasController.updateNoticia);
router.delete('/:id', noticiasController.deleteNoticia);

module.exports = router;