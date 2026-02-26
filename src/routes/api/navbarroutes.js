'use strict';

const express = require('express');
const router = express.Router();
const verificarToken = require('../../middleware/auth');
const navbarController = require('../../controllers/navbarcontroller');

router.get('/', navbarController.getNavbar);

router.post('/',verificarToken, navbarController.createNavbar);
router.put('/', verificarToken, navbarController.updateNavbar);
router.delete('/',verificarToken, navbarController.deleteNavbar);

module.exports = router;