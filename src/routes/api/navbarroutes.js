'use strict';

const express = require('express');
const router = express.Router();
const navbarController = require('../../controllers/navbarcontroller');

router.get('/', navbarController.getNavbar);
router.post('/', navbarController.createNavbar);
router.put('/', navbarController.updateNavbar);
router.delete('/', navbarController.deleteNavbar);

module.exports = router;