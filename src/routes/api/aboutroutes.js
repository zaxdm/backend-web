'use strict';

const express = require('express');
const router = express.Router();
const aboutController = require('../../controllers/aboutcontroller');

router.get('/', aboutController.getAbout);
router.post('/', aboutController.createAbout);
router.put('/', aboutController.updateAbout);
router.delete('/', aboutController.deleteAbout);

module.exports = router;