'use strict';

const { History } = require('../../models');

/**
 * Obtener History
 */
exports.getHistory = async (req, res) => {
  try {
    let history = await History.findOne();

    if (!history) {
      const heroTitle = 'NUESTRA HISTORIA';
      const timeline = [
        {
          image: 'prueba.jpg',
          alt: 'Varel logo',
          stories: [
            { year: '1947', text: 'Fundación en Delaware' },
            { year: '1950', text: 'Producción inicial' }
          ]
        }
      ];
      history = await History.create({ heroTitle, timeline });
    }

    res.json(history);
  } catch (error) {
    console.error('Error al obtener History:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Crear History (solo si no existe)
 */
exports.createHistory = async (req, res) => {
  try {
    const existing = await History.findOne();

    if (existing) {
      return res.status(400).json({
        message: 'El History ya existe. Usa update.'
      });
    }

    const { heroTitle, timeline } = req.body;

    if (!heroTitle || !timeline) {
      return res.status(400).json({
        message: 'heroTitle y timeline son requeridos'
      });
    }

    const history = await History.create({
      heroTitle,
      timeline
    });

    res.status(201).json(history);
  } catch (error) {
    console.error('Error al crear History:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Actualizar History
 */
exports.updateHistory = async (req, res) => {
  try {
    const history = await History.findOne();

    if (!history) {
      return res.status(404).json({
        message: 'No existe contenido para actualizar'
      });
    }

    const { heroTitle, timeline } = req.body;

    await history.update({
      heroTitle,
      timeline
    });

    res.json(history);
  } catch (error) {
    console.error('Error al actualizar History:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Eliminar History
 */
exports.deleteHistory = async (req, res) => {
  try {
    const history = await History.findOne();

    if (!history) {
      return res.status(404).json({
        message: 'No existe contenido para eliminar'
      });
    }

    await history.destroy();

    res.json({
      message: 'History eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar History:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};
