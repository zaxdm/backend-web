'use strict';

const { Products } = require('../../models');

function parseMaybeJSON(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback ?? value;
    }
  }
  return value;
}

/**
 * Obtener todos los productos
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      order: [['id', 'ASC']]
    });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Obtener producto por ID
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Crear producto
 */
exports.createProduct = async (req, res) => {
  try {
    let {
      title,
      subtitle,
      descriptions,
      mainImage,
      thumbnails,
      contactLink,
      breadcrumbs,
      features,
      downloads
    } = req.body;

    // Normalizar campos que pueden venir como JSON string
    descriptions = parseMaybeJSON(descriptions, []);
    thumbnails = parseMaybeJSON(thumbnails, []);
    breadcrumbs = parseMaybeJSON(breadcrumbs, []);
    features = parseMaybeJSON(features, []);
    downloads = parseMaybeJSON(downloads, []);

    // 📂 Archivos subidos (multer any()) con fieldname tipo "download_0"
    const files = Array.isArray(req.files) ? req.files : [];
    for (const file of files) {
      const m = /^download_(\d+)$/.exec(file.fieldname || '');
      if (!m) continue;
      const idx = parseInt(m[1], 10);
      if (!downloads[idx]) downloads[idx] = { title: file.originalname, description: '', link: '' };
      downloads[idx].link = file.path;
    }

    const product = await Products.create({
      title,
      subtitle,
      descriptions,
      mainImage,
      thumbnails,
      contactLink,
      breadcrumbs,
      features,
      downloads
    });

    res.status(201).json(product);

  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Actualizar producto
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    let {
      title,
      subtitle,
      descriptions,
      mainImage,
      thumbnails,
      contactLink,
      breadcrumbs,
      features,
      downloads
    } = req.body;

    // Normalizar campos (multipart llegan como string)
    descriptions = parseMaybeJSON(descriptions, product.descriptions || []);
    thumbnails = parseMaybeJSON(thumbnails, product.thumbnails || []);
    breadcrumbs = parseMaybeJSON(breadcrumbs, product.breadcrumbs || []);
    features = parseMaybeJSON(features, product.features || []);
    downloads = parseMaybeJSON(downloads, product.downloads || []);

    // Aplicar archivos subidos a los índices correspondientes
    const files = Array.isArray(req.files) ? req.files : [];
    for (const file of files) {
      const m = /^download_(\d+)$/.exec(file.fieldname || '');
      if (!m) continue;
      const idx = parseInt(m[1], 10);
      if (!downloads[idx]) downloads[idx] = { title: file.originalname, description: '', link: '' };
      downloads[idx].link = file.path;
    }

    await product.update({
      title,
      subtitle,
      descriptions,
      mainImage,
      thumbnails,
      contactLink,
      breadcrumbs,
      features,
      downloads
    });

    res.json(product);

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * Eliminar producto
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await product.destroy();

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
