'use strict';

const SmtpConfig = require('../models/smtp_config');
const { withDB } = require('../config/sequelize');

const DEFAULT_SMTP = {
  host:     'smtp.gmail.com',
  port:     587,
  secure:   false,
  user:     '',
  pass:     '',
  fromName: 'Formulario Web Terelion'
};

// GET /api/smtp-config  — devuelve config sin exponer la contraseña
exports.getSmtpConfig = async (req, res) => {
  try {
    const config = await withDB(async () => {
      let found = await SmtpConfig.findOne();
      if (!found) found = await SmtpConfig.create(DEFAULT_SMTP);
      return found;
    });

    // ⚠️ Nunca devolver la contraseña al frontend
    const { pass, ...safe } = config.toJSON();
    res.json({ ...safe, hasPassword: !!pass });

  } catch (error) {
    console.error('Error al obtener SMTP Config:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// PUT /api/smtp-config  — actualiza config (requiere token)
exports.updateSmtpConfig = async (req, res) => {
  try {
    const { host, port, secure, user, pass, fromName } = req.body;

    if (!host || !port || !user || !fromName) {
      return res.status(400).json({ message: 'host, port, user y fromName son requeridos.' });
    }

    const config = await withDB(async () => {
      let found = await SmtpConfig.findOne();
      if (!found) throw Object.assign(new Error('No existe configuración para actualizar'), { status: 404 });

      const updateData = { host, port: Number(port), secure: !!secure, user, fromName };

      // Solo actualizar pass si se envió uno nuevo (no vacío)
      if (pass && pass.trim()) updateData.pass = pass;

      await found.update(updateData);
      return found;
    });

    const { pass: _, ...safe } = config.toJSON();
    res.json({ ...safe, hasPassword: true });

  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar SMTP Config:', error.message);
    res.status(status).json({ message: error.message });
  }
};