'use strict';

const { Noticias } = require('../../models');

/**
 * Obtener todas las noticias
 */
exports.getNoticias = async (req, res) => {
  try {
    const noticias = await Noticias.findAll({
      order: [['fechaPublicacion', 'DESC']]
    });
    res.json(noticias);
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

/**
 * Obtener una noticia por ID
 */
exports.getNoticiaById = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticias.findByPk(id);

    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    res.json(noticia);
  } catch (error) {
    console.error('Error al obtener noticia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Crear noticia
 */
exports.createNoticia = async (req, res) => {
  try {
    const {
      categoria,
      titulo,
      fechaPublicacion,
      parrafos,
      contactoNombre,
      contactoEmail,
      firmaNombre,
      firmaCargo
    } = req.body;

    if (
      !categoria ||
      !titulo ||
      !fechaPublicacion ||
      !parrafos ||
      !contactoNombre ||
      !contactoEmail ||
      !firmaNombre ||
      !firmaCargo
    ) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const noticia = await Noticias.create({
      categoria,
      titulo,
      fechaPublicacion,
      parrafos,
      contactoNombre,
      contactoEmail,
      firmaNombre,
      firmaCargo
    });

    res.status(201).json(noticia);
  } catch (error) {
    console.error('Error al crear noticia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Actualizar noticia
 */
exports.updateNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticias.findByPk(id);

    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    const {
      categoria,
      titulo,
      fechaPublicacion,
      parrafos,
      contactoNombre,
      contactoEmail,
      firmaNombre,
      firmaCargo
    } = req.body;

    await noticia.update({
      categoria,
      titulo,
      fechaPublicacion,
      parrafos,
      contactoNombre,
      contactoEmail,
      firmaNombre,
      firmaCargo
    });

    res.json(noticia);
  } catch (error) {
    console.error('Error al actualizar noticia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Eliminar noticia
 */
exports.deleteNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticias.findByPk(id);

    if (!noticia) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    await noticia.destroy();

    res.json({ message: 'Noticia eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar noticia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};