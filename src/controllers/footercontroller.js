'use strict';

const Footer = require('../models/footer');
const cloudinary = require('../config/cloudinary');
const { withDB } = require('../config/sequelize');

exports.getFooter = async (req, res) => {
  try {
    const footer = await withDB(async () => {
      let found = await Footer.findOne();
      if (!found) {
        found = await Footer.create({
          content: {
            menuIzquierda: [
              { label: 'Acerca de este sitio web', ruta: '/about-this-website/' },
              { label: 'Cookies', ruta: '/cookies/' },
              { label: 'Aviso legal', ruta: '/legal-notice/' },
              { label: 'Privacidad de datos', ruta: '/data-privacy/' }
            ],
            noticias: [
              { fecha: '2022-02-25', titulo: 'Terelion es expositor en Minexchange 2022 SME Annual Conference & Expo', url: '#' },
              { fecha: '2020-10-19', titulo: 'Terelion estará en MINExpo 2021', url: '#' },
              { fecha: '2020-10-19', titulo: 'Síguenos en nuestras redes sociales', url: '#' }
            ],
            logoCentro: '/logo-blanco.png',
            contacto: { telefono: '+14692944196', email: 'frank.rupay@jftriconperu.com' },
            redes: [
              { icon: 'bi bi-facebook', url: 'https://www.facebook.com/share/1BzmQ64ZW3/', nombre: 'Facebook' },
              { icon: 'bi bi-linkedin', url: 'https://www.linkedin.com/company/jf-tricon-perú', nombre: 'LinkedIn' },
              { icon: 'bi bi-instagram', url: 'https://www.instagram.com/terelion.mining/', nombre: 'Instagram' }
            ],
            followText: 'SÍGUENOS EN —',
            copyright: `© ${new Date().getFullYear()} - JF Tricon Perú, LLC`
          }
        });
      }
      return found;
    });
    res.json(footer);
  } catch (error) {
    console.error('Error al obtener Footer:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.createFooter = async (req, res) => {
  try {
    const footer = await withDB(async () => {
      const existing = await Footer.findOne();
      if (existing) throw Object.assign(new Error('El Footer ya existe. Usa update.'), { status: 400 });
      const { content } = req.body;
      if (!content) throw Object.assign(new Error('content es requerido'), { status: 400 });
      return await Footer.create({ content });
    });
    res.status(201).json(footer);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al crear Footer:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.updateFooter = async (req, res) => {
  try {
    const content = typeof req.body.content === 'string' ? JSON.parse(req.body.content) : req.body.content;

    // Cloudinary fuera del withDB
    if (content.logoCentro && content.logoCentro.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(content.logoCentro, { folder: 'imagenes/footer', public_id: `logo_${Date.now()}` });
      content.logoCentro = result.secure_url;
    }

    const footer = await withDB(async () => {
      const found = await Footer.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para actualizar'), { status: 404 });
      await found.update({ content });
      return found;
    });
    res.json(footer);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar Footer:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.deleteFooter = async (req, res) => {
  try {
    await withDB(async () => {
      const found = await Footer.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para eliminar'), { status: 404 });
      await found.destroy();
    });
    res.json({ message: 'Footer eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar Footer:', error.message);
    res.status(status).json({ message: error.message });
  }
};