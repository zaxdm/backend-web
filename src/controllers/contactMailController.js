'use strict';
const nodemailer = require('nodemailer');
const MailConfig = require('../models/mail_config');

// ✅ Singleton para sincronización de tabla
let tableInitialized = false;
let initPromise = null;

const initializeTable = async () => {
  // Si ya está inicializado, retorna inmediatamente
  if (tableInitialized) return;

  // Si está en proceso de inicialización, espera a que termine
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await MailConfig.sync({ alter: false });
      tableInitialized = true;
      console.log('✅ Tabla MailConfig sincronizada en contactEmailController');
    } catch (error) {
      console.error('❌ Error sincronizando tabla:', error.message);
      tableInitialized = false;
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
};

// ✅ Inicializar tabla cuando carga el módulo (sin bloquear)
initializeTable().catch(err => {
  console.warn('⚠️  Tabla no inicializada al startup, se reintenará en primer request');
});

exports.sendContactEmail = async (req, res) => {
  const { firstName, lastName, email, phone, company, message, toEmail, region, contactName } = req.body;

  // ✅ Validación de campos requeridos
  if (!toEmail || !email || !message || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: 'Faltan campos requeridos: firstName, lastName, email, message, toEmail'
    });
  }

  try {
    // ✅ Inicializar tabla (singleton)
    await initializeTable();

    // ✅ Obtener configuración de correo
    const config = await MailConfig.findOne();

    if (!config || !config.mailUser || !config.mailPass) {
      console.error('❌ No hay configuración de correo disponible');
      return res.status(500).json({
        success: false,
        error: 'No hay configuración de correo. Configúrala en el panel admin.'
      });
    }

    // ✅ Crear transporte con timeouts
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: config.mailUser,
        pass: config.mailPass
      },
      connectionTimeout: 5000,
      socketTimeout: 5000
    });

    // ✅ Enviar correo
    await transporter.sendMail({
      from: `"Web Terelion" <${config.mailUser}>`,
      to: toEmail,
      replyTo: email,
      subject: `Nuevo contacto desde web — ${region || 'Sin especificar'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #e74c3c; padding-bottom: 10px;">
            Nuevo mensaje de contacto
          </h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr style="background:#f8f8f8;">
              <td style="padding:8px; font-weight:bold; width:140px;">Región</td>
              <td style="padding:8px;">${region || '—'}</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold;">Contacto asignado</td>
              <td style="padding:8px;">${contactName || '—'}</td>
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

    console.log('✅ Correo de contacto enviado a:', toEmail);

    res.json({
      success: true,
      message: 'Correo enviado correctamente'
    });

  } catch (err) {
    console.error('❌ Error enviando correo:', err.message);

    // Mensajes de error específicos
    let errorMessage = 'Error al enviar el correo';
    if (err.message.includes('Invalid login')) {
      errorMessage = 'Error de autenticación en Gmail. Verifica las credenciales.';
    } else if (err.message.includes('ENOTFOUND') || err.message.includes('ECONNREFUSED')) {
      errorMessage = 'No se puede conectar al servidor SMTP de Gmail.';
    }

    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
};