// controllers/historycontroller.js
'use strict';

const History = require('../models/history');
const cloudinary = require('../config/cloudinary');
const { withDB } = require('../config/sequelize');

exports.getHistory = async (req, res) => {
  try {
    const history = await withDB(async () => {
      let found = await History.findOne();
      if (!found) {
        found = await History.create({
          heroTitle: 'NUESTRA HISTORIA',
          timeline: [
            {
              image: 'prueba.jpg',
              alt: 'Varel logo',
              stories: [
                { year: '1947', text: 'Fundación en Delaware' },
                { year: '1950', text: 'Producción inicial' }
              ]
            }
          ]
        });
      }
      return found;
    });
    res.json(history);
  } catch (error) {
    console.error('Error al obtener History:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createHistory = async (req, res) => {
  try {
    const history = await withDB(async () => {
      const existing = await History.findOne();
      if (existing) throw Object.assign(new Error('El History ya existe. Usa update.'), { status: 400 });
      const { heroTitle, timeline } = req.body;
      if (!heroTitle || !timeline) throw Object.assign(new Error('heroTitle y timeline son requeridos'), { status: 400 });
      return await History.create({ heroTitle, timeline });
    });
    res.status(201).json(history);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al crear History:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.updateHistory = async (req, res) => {
  try {
    const history = await withDB(async () => {
      const found = await History.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para actualizar'), { status: 404 });
      await found.update({ heroTitle: req.body.heroTitle, timeline: req.body.timeline });
      return found;
    });
    res.json(history);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar History:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.deleteHistory = async (req, res) => {
  try {
    await withDB(async () => {
      const found = await History.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para eliminar'), { status: 404 });
      await found.destroy();
    });
    res.json({ message: 'History eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar History:', error.message);
    res.status(status).json({ message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SUBIR IMAGEN BASE64 A CLOUDINARY
// ═══════════════════════════════════════════════════════════════════════════

exports.uploadImage = async (req, res) => {
  try {
    const { imageData, publicId, folder } = req.body;

    if (!imageData) {
      return res.status(400).json({ message: 'imageData es requerido' });
    }

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder || 'imagenes/history',
      public_id: publicId || `history_${Date.now()}`,
      overwrite: true,
      resource_type: 'auto'
    });

    res.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format
    });
  } catch (error) {
    console.error('Error al subir imagen a Cloudinary:', error.message);
    res.status(500).json({ message: `Error al subir imagen: ${error.message}` });
  }
};