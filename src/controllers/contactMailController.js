'use strict';

const nodemailer = require('nodemailer');
const ContactSubmission = require('../models/contact_submission');
const SmtpConfig = require('../models/smtp_config');
const { withDB } = require('../config/sequelize');

function detectSmtpProvider(email) {
  const domain = email.split('@')[1].toLowerCase();

  const providers = {
    'gmail.com':     { host: 'smtp.gmail.com',     port: 587, secure: false },
    'outlook.com':   { host: 'smtp.office365.com',  port: 587, secure: false },
    'hotmail.com':   { host: 'smtp.office365.com',  port: 587, secure: false },
    'live.com':      { host: 'smtp.office365.com',  port: 587, secure: false },
    'yahoo.com':     { host: 'smtp.mail.yahoo.com', port: 587, secure: false },
    'icloud.com':    { host: 'smtp.mail.me.com',    port: 587, secure: false },
  };

  return providers[domain] ?? { host: `smtp.${domain}`, port: 587, secure: false };
}

exports.sendContactMail = async (req, res) => {
  const { firstName, lastName, email, phone, company, message, toEmail, region, contactName } = req.body;

  if (!firstName || !lastName || !email || !message || !toEmail || !region) {
    return res.status(400).json({ message: 'Faltan campos obligatorios.' });
  }

  try {
    // 1. Guardar en BD
    await withDB(async () => {
      await ContactSubmission.create({
        firstName, lastName, email,
        phone:   phone   || null,
        company: company || null,
        message, region, toEmail
      });
    });

    // 2. Leer SMTP desde BD
    const smtpConfig = await SmtpConfig.findOne();
    if (!smtpConfig || !smtpConfig.user || !smtpConfig.pass) {
      return res.status(500).json({ message: 'El correo no está configurado. Contacta al administrador.' });
    }

    // 3. Detectar proveedor automáticamente
    const { host, port, secure } = detectSmtpProvider(smtpConfig.user);

    const transporter = nodemailer.createTransport({
      host, port, secure,
      auth: { user: smtpConfig.user, pass: smtpConfig.pass }
    });

    // 4. Enviar correo al contacto regional
    await transporter.sendMail({
      from:    `"Formulario Web Terelion" <${smtpConfig.user}>`,
      to:      toEmail,
      replyTo: email,
      subject: `[Contacto ${region}] ${firstName} ${lastName}`,
      text: `
Hola ${contactName || 'Equipo'},

Nuevo mensaje desde el formulario web.

Nombre:   ${firstName} ${lastName}
Correo:   ${email}
Teléfono: ${phone   || 'No proporcionado'}
Empresa:  ${company || 'No proporcionada'}
Región:   ${region}

Mensaje:
${message}
      `.trim(),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
          <div style="background:#1a1a2e;padding:24px 32px;">
            <h2 style="color:#fff;margin:0;">Nuevo mensaje de contacto</h2>
            <p style="color:#aaa;margin:6px 0 0;">Región: <strong style="color:#fff;">${region}</strong></p>
          </div>
          <div style="padding:32px;background:#fafafa;border:1px solid #e0e0e0;">
            <p>Hola <strong>${contactName || 'Equipo'}</strong>,</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
              <tr style="background:#f0f0f0;">
                <td style="padding:10px 14px;font-weight:bold;width:30%;">Nombre</td>
                <td style="padding:10px 14px;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;font-weight:bold;">Correo</td>
                <td style="padding:10px 14px;"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr style="background:#f0f0f0;">
                <td style="padding:10px 14px;font-weight:bold;">Teléfono</td>
                <td style="padding:10px 14px;">${phone || 'No proporcionado'}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;font-weight:bold;">Empresa</td>
                <td style="padding:10px 14px;">${company || 'No proporcionada'}</td>
              </tr>
            </table>
            <div style="background:#fff;border-left:4px solid #1a1a2e;padding:16px 20px;">
              <p style="margin:0 0 8px;font-weight:bold;">Mensaje:</p>
              <p style="margin:0;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="margin-top:24px;">
              <a href="mailto:${email}"
                 style="background:#1a1a2e;color:#fff;padding:12px 24px;
                        text-decoration:none;border-radius:4px;display:inline-block;">
                Responder a ${firstName}
              </a>
            </p>
          </div>
          <div style="padding:16px;background:#eee;font-size:12px;color:#888;text-align:center;">
            Generado automáticamente desde el sitio web de Terelion.
          </div>
        </div>
      `
    });

    return res.status(200).json({ message: 'Mensaje enviado correctamente.' });

  } catch (error) {
    console.error('Error al enviar contacto:', error.message);
    return res.status(500).json({ message: error.message || 'Error interno del servidor' });
  }
};