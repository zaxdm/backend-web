'use strict';

const Noticias = require('../models/noticias');
const { withDB } = require('../config/sequelize');

// Migra parrafos de string[] a ParrafoItem[] si vienen en formato antiguo
function migrateParrafos(parrafos) {
  if (!Array.isArray(parrafos)) return [];
  if (parrafos.length === 0) return [];
  if (typeof parrafos[0] === 'string') {
    return parrafos.map(p => ({ tipo: 'texto', contenido: p }));
  }
  return parrafos;
}

function serializeNoticia(noticia) {
  const raw = noticia.toJSON();
  return {
    ...raw,
    parrafos: migrateParrafos(
      typeof raw.parrafos === 'string' ? JSON.parse(raw.parrafos) : raw.parrafos
    )
  };
}

exports.getNoticias = async (req, res) => {
  try {
    const noticias = await withDB(() => Noticias.findAll({ order: [['fechaPublicacion', 'DESC']] }));
    res.json(noticias.map(serializeNoticia));
  } catch (error) {
    console.error('Error al obtener noticias:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getNoticiaById = async (req, res) => {
  try {
    const noticia = await withDB(() => Noticias.findByPk(req.params.id));
    if (!noticia) return res.status(404).json({ message: 'Noticia no encontrada' });
    res.json(serializeNoticia(noticia));
  } catch (error) {
    console.error('Error al obtener noticia:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createNoticia = async (req, res) => {
  try {
    let { categoria, titulo, fechaPublicacion, parrafos, contactoNombre, contactoEmail, firmaNombre, firmaCargo } = req.body;

    if (!categoria || !titulo || !fechaPublicacion || !parrafos || !contactoNombre || !contactoEmail || !firmaNombre || !firmaCargo) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    parrafos = migrateParrafos(typeof parrafos === 'string' ? JSON.parse(parrafos) : parrafos);

    const noticia = await withDB(() =>
      Noticias.create({ categoria, titulo, fechaPublicacion, parrafos, contactoNombre, contactoEmail, firmaNombre, firmaCargo })
    );
    res.status(201).json(serializeNoticia(noticia));
  } catch (error) {
    console.error('Error al crear noticia:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateNoticia = async (req, res) => {
  try {
    let { categoria, titulo, fechaPublicacion, parrafos, contactoNombre, contactoEmail, firmaNombre, firmaCargo } = req.body;

    parrafos = migrateParrafos(typeof parrafos === 'string' ? JSON.parse(parrafos) : parrafos);

    const noticia = await withDB(async () => {
      const found = await Noticias.findByPk(req.params.id);
      if (!found) throw Object.assign(new Error('Noticia no encontrada'), { status: 404 });
      await found.update({ categoria, titulo, fechaPublicacion, parrafos, contactoNombre, contactoEmail, firmaNombre, firmaCargo });
      return found;
    });
    res.json(serializeNoticia(noticia));
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar noticia:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.deleteNoticia = async (req, res) => {
  try {
    await withDB(async () => {
      const found = await Noticias.findByPk(req.params.id);
      if (!found) throw Object.assign(new Error('Noticia no encontrada'), { status: 404 });
      await found.destroy();
    });
    res.json({ message: 'Noticia eliminada correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar noticia:', error.message);
    res.status(status).json({ message: error.message });
  }
};