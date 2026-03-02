'use strict';
const nodemailer = require('nodemailer');
const MailConfig = require('../models/mail_config');

// ✅ Solo sincroniza UNA vez por instancia caliente de Vercel
let tableReady = false;

const ensureTable = async () => {
  if (tableReady) return;
  await MailConfig.sync({ force: false }); // ✅ force: false = solo crea si no existe, sin alter
  tableReady = true;
};

exports.getMailConfig = async (req, res) => {
  try {
    await ensureTable();
    const config = await MailConfig.findOne();
    if (!config) return res.json({ mailUser: '' });
    res.json({ mailUser: config.mailUser });
  } catch (error) {
    console.error('Error al obtener MailConfig:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.saveMailConfig = async (req, res) => {
  try {
    await ensureTable();
    const { mailUser, mailPass } = req.body;
    if (!mailUser || !mailPass) {
      return res.status(400).json({ message: 'mailUser y mailPass son requeridos' });
    }
    const existing = await MailConfig.findOne();
    if (existing) {
      await existing.update({ mailUser, mailPass });
    } else {
      await MailConfig.create({ mailUser, mailPass });
    }
    res.json({ success: true, message: 'Configuración guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar MailConfig:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.testMailConfig = async (req, res) => {
  try {
    await ensureTable();
    const config = await MailConfig.findOne();
    if (!config) return res.status(404).json({ message: 'No hay configuración guardada. Guarda primero las credenciales.' });

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
    res.status(500).json({ message: 'Error: ' + error.message });
  }
};