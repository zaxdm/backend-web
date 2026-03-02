'use strict';
const MailConfig = require('../models/mail_config');
const { withDB } = require('../config/sequelize');
const nodemailer = require('nodemailer');

exports.getMailConfig = async (req, res) => {
  try {
    const config = await withDB(async () => {
      const found = await MailConfig.findOne();
      return found;
    });
    if (!config) return res.json({ mailUser: '', mailPass: '' });
    res.json({ mailUser: config.mailUser, mailPass: '••••••••' }); // nunca devuelves la pass real
  } catch (error) {
    console.error('Error al obtener MailConfig:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.saveMailConfig = async (req, res) => {
  try {
    const { mailUser, mailPass } = req.body;
    if (!mailUser || !mailPass) {
      return res.status(400).json({ message: 'mailUser y mailPass son requeridos' });
    }

    await withDB(async () => {
      const existing = await MailConfig.findOne();
      if (existing) {
        await existing.update({ mailUser, mailPass });
      } else {
        await MailConfig.create({ mailUser, mailPass });
      }
    });

    res.json({ success: true, message: 'Configuración guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar MailConfig:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.testMailConfig = async (req, res) => {
  try {
    const config = await MailConfig.findOne();
    if (!config) return res.status(404).json({ message: 'No hay configuración guardada' });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: config.mailUser, pass: config.mailPass }
    });

    await transporter.sendMail({
      from: `"Test Terelion" <${config.mailUser}>`,
      to: config.mailUser,
      subject: 'Test de configuración de correo ✅',
      html: '<p>Si ves este correo, la configuración es correcta.</p>'
    });

    res.json({ success: true, message: 'Correo de prueba enviado correctamente' });
  } catch (error) {
    console.error('Error en test de correo:', error.message);
    res.status(500).json({ message: 'Error al enviar correo de prueba: ' + error.message });
  }
};