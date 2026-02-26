'use strict';

const express = require('express');
const router = express.Router();
const verificarToken = require('../../middleware/auth');
const masInfoController = require('../../controllers/masInfocontroller');

router.get('/', masInfoController.getMasInfo);
router.post('/',verificarToken, masInfoController.createMasInfo);
router.put('/',verificarToken, masInfoController.updateMasInfo);
router.delete('/',verificarToken, masInfoController.deleteMasInfo);

module.exports = router;