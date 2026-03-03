'use strict';

const SmtpConfig = require('../models/smtp_config');
const { withDB } = require('../config/sequelize');

exports.getSmtpConfig = async (req, res) => {
  try {
    const config = await withDB(async () => {
      let found = await SmtpConfig.findOne();
      if (!found) found = await SmtpConfig.create({ user: '', pass: '' });
      return found;
    });

    // Nunca devolver la contraseña
    res.json({ id: config.id, user: config.user, hasPassword: !!config.pass });

  } catch (error) {
    console.error('Error al obtener SMTP Config:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateSmtpConfig = async (req, res) => {
  try {
    const { user, pass } = req.body;

    if (!user) {
      return res.status(400).json({ message: 'El correo remitente es obligatorio.' });
    }

    const config = await withDB(async () => {
      let found = await SmtpConfig.findOne();
      if (!found) throw Object.assign(new Error('No existe configuración para actualizar'), { status: 404 });

      const updateData = { user };
      // Solo actualizar pass si se envió uno nuevo
      if (pass && pass.trim()) updateData.pass = pass;

      await found.update(updateData);
      return found;
    });

    res.json({ id: config.id, user: config.user, hasPassword: !!config.pass });

  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar SMTP Config:', error.message);
    res.status(status).json({ message: error.message });
  }
};