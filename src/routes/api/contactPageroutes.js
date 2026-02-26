'use strict';

const express = require('express');
const router = express.Router();
const contactPageController = require('../../controllers/contactPagecontroller');
const verificarToken = require('../../middleware/auth');


router.get('/', contactPageController.getContactPage);
router.post('/',verificarToken, contactPageController.createContactPage);
router.put('/',verificarToken, contactPageController.updateContactPage);
router.delete('/',verificarToken, contactPageController.deleteContactPage);

module.exports = router;