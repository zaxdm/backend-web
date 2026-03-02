'use strict';
const nodemailer = require('nodemailer');
const MailConfig = require('../models/mail_config');

// ✅ Sincronización único — solo se ejecuta UNA VEZ cuando se importa el módulo
let syncPromise = null;

const ensureTable = async () => {
  // Si ya está sincronizando, espera a que termine
  if (syncPromise) return syncPromise;
  
  // Si la tabla ya existe, no hacer nada
  if (MailConfig.tableName) return;
  
  // Sincronizar tabla — solo la primera vez
  syncPromise = MailConfig.sync({ alter: false }).catch(err => {
    console.error('Error al sincronizar tabla:', err);
    syncPromise = null; // Reset para reintentar si falla
    throw err;
  });
  
  return syncPromise;
};

// ✅ Ejecutar sincronización una sola vez al cargar el módulo
ensureTable().catch(err => console.error('Sincronización inicial fallida:', err));

exports.getMailConfig = async (req, res) => {
  try {
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

exports.sendContactEmail = async (req, res) => {
  const { firstName, lastName, email, phone, company, message, toEmail, region, contactName } = req.body;

  if (!toEmail || !email || !message || !firstName || !lastName) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const config = await MailConfig.findOne();
    if (!config) {
      return res.status(500).json({ error: 'No hay configuración de correo. Configúrala en el panel admin.' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: config.mailUser, pass: config.mailPass }
    });

    await transporter.sendMail({
      from: `"Web Terelion" <${config.mailUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `Nuevo contacto desde web — ${region}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr style="background:#f8f8f8;">
              <td style="padding:8px; font-weight:bold; width:140px;">Región</td>
              <td style="padding:8px;">${region}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Contacto asignado</td>
              <td style="padding:8px;">${contactName}</td>
            </tr>
            <tr style="background:#f8f8f8;">
              <td style="padding:8px; font-weight:bold;">Nombre</td>
              <td style="padding:8px;">${firstName} ${lastName}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Email</td>
              <td style="padding:8px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr style="background:#f8f8f8;">
              <td style="padding:8px; font-weight:bold;">Teléfono</td>
              <td style="padding:8px;">${phone || '—'}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Empresa</td>
              <td style="padding:8px;">${company || '—'}</td>
            </tr>
          </table>
          <h3 style="margin-top:20px;">Mensaje:</h3>
          <p style="background:#f5f5f5; padding:15px; border-radius:6px; border-left: 4px solid #e74c3c;">
            ${message}
          </p>
          <p style="color:#999; font-size:12px; margin-top:30px;">
            Enviado desde el formulario de contacto del sitio web.
          </p>
        </div>
      `
    });

    res.json({ success: true, message: 'Correo enviado correctamente' });

  } catch (err) {
    console.error('Error enviando correo:', err);
    res.status(500).json({ error: 'Error al enviar el correo' });
  }
};