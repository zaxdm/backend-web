'use strict';

const express = require('express');
const router = express.Router();
const aboutController = require('../../controllers/aboutcontroller');
const verificarToken = require('../../middleware/auth');


router.get('/', aboutController.getAbout);
router.post('/',verificarToken, aboutController.createAbout);
router.put('/',verificarToken, aboutController.updateAbout);
router.delete('/',verificarToken, aboutController.deleteAbout);

module.exports = router;