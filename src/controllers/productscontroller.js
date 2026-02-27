'use strict';

const Products = require('../models/products');
const cloudinary = require('../config/cloudinary');

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

exports.getProducts = async (req, res) => {
  try {
    const products = await Products.findAll({ order: [['id', 'ASC']] });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

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

exports.createProduct = async (req, res) => {
  try {
    let { title, subtitle, descriptions, mainImage, thumbnails, contactLink, breadcrumbs, features, downloads } = req.body;

    descriptions = parseMaybeJSON(descriptions, []);
    thumbnails   = parseMaybeJSON(thumbnails, []);
    breadcrumbs  = parseMaybeJSON(breadcrumbs, []);
    features     = parseMaybeJSON(features, []);
    downloads    = parseMaybeJSON(downloads, []);

    const files = Array.isArray(req.files) ? req.files : [];

    // ✅ Imagen principal
    const mainImageFile = files.find(f => f.fieldname === 'mainImageFile');
    if (mainImageFile) {
      const result = await cloudinary.uploader.upload(mainImageFile.path, {
        folder: 'imagenes/products',
        public_id: `main_${Date.now()}`
      });
      mainImage = result.secure_url;
    }

    // ✅ Thumbnails
    for (const file of files) {
      const m = /^thumbnail_(\d+)$/.exec(file.fieldname || '');
      if (!m) continue;
      const idx = parseInt(m[1], 10);
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'imagenes/products',
        public_id: `thumb_${Date.now()}_${idx}`
      });
      thumbnails[idx] = result.secure_url;
    }

    // ✅ PDFs
    for (const file of files) {
      const m = /^download_(\d+)$/.exec(file.fieldname || '');
      if (!m) continue;
      const idx = parseInt(m[1], 10);
      if (!downloads[idx]) downloads[idx] = { title: file.originalname, description: '', link: '' };
      downloads[idx].link = file.path;
    }

    const product = await Products.create({
      title, subtitle, descriptions, mainImage, thumbnails,
      contactLink, breadcrumbs, features, downloads
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    let { title, subtitle, descriptions, mainImage, thumbnails, contactLink, breadcrumbs, features, downloads } = req.body;

    descriptions = parseMaybeJSON(descriptions, product.descriptions || []);
    thumbnails   = parseMaybeJSON(thumbnails,   product.thumbnails   || []);
    breadcrumbs  = parseMaybeJSON(breadcrumbs,  product.breadcrumbs  || []);
    features     = parseMaybeJSON(features,     product.features     || []);
    downloads    = parseMaybeJSON(downloads,    product.downloads    || []);

    const files = Array.isArray(req.files) ? req.files : [];

    // ✅ Imagen principal
    const mainImageFile = files.find(f => f.fieldname === 'mainImageFile');
    if (mainImageFile) {
      const result = await cloudinary.uploader.upload(mainImageFile.path, {
        folder: 'imagenes/products',
        public_id: `main_${Date.now()}`
      });
      mainImage = result.secure_url;
    }

    // ✅ Thumbnails
    for (const file of files) {
      const m = /^thumbnail_(\d+)$/.exec(file.fieldname || '');
      if (!m) continue;
      const idx = parseInt(m[1], 10);
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'imagenes/products',
        public_id: `thumb_${Date.now()}_${idx}`
      });
      thumbnails[idx] = result.secure_url;
    }

    // ✅ PDFs
    for (const file of files) {
      const m = /^download_(\d+)$/.exec(file.fieldname || '');
      if (!m) continue;
      const idx = parseInt(m[1], 10);
      if (!downloads[idx]) downloads[idx] = { title: file.originalname, description: '', link: '' };
      downloads[idx].link = file.path;
    }

    await product.update({
      title, subtitle, descriptions, mainImage, thumbnails,
      contactLink, breadcrumbs, features, downloads
    });

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error.message); 
    console.error('Stack:', error.stack);                          
    console.error('Body:', req.body);                              
    console.error('Files:', req.files);                            
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

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