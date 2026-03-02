'use strict';
const nodemailer = require('nodemailer');
const MailConfig = require('../models/mail_config');

// ✅ Singleton pattern para sincronización
let tableInitialized = false;
let initPromise = null;

const initializeTable = async () => {
  // Si ya está inicializado, retorna inmediatamente
  if (tableInitialized) return;
  
  // Si está en proceso, espera a que termine
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Sincronizar solo sin alterar tabla existente
      await MailConfig.sync({ alter: false });
      tableInitialized = true;
      console.log('✅ MailConfig tabla sincronizada');
    } catch (error) {
      console.error('❌ Error sincronizando MailConfig:', error.message);
      tableInitialized = false;
      initPromise = null;
      throw error;
    }
  })();

  return initPromise;
};

// ✅ Inicializar tabla cuando el módulo se carga (no esperar)
initializeTable().catch(err => {
  console.warn('⚠️  Tabla no inicializada al startup, se inicializará en primer request');
});

exports.getMailConfig = async (req, res) => {
  try {
    await initializeTable();

    const config = await MailConfig.findOne();

    if (!config) {
      return res.json({ mailUser: '', success: true });
    }

    res.json({
      success: true,
      mailUser: config.mailUser
    });
  } catch (error) {
    console.error('❌ getMailConfig error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.saveMailConfig = async (req, res) => {
  try {
    await initializeTable();

    const { mailUser, mailPass } = req.body;

    if (!mailUser || !mailPass) {
      return res.status(400).json({
        success: false,
        message: 'mailUser y mailPass son requeridos'
      });
    }

    let config = await MailConfig.findOne();

    if (config) {
      await config.update({ mailUser, mailPass });
    } else {
      config = await MailConfig.create({ mailUser, mailPass });
    }

    console.log('✅ Configuración de correo guardada');
    res.json({
      success: true,
      message: 'Configuración guardada correctamente'
    });
  } catch (error) {
    console.error('❌ saveMailConfig error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.testMailConfig = async (req, res) => {
  try {
    await initializeTable();

    const config = await MailConfig.findOne();

    if (!config || !config.mailUser || !config.mailPass) {
      return res.status(404).json({
        success: false,
        message: 'No hay configuración guardada. Guarda primero las credenciales.'
      });
    }

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

    // Verificar conexión
    await transporter.verify();

    // Enviar correo de prueba
    await transporter.sendMail({
      from: `"Terelion Test" <${config.mailUser}>`,
      to: config.mailUser,
      subject: 'Test de configuración de correo ✅',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #27ae60;">✅ Configuración Correcta</h2>
          <p>Si ves este correo, la configuración de Gmail es correcta.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Enviado automáticamente desde el panel de administración.
          </p>
        </div>
      `
    });

    console.log('✅ Correo de prueba enviado a:', config.mailUser);

    res.json({
      success: true,
      message: 'Correo de prueba enviado correctamente'
    });
  } catch (error) {
    console.error('❌ testMailConfig error:', error.message);

    let userMessage = error.message;
    if (error.message.includes('Invalid login')) {
      userMessage = 'Credenciales incorrectas. Verifica el usuario y contraseña de Gmail.';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      userMessage = 'No se puede conectar a Gmail. Verifica tu conexión a Internet.';
    } else if (error.message.includes('connect ECONNREFUSED')) {
      userMessage = 'Conexión rechazada por el servidor SMTP de Gmail.';
    }

    res.status(500).json({
      success: false,
      message: userMessage
    });
  }
};

exports.sendContactEmail = async (req, res) => {
  const { firstName, lastName, email, phone, company, message, toEmail, region, contactName } = req.body;

  // Validación
  if (!toEmail || !email || !message || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: 'Faltan campos requeridos'
    });
  }

  try {
    await initializeTable();

    const config = await MailConfig.findOne();

    if (!config || !config.mailUser || !config.mailPass) {
      return res.status(500).json({
        success: false,
        error: 'No hay configuración de correo. Configúrala en el panel admin.'
      });
    }

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
  } catch (error) {
    console.error('❌ sendContactEmail error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al enviar el correo: ' + error.message
    });
  }
};