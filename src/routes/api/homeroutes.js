'use strict';

const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/homecontroller');

router.get('/', homeController.getHome);
router.post('/', homeController.updateHome);
router.put('/', homeController.updateHome);
router.delete('/', homeController.deleteHome);

module.exports = router;
