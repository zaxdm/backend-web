// routes/contact-messages.js
'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../../controllers/contact-messagescontroller');
const verificarToken = require('../../middleware/auth');

// GET todos los mensajes (admin - requiere token)
router.get('/', verificarToken, controller.getMessages);

// GET estadísticas (admin - requiere token)
router.get('/stats', verificarToken, controller.getStats);

// GET un mensaje (admin - requiere token)
router.get('/:id', verificarToken, controller.getMessage);

// POST crear mensaje (público - sin token, desde formulario)
router.post('/', controller.createMessage);

// PATCH marcar como leído (admin - requiere token)
router.patch('/:id/read', verificarToken, controller.markAsRead);

// DELETE eliminar mensaje (admin - requiere token)
router.delete('/:id', verificarToken, controller.deleteMessage);

module.exports = router;