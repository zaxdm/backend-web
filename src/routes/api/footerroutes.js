'use strict';

const express = require('express');
const router = express.Router();
const footerController = require('../../controllers/footercontroller');

router.get('/', footerController.getFooter);
router.post('/', footerController.createFooter);
router.put('/', footerController.updateFooter);
router.delete('/', footerController.deleteFooter);

module.exports = router;