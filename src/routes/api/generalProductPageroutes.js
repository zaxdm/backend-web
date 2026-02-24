'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/generalProductPagecontroller');

router.get('/', controller.getGeneralProductPage);
router.post('/', controller.createGeneralProductPage);
router.put('/', controller.updateGeneralProductPage);
router.delete('/', controller.deleteGeneralProductPage);

module.exports = router;