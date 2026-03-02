'use strict';

const { Resend } = require('resend');
const AdminEmailConfig = require('../models/admin_email_config');
const { withDB } = require('../config/sequelize');
const adminEmailConfigController = require('./adminEmailConfigController');

const resend = new Resend(process.env.RESEND_API_KEY);

// ============================================
// POST: Enviar contacto con Resend
// ============================================
exports.sendContactMail = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      toEmail,      // Email del contacto de la región
      message,
      region,
      contactName,
      company,
      phone
    } = req.body;

    // Validación básica
    if (!firstName || !lastName || !email || !message || !toEmail) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos: firstName, lastName, email, message, toEmail'
      });
    }

    // Validar formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !emailRegex.test(toEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      });
    }

    // 1. OBTENER configuración GLOBAL del admin
    const emailConfig = await withDB(async () => {
      let found = await AdminEmailConfig.findOne();
      if (!found) {
        // Crear con defaults si no existe
        found = await AdminEmailConfig.create({
          fromEmail: 'contacto@tudominio.com',
          subject: 'Nuevo contacto: {firstName} {lastName}',
          htmlTemplate: '<h2>Nuevo Mensaje</h2><p>{message}</p>'
        });
      }
      return found;
    });

    if (!emailConfig) {
      return res.status(500).json({
        success: false,
        error: 'No se pudo obtener la configuración de email'
      });
    }

    // 2. PREPARAR datos para reemplazar en template
    const templateData = {
      firstName,
      lastName,
      email,
      message,
      region,
      contactName,
      company: company || 'N/A',
      phone: phone || 'N/A'
    };

    // 3. REEMPLAZAR variables en subject
    const subject = adminEmailConfigController.replaceTemplateVariables(
      emailConfig.subject,
      templateData
    );

    // 4. REEMPLAZAR variables en HTML
    const html = adminEmailConfigController.replaceTemplateVariables(
      emailConfig.htmlTemplate,
      templateData
    );

    // 5. VALIDAR que Resend API key existe
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY no está configurado');
      return res.status(500).json({
        success: false,
        error: 'Servicio de email no configurado'
      });
    }

    // 6. ENVIAR con Resend
    const emailResponse = await resend.emails.send({
      from: emailConfig.fromEmail,  // FROM GLOBAL del admin
      to: toEmail,                   // TO de la REGIÓN seleccionada
      cc: email,                     // Copia al cliente que escribió
      replyTo: email,
      subject,
      html
    });

    // 7. VALIDAR respuesta de Resend
    if (emailResponse.error) {
      console.error('Error Resend:', emailResponse.error);
      return res.status(500).json({
        success: false,
        error: 'Error al enviar email: ' + emailResponse.error.message
      });
    }

    // 8. RESPONDER al cliente
    res.json({
      success: true,
      message: 'Email enviado correctamente',
      emailId: emailResponse.data?.id
    });

  } catch (error) {
    console.error('Error en sendContactMail:', error.message);
    res.status(500).json({
      success: false,
      error: 'Error al enviar email: ' + error.message
    });
  }
};