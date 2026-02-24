'use strict';

const { MasInfo } = require('../../models');

/**
 * Obtener MasInfo
 */
exports.getMasInfo = async (req, res) => {
  try {
    let masInfo = await MasInfo.findOne();

    if (!masInfo) {
      const hero = {
        titulo: 'LO QUE SE NECESITA',
        subtitulo: 'Brocas fabricadas especialmente para sus operaciones.',
        imagenFondo: 'https://www.terelion.com/wp-content/uploads/2021/07/home-page-banner.jpg',
        boton: { label: 'Contáctenos', url: '/contacto' }
      };
      const contentSections = [
        {
          titulo: 'Lo que se necesita para realizar el trabajo.',
          parrafos: [
            'Esta línea de trabajo no es para todos. En Terelion, conocemos las condiciones exigentes y los desafíos cotidianos que enfrentan sus operaciones. Y sabemos lo que se necesita para realizar el trabajo.',
            'Trabajamos con todos nuestros clientes para garantizar que las brocas que utilizan sean las más duraderas y resistentes, eficientes y rentables del mercado. Avanzar en las operaciones más difíciles.'
          ]
        }
      ];
      const sections = [
        {
          titulo: 'Confíe en Terelion. Tenemos lo que se necesita.',
          parrafos: [
            'Lograr ese avance al final de un largo día de trabajo.',
            'Confíe en Terelion para operaciones más productivas.'
          ],
          imagen: 'https://www.terelion.com/wp-content/uploads/2021/07/image-1-1024x768.jpg'
        },
        {
          titulo: 'Brocas de calidad para lograr el avance',
          parrafos: [
            'Nuestras brocas están diseñadas para rendimiento y durabilidad.'
          ],
          imagen: 'https://www.terelion.com/wp-content/uploads/2021/07/image-1-1024x768.jpg'
        }
      ];
      const bottomBanner = {
        texto: '¿Listo para llevar su operación al siguiente nivel?',
        boton: { label: 'Contáctanos', url: '/contactos' }
      };
      masInfo = await MasInfo.create({ hero, contentSections, sections, bottomBanner });
    }

    res.json(masInfo);
  } catch (error) {
    console.error('Error al obtener MasInfo:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Crear MasInfo (solo si no existe)
 */
exports.createMasInfo = async (req, res) => {
  try {
    const existing = await MasInfo.findOne();

    if (existing) {
      return res.status(400).json({
        message: 'MasInfo ya existe. Usa update.'
      });
    }

    const { hero, contentSections, sections, bottomBanner } = req.body;

    if (!hero || !contentSections || !sections) {
      return res.status(400).json({
        message: 'hero, contentSections y sections son requeridos'
      });
    }

    const masInfo = await MasInfo.create({
      hero,
      contentSections,
      sections,
      bottomBanner
    });

    res.status(201).json(masInfo);
  } catch (error) {
    console.error('Error al crear MasInfo:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Actualizar MasInfo
 */
exports.updateMasInfo = async (req, res) => {
  try {
    const masInfo = await MasInfo.findOne();

    if (!masInfo) {
      return res.status(404).json({
        message: 'No existe contenido para actualizar'
      });
    }

    const { hero, contentSections, sections, bottomBanner } = req.body;

    await masInfo.update({
      hero,
      contentSections,
      sections,
      bottomBanner
    });

    res.json(masInfo);
  } catch (error) {
    console.error('Error al actualizar MasInfo:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Eliminar MasInfo
 */
exports.deleteMasInfo = async (req, res) => {
  try {
    const masInfo = await MasInfo.findOne();

    if (!masInfo) {
      return res.status(404).json({
        message: 'No existe contenido para eliminar'
      });
    }

    await masInfo.destroy();

    res.json({
      message: 'MasInfo eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar MasInfo:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};
