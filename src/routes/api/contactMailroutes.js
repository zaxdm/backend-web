'use strict';
const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../../controllers/contactMailController');

router.post('/send', sendContactEmail);

module.exports = router;