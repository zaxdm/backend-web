'use strict';

const express = require('express');
const router = express.Router();
const masInfoController = require('../../controllers/masInfocontroller');

router.get('/', masInfoController.getMasInfo);
router.post('/', masInfoController.createMasInfo);
router.put('/', masInfoController.updateMasInfo);
router.delete('/', masInfoController.deleteMasInfo);

module.exports = router;