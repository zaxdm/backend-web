'use strict';

const express = require('express');
const router = express.Router();
const footerController = require('../../controllers/footercontroller');
const verificarToken = require('../../middleware/auth');


router.get('/', footerController.getFooter);
router.post('/',verificarToken, footerController.createFooter);
router.put('/',verificarToken, footerController.updateFooter);
router.delete('/',verificarToken, footerController.deleteFooter);

module.exports = router;