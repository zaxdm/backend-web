'use strict';

const ContactPage = require('../models/contact_page');
const { withDB } = require('../config/sequelize');

const DEFAULT_REGIONS = [
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

const DEFAULT_CONTENT = {
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

exports.getContactPage = async (req, res) => {
  try {
    const contactPage = await withDB(async () => {
      let found = await ContactPage.findOne();
      if (!found) found = await ContactPage.create({ regions: DEFAULT_REGIONS, content: DEFAULT_CONTENT });
      return found;
    });
    res.json(contactPage);
  } catch (error) {
    console.error('Error al obtener Contact Page:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createContactPage = async (req, res) => {
  try {
    const contactPage = await withDB(async () => {
      const existing = await ContactPage.findOne();
      if (existing) throw Object.assign(new Error('Contact Page ya existe. Usa update.'), { status: 400 });
      const { regions, content } = req.body;
      if (!regions || !content) throw Object.assign(new Error('regions y content son requeridos'), { status: 400 });
      return await ContactPage.create({ regions, content });
    });
    res.status(201).json(contactPage);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al crear Contact Page:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.updateContactPage = async (req, res) => {
  try {
    const contactPage = await withDB(async () => {
      const found = await ContactPage.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para actualizar'), { status: 404 });
      await found.update({ regions: req.body.regions, content: req.body.content });
      return found;
    });
    res.json(contactPage);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar Contact Page:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.deleteContactPage = async (req, res) => {
  try {
    await withDB(async () => {
      const found = await ContactPage.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para eliminar'), { status: 404 });
      await found.destroy();
    });
    res.json({ message: 'Contact Page eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar Contact Page:', error.message);
    res.status(status).json({ message: error.message });
  }
};