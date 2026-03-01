// ─── aboutcontroller.js ──────────────────────────────────────────────────────
'use strict';

const About = require('../models/about');
const { withDB } = require('../config/sequelize');

exports.getAbout = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    const about = await withDB(async () => {
      let found = await About.findOne();
      if (!found) {
        found = await About.create({
          aboutData: {
            heroTitle: 'SOBRE NOSOTROS',
            subtitle: 'Nuestra misión, valores y equipo',
            paragraphs: [
              'Somos orgullosos especialistas en el desarrollo y fabricación de brocas de cono de rodillos para las industrias de minería y construcción.',
              'En Terelion siempre nos hemos dedicado a ser los mejores en nuestro negocio.'
            ],
            paragraphs2: [
              'Dondequiera que mires, el mundo está lleno de tareas desafiantes que la humanidad debe resolver.',
              'Siempre nos hemos dedicado a ser los mejores en nuestro negocio.',
              'Algunas de nuestras innovaciones son menores. Otros conducen a avances que afectan a toda la industria.'
            ]
          }
        });
      }
      return found;
    });
    res.json(about);
  } catch (error) {
    console.error('Error al obtener About:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createAbout = async (req, res) => {
  try {
    const about = await withDB(async () => {
      const existing = await About.findOne();
      if (existing) throw Object.assign(new Error('El About ya existe. Usa update.'), { status: 400 });
      const { aboutData } = req.body;
      if (!aboutData) throw Object.assign(new Error('aboutData es requerido'), { status: 400 });
      return await About.create({ aboutData });
    });
    res.status(201).json(about);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al crear About:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    const about = await withDB(async () => {
      const found = await About.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para actualizar'), { status: 404 });
      await found.update({ aboutData: req.body.aboutData });
      return found;
    });
    res.json(about);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar About:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.deleteAbout = async (req, res) => {
  try {
    await withDB(async () => {
      const found = await About.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para eliminar'), { status: 404 });
      await found.destroy();
    });
    res.json({ message: 'About eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar About:', error.message);
    res.status(status).json({ message: error.message });
  }
};