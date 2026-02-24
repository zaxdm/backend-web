'use strict';

const express = require('express');
const router = express.Router();
const contactPageController = require('../../controllers/contactPagecontroller');

router.get('/', contactPageController.getContactPage);
router.post('/', contactPageController.createContactPage);
router.put('/', contactPageController.updateContactPage);
router.delete('/', contactPageController.deleteContactPage);

module.exports = router;