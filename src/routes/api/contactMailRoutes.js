'use strict';

const express = require('express');
const router = express.Router();
const contactMailController = require('../../controllers/contactMailController');

router.post('/send', contactMailController.sendContactMail);

module.exports = router;