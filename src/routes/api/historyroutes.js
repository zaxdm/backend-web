'use strict';

const express = require('express');
const router = express.Router();
const historyController = require('../../controllers/historycontroller');
const verificarToken = require('../../middleware/auth');


router.get('/', historyController.getHistory);
router.post('/',verificarToken, historyController.createHistory);
router.put('/',verificarToken, historyController.updateHistory);
router.delete('/',verificarToken, historyController.deleteHistory);

module.exports = router;