'use strict';

const express = require('express');
const router = express.Router();
const contactMailController = require('../../controllers/contactMailController');

// POST: Enviar contacto
router.post('/send', contactMailController.sendContactMail);

module.exports = router;