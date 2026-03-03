// controllers/contact-messages.controller.js
'use strict';

const ContactMessage = require('../models/contact_messages');
const { withDB } = require('../config/sequelize');

// GET todos los mensajes (admin)
exports.getMessages = async (req, res) => {
  try {
    const messages = await withDB(async () => {
      return await ContactMessage.findAll({
        order: [['createdAt', 'DESC']],
        raw: true
      });
    });
    res.json(messages);
  } catch (error) {
    console.error('Error al obtener mensajes:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// GET un mensaje por ID
exports.getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await withDB(async () => {
      return await ContactMessage.findByPk(id, { raw: true });
    });
    
    if (!message) {
      return res.status(404).json({ message: 'Mensaje no encontrado' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Error al obtener mensaje:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// POST crear mensaje (desde formulario de contacto)
exports.createMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, message, region, contactName, toEmail } = req.body;

    if (!firstName || !lastName || !email || !message || !region) {
      return res.status(400).json({ message: 'Campos requeridos faltantes' });
    }

    const newMessage = await withDB(async () => {
      return await ContactMessage.create({
        firstName,
        lastName,
        email,
        phone: phone || null,
        company: company || null,
        message,
        region,
        contactName,
        toEmail,
        read: false
      });
    });

    res.status(201).json({
      message: 'Mensaje guardado correctamente',
      data: newMessage
    });
  } catch (error) {
    console.error('Error al crear mensaje:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PATCH marcar como leído
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await withDB(async () => {
      const msg = await ContactMessage.findByPk(id);
      if (!msg) {
        throw Object.assign(new Error('Mensaje no encontrado'), { status: 404 });
      }
      await msg.update({ read: true });
      return msg;
    });

    res.json({ message: 'Mensaje marcado como leído', data: message });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar mensaje:', error.message);
    res.status(status).json({ message: error.message });
  }
};

// DELETE eliminar mensaje
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    await withDB(async () => {
      const message = await ContactMessage.findByPk(id);
      if (!message) {
        throw Object.assign(new Error('Mensaje no encontrado'), { status: 404 });
      }
      await message.destroy();
    });

    res.json({ message: 'Mensaje eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar mensaje:', error.message);
    res.status(status).json({ message: error.message });
  }
};

// GET estadísticas
exports.getStats = async (req, res) => {
  try {
    const stats = await withDB(async () => {
      const total = await ContactMessage.count();
      const unread = await ContactMessage.count({ where: { read: false } });
      const read = total - unread;
      
      return {
        total,
        unread,
        read
      };
    });

    res.json(stats);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};