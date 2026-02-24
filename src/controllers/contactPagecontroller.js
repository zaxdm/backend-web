'use strict';

const ContactPage = require('../models/contact_page');

/**
 * Obtener Contact Page
 */
exports.getContactPage = async (req, res) => {
  try {
    let contactPage = await ContactPage.findOne();

    if (!contactPage) {
      const regions = [
        {
          value: 'south-america',
          label: 'Sudamérica',
          contact: {
            name: 'Miguel Jahncke',
            phones: ['+51 989 164 305 (Perú)', '+1 954 258 0271 (EE.UU.)'],
            email: 'mjahncke@terelion.com',
            office: {
              country: 'Perú',
              address: 'Terelion LLC. Sucursal del Perú, Las Poncianas #105, La Molina Vieja, Lima, Perú',
              phone: '+51-1-365-2529'
            }
          }
        }
      ];
      const content = {
        header: {
          subtitle: 'CONTÁCTANOS',
          title: 'SELECCIONA TU REGIÓN',
          selectHelp: 'Comienza a escribir para buscar tu región',
          regionLabel: 'País o Región',
          regionPlaceholder: 'Escribe para buscar...'
        },
        body: {
          leftTexts: [
            'Dondequiera que esté ubicada tu operación...',
            'Usa el menú desplegable para encontrar la oficina...'
          ],
          boldText: '¡Encuentra a tus contactos en tu región!',
          formFields: [
            { label: 'Nombre', placeholder: 'Ingresa tu nombre', required: true },
            { label: 'Apellido', placeholder: 'Ingresa tu apellido', required: true },
            { label: 'Correo', placeholder: 'correo@ejemplo.com', type: 'email', required: true },
            { label: 'Teléfono', placeholder: '+51...' },
            { label: 'Empresa', placeholder: 'Empresa' },
            { label: 'Mensaje', placeholder: 'Escribe...', rows: 6 }
          ],
          legalText: 'Texto legal...',
          sendButtonLabel: 'ENVIAR'
        }
      };
      contactPage = await ContactPage.create({ regions, content });
    }

    res.json(contactPage);
  } catch (error) {
    console.error('Error al obtener Contact Page:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Crear Contact Page (solo si no existe)
 */
exports.createContactPage = async (req, res) => {
  try {
    const existing = await ContactPage.findOne();

    if (existing) {
      return res.status(400).json({
        message: 'Contact Page ya existe. Usa update.'
      });
    }

    const { regions, content } = req.body;

    if (!regions || !content) {
      return res.status(400).json({
        message: 'regions y content son requeridos'
      });
    }

    const contactPage = await ContactPage.create({
      regions,
      content
    });

    res.status(201).json(contactPage);
  } catch (error) {
    console.error('Error al crear Contact Page:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Actualizar Contact Page
 */
exports.updateContactPage = async (req, res) => {
  try {
    const contactPage = await ContactPage.findOne();

    if (!contactPage) {
      return res.status(404).json({
        message: 'No existe contenido para actualizar'
      });
    }

    const { regions, content } = req.body;

    await contactPage.update({
      regions,
      content
    });

    res.json(contactPage);
  } catch (error) {
    console.error('Error al actualizar Contact Page:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Eliminar Contact Page
 */
exports.deleteContactPage = async (req, res) => {
  try {
    const contactPage = await ContactPage.findOne();

    if (!contactPage) {
      return res.status(404).json({
        message: 'No existe contenido para eliminar'
      });
    }

    await contactPage.destroy();

    res.json({
      message: 'Contact Page eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar Contact Page:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};
