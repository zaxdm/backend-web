'use strict';
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendContactEmail = async (req, res) => {
  const { firstName, lastName, email, phone, company, message, toEmail, region, contactName } = req.body;

  if (!toEmail || !email || !message || !firstName || !lastName) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    await transporter.sendMail({
      from: `"Web Terelion" <${process.env.MAIL_USER}>`,
      to: toEmail,        // mjahncke@terelion.com o zaitdioses@gmail.com según región
      replyTo: email,     // al responder va directo al usuario
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
            Este correo fue enviado desde el formulario de contacto del sitio web.
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

module.exports = { sendContactEmail };