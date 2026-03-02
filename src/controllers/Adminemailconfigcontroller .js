'use strict';

const AdminEmailConfig = require('../models/admin_email_config');
const { withDB } = require('../config/sequelize');

const DEFAULT_CONFIG = {
  fromEmail: 'contacto@tudominio.com',
  subject: 'Nuevo contacto: {firstName} {lastName}',
  htmlTemplate: `
    <h2>Nuevo Mensaje de Contacto</h2>
    <p><strong>Región:</strong> {region}</p>
    <p><strong>De:</strong> {firstName} {lastName}</p>
    <p><strong>Email:</strong> <a href="mailto:{email}">{email}</a></p>
    <p><strong>Empresa:</strong> {company}</p>
    <hr />
    <p><strong>Mensaje:</strong></p>
    <p>{message}</p>
  `
};

// ============================================
// GET: Obtener configuración actual
// ============================================
exports.getEmailConfig = async (req, res) => {
  try {
    const config = await withDB(async () => {
      let found = await AdminEmailConfig.findOne();
      if (!found) {
        found = await AdminEmailConfig.create(DEFAULT_CONFIG);
      }
      return found;
    });
    res.json(config);
  } catch (error) {
    console.error('Error al obtener Email Config:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ============================================
// PUT: Actualizar configuración
// ============================================
exports.updateEmailConfig = async (req, res) => {
  try {
    const config = await withDB(async () => {
      let found = await AdminEmailConfig.findOne();
      
      if (!found) {
        found = await AdminEmailConfig.create(DEFAULT_CONFIG);
      }

      const { fromEmail, subject, htmlTemplate } = req.body;

      // Validar que los campos no estén vacíos
      if (!fromEmail || !subject || !htmlTemplate) {
        throw Object.assign(
          new Error('fromEmail, subject y htmlTemplate son requeridos'),
          { status: 400 }
        );
      }

      await found.update({
        fromEmail,
        subject,
        htmlTemplate
      });

      return found;
    });

    res.json({
      success: true,
      message: 'Configuración de email actualizada',
      config
    });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar Email Config:', error.message);
    res.status(status).json({ message: error.message });
  }
};

// ============================================
// Función auxiliar: Reemplazar variables en template
// ============================================
exports.replaceTemplateVariables = (template, data) => {
  let result = template;
  
  for (const [key, value] of Object.entries(data)) {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value || '');
  }
  
  return result;
};