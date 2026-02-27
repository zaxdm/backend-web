'use strict';

const express = require('express');
const router = express.Router();
const homeController = require('../../controllers/homecontroller');
const verificarToken = require('../../middleware/auth');
const upload = require('../../config/uploadCards');



router.get('/', homeController.getHome);
router.post('/',verificarToken, homeController.updateHome);
router.put('/', upload.fields([
  { name: 'cardImage_0' }, { name: 'cardImage_1' },
  { name: 'cardImage_2' }, { name: 'cardImage_3' },
  { name: 'cardImage_4' }
]), homeController.updateHome);
router.delete('/',verificarToken, homeController.deleteHome);

module.exports = router;
