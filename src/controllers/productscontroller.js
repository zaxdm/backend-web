'use strict';

const Products = require('../models/products');
const cloudinary = require('../config/cloudinary');
const { withDB } = require('../config/database'); // ← ajusta la ruta si es diferente

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

function sanitizeFilename(filename) {
  if (!filename) return `doc_${Date.now()}`;
  return filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    || `doc_${Date.now()}`;
}

exports.getProducts = async (req, res) => {
  try {
    const products = await withDB(() => Products.findAll({ order: [['id', 'ASC']] }));
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getProductByRuta = async (req, res) => {
  try {
    const ruta = req.query.ruta;
    if (!ruta) return res.status(400).json({ message: 'El parámetro "ruta" es requerido' });

    const product = await withDB(() => Products.findOne({ where: { ruta } }));
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto por ruta:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await withDB(() => Products.findByPk(id));
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    console.error('Error al obtener producto:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    let {
      ruta, title, subtitle, descriptions,
      mainImage, mainImageBase64,
      thumbnails, thumbnailsBase64,
      contactLink, breadcrumbs,
      features, downloads, downloadsBase64, downloadsFileNames
    } = req.body;

    if (!ruta) return res.status(400).json({ message: 'El campo "ruta" es requerido' });

    descriptions     = parseMaybeJSON(descriptions, []);
    thumbnails       = parseMaybeJSON(thumbnails, []);
    breadcrumbs      = parseMaybeJSON(breadcrumbs, []);
    features         = parseMaybeJSON(features, []);
    downloads        = parseMaybeJSON(downloads, []);
    thumbnailsBase64 = parseMaybeJSON(thumbnailsBase64, []);
    downloadsBase64  = parseMaybeJSON(downloadsBase64, []);
    downloadsFileNames = parseMaybeJSON(downloadsFileNames, []);

    // Cloudinary (fuera del withDB)
    if (mainImageBase64) {
      mainImage = await uploadBase64(mainImageBase64, { folder: 'imagenes/products', public_id: `main_${Date.now()}` });
    }
    for (let i = 0; i < thumbnailsBase64.length; i++) {
      if (thumbnailsBase64[i]) thumbnails[i] = await uploadBase64(thumbnailsBase64[i], { folder: 'imagenes/products', public_id: `thumb_${Date.now()}_${i}` });
    }
    for (let i = 0; i < downloadsBase64.length; i++) {
      if (downloadsBase64[i]) {
        const url = await uploadBase64(downloadsBase64[i], { folder: 'pdf', resource_type: 'raw', public_id: sanitizeFilename(downloadsFileNames[i]) || `doc_${Date.now()}_${i}`, use_filename: true, unique_filename: false });
        if (!downloads[i]) downloads[i] = { title: '', description: '', link: '' };
        downloads[i].link = url;
      }
    }

    const product = await withDB(async () => {
      const existing = await Products.findOne({ where: { ruta } });
      if (existing) throw Object.assign(new Error('Ya existe un producto con esa ruta.'), { status: 400 });
      return await Products.create({ ruta, title, subtitle, descriptions, mainImage, thumbnails, contactLink, breadcrumbs, features, downloads });
    });

    res.status(201).json(product);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al crear producto:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.updateProductByRuta = async (req, res) => {
  try {
    const ruta = req.query.ruta;
    if (!ruta) return res.status(400).json({ message: 'El parámetro "ruta" es requerido' });

    let {
      title, subtitle, descriptions,
      mainImage, mainImageBase64,
      thumbnails, thumbnailsBase64,
      contactLink, breadcrumbs,
      features, downloads, downloadsBase64, downloadsFileNames
    } = req.body;

    // Valores actuales del producto (para merge)
    const current = await withDB(() => Products.findOne({ where: { ruta } }));

    descriptions     = parseMaybeJSON(descriptions,    current?.descriptions    || []);
    thumbnails       = parseMaybeJSON(thumbnails,      current?.thumbnails      || []);
    breadcrumbs      = parseMaybeJSON(breadcrumbs,     current?.breadcrumbs     || []);
    features         = parseMaybeJSON(features,        current?.features        || []);
    downloads        = parseMaybeJSON(downloads,       current?.downloads       || []);
    thumbnailsBase64 = parseMaybeJSON(thumbnailsBase64, []);
    downloadsBase64  = parseMaybeJSON(downloadsBase64,  []);
    downloadsFileNames = parseMaybeJSON(downloadsFileNames, []);

    // Cloudinary (fuera del withDB)
    if (mainImageBase64) {
      mainImage = await uploadBase64(mainImageBase64, { folder: 'imagenes/products', public_id: `main_${Date.now()}` });
    }
    for (let i = 0; i < thumbnailsBase64.length; i++) {
      if (thumbnailsBase64[i]) thumbnails[i] = await uploadBase64(thumbnailsBase64[i], { folder: 'imagenes/products', public_id: `thumb_${Date.now()}_${i}` });
    }
    for (let i = 0; i < downloadsBase64.length; i++) {
      if (downloadsBase64[i]) {
        const url = await uploadBase64(downloadsBase64[i], { folder: 'pdf', resource_type: 'raw', public_id: sanitizeFilename(downloadsFileNames[i]) || `doc_${Date.now()}_${i}`, use_filename: true, unique_filename: false });
        if (!downloads[i]) downloads[i] = { title: '', description: '', link: '' };
        downloads[i].link = url;
      }
    }

    const data = { ruta, title, subtitle, descriptions, mainImage, thumbnails, contactLink, breadcrumbs, features, downloads };

    const product = await withDB(async () => {
      if (current) { await current.update(data); return current; }
      return await Products.create(data);
    });

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto por ruta:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      ruta, title, subtitle, descriptions,
      mainImage, mainImageBase64,
      thumbnails, thumbnailsBase64,
      contactLink, breadcrumbs,
      features, downloads, downloadsBase64, downloadsFileNames
    } = req.body;

    const product = await withDB(() => Products.findByPk(id));
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    descriptions     = parseMaybeJSON(descriptions,    product.descriptions    || []);
    thumbnails       = parseMaybeJSON(thumbnails,      product.thumbnails      || []);
    breadcrumbs      = parseMaybeJSON(breadcrumbs,     product.breadcrumbs     || []);
    features         = parseMaybeJSON(features,        product.features        || []);
    downloads        = parseMaybeJSON(downloads,       product.downloads       || []);
    thumbnailsBase64 = parseMaybeJSON(thumbnailsBase64, []);
    downloadsBase64  = parseMaybeJSON(downloadsBase64,  []);
    downloadsFileNames = parseMaybeJSON(downloadsFileNames, []);

    if (mainImageBase64) {
      mainImage = await uploadBase64(mainImageBase64, { folder: 'imagenes/products', public_id: `main_${Date.now()}` });
    }
    for (let i = 0; i < thumbnailsBase64.length; i++) {
      if (thumbnailsBase64[i]) thumbnails[i] = await uploadBase64(thumbnailsBase64[i], { folder: 'imagenes/products', public_id: `thumb_${Date.now()}_${i}` });
    }
    for (let i = 0; i < downloadsBase64.length; i++) {
      if (downloadsBase64[i]) {
        const url = await uploadBase64(downloadsBase64[i], { folder: 'pdf', resource_type: 'raw', public_id: sanitizeFilename(downloadsFileNames[i]) || `doc_${Date.now()}_${i}`, use_filename: true, unique_filename: false });
        if (!downloads[i]) downloads[i] = { title: '', description: '', link: '' };
        downloads[i].link = url;
      }
    }

    await withDB(() => product.update({ ruta, title, subtitle, descriptions, mainImage, thumbnails, contactLink, breadcrumbs, features, downloads }));
    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await withDB(async () => {
      const product = await Products.findByPk(id);
      if (!product) throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
      await product.destroy();
    });
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar producto:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.deleteProductByRuta = async (req, res) => {
  try {
    const ruta = req.query.ruta;
    if (!ruta) return res.status(400).json({ message: 'El parámetro "ruta" es requerido' });

    await withDB(async () => {
      const product = await Products.findOne({ where: { ruta } });
      if (!product) throw Object.assign(new Error('Producto no encontrado'), { status: 404 });
      await product.destroy();
    });

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar producto por ruta:', error.message);
    res.status(status).json({ message: error.message });
  }
};