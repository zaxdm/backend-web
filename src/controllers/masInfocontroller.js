// masInfocontroller.js
'use strict';

const MasInfo = require('../models/mas_info');
const cloudinary = require('../config/cloudinary');
const { withDB } = require('../config/sequelize');

exports.getMasInfo = async (req, res) => {
  try {
    const masInfo = await withDB(async () => {
      let found = await MasInfo.findOne();
      if (!found) {
        found = await MasInfo.create({
          hero: {
            titulo: 'LO QUE SE NECESITA',
            subtitulo: 'Brocas fabricadas especialmente para sus operaciones.',
            imagenFondo: 'https://www.terelion.com/wp-content/uploads/2021/07/home-page-banner.jpg',
            boton: { label: 'Contáctenos', url: '/contacto' }
          },
          contentSections: [
            {
              titulo: 'Lo que se necesita para realizar el trabajo.',
              parrafos: [
                'Esta línea de trabajo no es para todos. En Terelion, conocemos las condiciones exigentes y los desafíos cotidianos que enfrentan sus operaciones.',
                'Trabajamos con todos nuestros clientes para garantizar que las brocas que utilizan sean las más duraderas y resistentes, eficientes y rentables del mercado.'
              ],
              imagen: '',
              reverse: false
            }
          ],
          sections: [
            {
              titulo: 'Confíe en Terelion. Tenemos lo que se necesita.',
              parrafos: ['Lograr ese avance al final de un largo día de trabajo.', 'Confíe en Terelion para operaciones más productivas.'],
              imagen: 'https://www.terelion.com/wp-content/uploads/2021/07/image-1-1024x768.jpg',
              reverse: false
            }
          ],
          bottomBanner: {
            titulo: 'Bajo el mismo cielo, hacia la misma meta',
            texto: '¿Listo para llevar su operación al siguiente nivel?',
            imagen: '',
            boton: { label: 'Contáctanos', url: '/contactos' }
          }
        });
      }
      return found;
    });
    res.json(masInfo);
  } catch (error) {
    console.error('Error al obtener MasInfo:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createMasInfo = async (req, res) => {
  try {
    const masInfo = await withDB(async () => {
      const existing = await MasInfo.findOne();
      if (existing) throw Object.assign(new Error('MasInfo ya existe. Usa update.'), { status: 400 });
      const { hero, contentSections, sections, bottomBanner } = req.body;
      if (!hero || !contentSections || !sections) throw Object.assign(new Error('hero, contentSections y sections son requeridos'), { status: 400 });
      return await MasInfo.create({ hero, contentSections, sections, bottomBanner });
    });
    res.status(201).json(masInfo);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al crear MasInfo:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.updateMasInfo = async (req, res) => {
  try {
    const masInfo = await withDB(async () => {
      const found = await MasInfo.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para actualizar'), { status: 404 });
      await found.update({ 
        hero: req.body.hero, 
        contentSections: req.body.contentSections, 
        sections: req.body.sections, 
        bottomBanner: req.body.bottomBanner 
      });
      return found;
    });
    res.json(masInfo);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar MasInfo:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.deleteMasInfo = async (req, res) => {
  try {
    await withDB(async () => {
      const found = await MasInfo.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para eliminar'), { status: 404 });
      await found.destroy();
    });
    res.json({ message: 'MasInfo eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar MasInfo:', error.message);
    res.status(status).json({ message: error.message });
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SUBIR IMAGEN A CLOUDINARY
// ═══════════════════════════════════════════════════════════════════════════

exports.uploadImage = async (req, res) => {
  try {
    const { imageData, publicId, folder } = req.body;

    if (!imageData) {
      return res.status(400).json({ message: 'imageData es requerido' });
    }

    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(imageData, {
      folder: folder || 'imagenes/mas-info',
      public_id: publicId || `mas-info-${Date.now()}`,
      overwrite: true,
      resource_type: 'auto'
    });

    res.json({
      secure_url: result.secure_url,
      public_id: result.public_id,
      format: result.format
    });
  } catch (error) {
    console.error('Error al subir imagen:', error.message);
    res.status(500).json({ message: `Error al subir imagen: ${error.message}` });
  }
};