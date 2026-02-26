'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/generalProductPagecontroller');
const verificarToken = require('../../middleware/auth');

router.get('/', controller.getGeneralProductPage);
router.post('/',verificarToken, controller.createGeneralProductPage);
router.put('/',verificarToken, controller.updateGeneralProductPage);
router.delete('/',verificarToken, controller.deleteGeneralProductPage);

module.exports = router;