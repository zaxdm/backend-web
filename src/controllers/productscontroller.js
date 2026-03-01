'use strict';

const Products = require('../models/products');
const cloudinary = require('../config/cloudinary');

// Sube base64 a Cloudinary, devuelve URL
const uploadBase64 = (base64, options) => new Promise((resolve, reject) => {
  cloudinary.uploader.upload(base64, options, (err, result) => {
    if (err) reject(err); else resolve(result.secure_url);
  });
});

function parseMaybeJSON(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return fallback ?? value; }
  }
  return value;
}

/**
 * Limpia un nombre de archivo para usarlo como public_id en Cloudinary.
 * Quita la extensión, reemplaza espacios y caracteres especiales por guiones.
 */
function sanitizeFilename(filename) {
  if (!filename) return `doc_${Date.now()}`;
  return filename
    .replace(/\.[^/.]+$/, '')        // quitar extensión (.pdf, .docx, etc.)
    .replace(/[^a-zA-Z0-9_-]/g, '-') // reemplazar caracteres especiales por guión
    .replace(/-+/g, '-')             // colapsar guiones múltiples
    .replace(/^-|-$/g, '')           // quitar guiones al inicio/fin
    .toLowerCase()
    || `doc_${Date.now()}`;
}

/**
 * GET /api/products
 * Lista todos los productos
 */
