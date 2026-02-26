'use strict';

const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/homecontroller');
const verificarToken = require('../../middleware/auth');


router.get('/', homeController.getHome);
router.post('/',verificarToken, homeController.updateHome);
router.put('/',verificarToken, homeController.updateHome);
router.delete('/',verificarToken, homeController.deleteHome);

module.exports = router;
