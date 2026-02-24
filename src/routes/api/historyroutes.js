'use strict';

const express = require('express');
const router = express.Router();
const historyController = require('../../controllers/historycontroller');

router.get('/', historyController.getHistory);
router.post('/', historyController.createHistory);
router.put('/', historyController.updateHistory);
router.delete('/', historyController.deleteHistory);

module.exports = router;