exports.getProducts = async (req, res) => {
  try {
    const products = await Products.findAll({ order: [['id', 'ASC']] });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/products/by-ruta?ruta=/productos/ridgeback
 * Busca un producto por su ruta (como lo usa el frontend).
 * Si no existe, crea uno vacío con esa ruta (upsert implícito).
 */
exports.getProductByRuta = async (req, res) => {
  try {
    const ruta = req.query.ruta;

    if (!ruta) {
      return res.status(400).json({ message: 'El parámetro "ruta" es requerido' });
    }

    let product = await Products.findOne({ where: { ruta } });

    if (!product) {
      product = await Products.create({
        ruta,
        title: '',
        subtitle: '',
        descriptions: [],
        mainImage: '',
        thumbnails: [],
        contactLink: '',
        breadcrumbs: [],
        features: [],
        downloads: []
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto por ruta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/products/:id
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * POST /api/products
 */
exports.createProduct = async (req, res) => {
  try {
    let {
      ruta,
      title, subtitle, descriptions,
      mainImage, mainImageBase64,
      thumbnails, thumbnailsBase64,
      contactLink, breadcrumbs,
      features, downloads, downloadsBase64,
      downloadsFileNames  // ← nuevo: nombres originales de los PDFs
    } = req.body;

    if (!ruta) return res.status(400).json({ message: 'El campo "ruta" es requerido' });

    const existing = await Products.findOne({ where: { ruta } });
    if (existing) return res.status(400).json({ message: 'Ya existe un producto con esa ruta. Usa PUT para actualizar.' });

    descriptions     = parseMaybeJSON(descriptions, []);
    thumbnails       = parseMaybeJSON(thumbnails, []);
    breadcrumbs      = parseMaybeJSON(breadcrumbs, []);
    features         = parseMaybeJSON(features, []);
    downloads        = parseMaybeJSON(downloads, []);
    thumbnailsBase64 = parseMaybeJSON(thumbnailsBase64, []);
    downloadsBase64  = parseMaybeJSON(downloadsBase64, []);
    downloadsFileNames = parseMaybeJSON(downloadsFileNames, []);

    if (mainImageBase64) {
      mainImage = await uploadBase64(mainImageBase64, {
        folder: 'imagenes/products',
        public_id: `main_${Date.now()}`
      });
    }

    for (let i = 0; i < thumbnailsBase64.length; i++) {
      if (thumbnailsBase64[i]) {
        thumbnails[i] = await uploadBase64(thumbnailsBase64[i], {
          folder: 'imagenes/products',
          public_id: `thumb_${Date.now()}_${i}`
        });
      }
    }

    for (let i = 0; i < downloadsBase64.length; i++) {
      if (downloadsBase64[i]) {
        const originalName = downloadsFileNames[i] || '';
        const publicId = sanitizeFilename(originalName) || `doc_${Date.now()}_${i}`;
        const url = await uploadBase64(downloadsBase64[i], {
          folder: 'pdf',
          resource_type: 'raw',
          public_id: publicId,
          use_filename: true,
          unique_filename: false
        });
        if (!downloads[i]) downloads[i] = { title: '', description: '', link: '' };
        downloads[i].link = url;
      }
    }

    const product = await Products.create({
      ruta, title, subtitle, descriptions,
      mainImage, thumbnails, contactLink,
      breadcrumbs, features, downloads
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

/**
 * PUT /api/products/by-ruta?ruta=/productos/ridgeback
 */
exports.updateProductByRuta = async (req, res) => {
  try {
    const ruta = req.query.ruta;

    if (!ruta) return res.status(400).json({ message: 'El parámetro "ruta" es requerido' });

    let product = await Products.findOne({ where: { ruta } });

    let {
      title, subtitle, descriptions,
      mainImage, mainImageBase64,
      thumbnails, thumbnailsBase64,
      contactLink, breadcrumbs,
      features, downloads, downloadsBase64,
      downloadsFileNames  // ← nuevo
    } = req.body;

    const current = product || {};

    descriptions     = parseMaybeJSON(descriptions,    current.descriptions    || []);
    thumbnails       = parseMaybeJSON(thumbnails,      current.thumbnails      || []);
    breadcrumbs      = parseMaybeJSON(breadcrumbs,     current.breadcrumbs     || []);
    features         = parseMaybeJSON(features,        current.features        || []);
    downloads        = parseMaybeJSON(downloads,       current.downloads       || []);
    thumbnailsBase64 = parseMaybeJSON(thumbnailsBase64, []);
    downloadsBase64  = parseMaybeJSON(downloadsBase64,  []);
    downloadsFileNames = parseMaybeJSON(downloadsFileNames, []);

    if (mainImageBase64) {
      mainImage = await uploadBase64(mainImageBase64, {
        folder: 'imagenes/products',
        public_id: `main_${Date.now()}`
      });
    }

    for (let i = 0; i < thumbnailsBase64.length; i++) {
      if (thumbnailsBase64[i]) {
        thumbnails[i] = await uploadBase64(thumbnailsBase64[i], {
          folder: 'imagenes/products',
          public_id: `thumb_${Date.now()}_${i}`
        });
      }
    }

    for (let i = 0; i < downloadsBase64.length; i++) {
      if (downloadsBase64[i]) {
        const originalName = downloadsFileNames[i] || '';
        const publicId = sanitizeFilename(originalName) || `doc_${Date.now()}_${i}`;
        const url = await uploadBase64(downloadsBase64[i], {
          folder: 'pdf',
          resource_type: 'raw',
          public_id: publicId,
          use_filename: true,
          unique_filename: false
        });
        if (!downloads[i]) downloads[i] = { title: '', description: '', link: '' };
        downloads[i].link = url;
      }
    }

    const data = {
      ruta, title, subtitle, descriptions,
      mainImage, thumbnails, contactLink,
      breadcrumbs, features, downloads
    };

    if (product) {
      await product.update(data);
    } else {
      product = await Products.create(data);
    }

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto por ruta:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

/**
 * PUT /api/products/:id
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    let {
      ruta, title, subtitle, descriptions,
      mainImage, mainImageBase64,
      thumbnails, thumbnailsBase64,
      contactLink, breadcrumbs,
      features, downloads, downloadsBase64,
      downloadsFileNames  // ← nuevo
    } = req.body;

    descriptions     = parseMaybeJSON(descriptions,    product.descriptions    || []);
    thumbnails       = parseMaybeJSON(thumbnails,      product.thumbnails      || []);
    breadcrumbs      = parseMaybeJSON(breadcrumbs,     product.breadcrumbs     || []);
    features         = parseMaybeJSON(features,        product.features        || []);
    downloads        = parseMaybeJSON(downloads,       product.downloads       || []);
    thumbnailsBase64 = parseMaybeJSON(thumbnailsBase64, []);
    downloadsBase64  = parseMaybeJSON(downloadsBase64,  []);
    downloadsFileNames = parseMaybeJSON(downloadsFileNames, []);

    if (mainImageBase64) {
      mainImage = await uploadBase64(mainImageBase64, {
        folder: 'imagenes/products',
        public_id: `main_${Date.now()}`
      });
    }

    for (let i = 0; i < thumbnailsBase64.length; i++) {
      if (thumbnailsBase64[i]) {
        thumbnails[i] = await uploadBase64(thumbnailsBase64[i], {
          folder: 'imagenes/products',
          public_id: `thumb_${Date.now()}_${i}`
        });
      }
    }

    for (let i = 0; i < downloadsBase64.length; i++) {
      if (downloadsBase64[i]) {
        const originalName = downloadsFileNames[i] || '';
        const publicId = sanitizeFilename(originalName) || `doc_${Date.now()}_${i}`;
        const url = await uploadBase64(downloadsBase64[i], {
          folder: 'pdf',
          resource_type: 'raw',
          public_id: publicId,
          use_filename: true,
          unique_filename: false
        });
        if (!downloads[i]) downloads[i] = { title: '', description: '', link: '' };
        downloads[i].link = url;
      }
    }

    await product.update({
      ruta, title, subtitle, descriptions,
      mainImage, thumbnails, contactLink,
      breadcrumbs, features, downloads
    });

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

/**
 * DELETE /api/products/:id  
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    await product.destroy();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};