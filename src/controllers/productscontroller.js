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
    let { title, subtitle, descriptions, mainImage, mainImageBase64,
          thumbnails, thumbnailsBase64, contactLink, breadcrumbs,
          features, downloads, downloadsBase64 } = req.body;

    descriptions = parseMaybeJSON(descriptions, []);
    thumbnails   = parseMaybeJSON(thumbnails, []);
    breadcrumbs  = parseMaybeJSON(breadcrumbs, []);
    features     = parseMaybeJSON(features, []);
    downloads    = parseMaybeJSON(downloads, []);
    thumbnailsBase64 = parseMaybeJSON(thumbnailsBase64, []);
    downloadsBase64  = parseMaybeJSON(downloadsBase64, []);

    // Imagen principal
    if (mainImageBase64) {
      mainImage = await uploadBase64(mainImageBase64, {
        folder: 'imagenes/products',
        public_id: `main_${Date.now()}`
      });
    }

    // Thumbnails
    for (let i = 0; i < thumbnailsBase64.length; i++) {
      if (thumbnailsBase64[i]) {
        thumbnails[i] = await uploadBase64(thumbnailsBase64[i], {
          folder: 'imagenes/products',
          public_id: `thumb_${Date.now()}_${i}`
        });
      }
    }

    // PDFs
    for (let i = 0; i < downloadsBase64.length; i++) {
      if (downloadsBase64[i]) {
        const url = await uploadBase64(downloadsBase64[i], {
          folder: 'pdf',
          resource_type: 'raw',
          public_id: `doc_${Date.now()}_${i}`
        });
        if (!downloads[i]) downloads[i] = { title: '', description: '', link: '' };
        downloads[i].link = url;
      }
    }

    const product = await Products.create({
      title, subtitle, descriptions, mainImage,
      thumbnails, contactLink, breadcrumbs, features, downloads
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    let { title, subtitle, descriptions, mainImage, mainImageBase64,
          thumbnails, thumbnailsBase64, contactLink, breadcrumbs,
          features, downloads, downloadsBase64 } = req.body;

    descriptions = parseMaybeJSON(descriptions, product.descriptions || []);
    thumbnails   = parseMaybeJSON(thumbnails,   product.thumbnails   || []);
    breadcrumbs  = parseMaybeJSON(breadcrumbs,  product.breadcrumbs  || []);
    features     = parseMaybeJSON(features,     product.features     || []);
    downloads    = parseMaybeJSON(downloads,    product.downloads    || []);
    thumbnailsBase64 = parseMaybeJSON(thumbnailsBase64, []);
    downloadsBase64  = parseMaybeJSON(downloadsBase64,  []);

    // ✅ Imagen principal
    if (mainImageBase64) {
      mainImage = await uploadBase64(mainImageBase64, {
        folder: 'imagenes/products',
        public_id: `main_${Date.now()}`
      });
    }

    // ✅ Thumbnails
    for (let i = 0; i < thumbnailsBase64.length; i++) {
      if (thumbnailsBase64[i]) {
        thumbnails[i] = await uploadBase64(thumbnailsBase64[i], {
          folder: 'imagenes/products',
          public_id: `thumb_${Date.now()}_${i}`
        });
      }
    }

    // ✅ PDFs
    for (let i = 0; i < downloadsBase64.length; i++) {
      if (downloadsBase64[i]) {
        const url = await uploadBase64(downloadsBase64[i], {
          folder: 'pdf',
          resource_type: 'raw',
          public_id: `doc_${Date.now()}_${i}`
        });
        if (!downloads[i]) downloads[i] = { title: '', description: '', link: '' };
        downloads[i].link = url;
      }
    }

    await product.update({
      title, subtitle, descriptions, mainImage,
      thumbnails, contactLink, breadcrumbs, features, downloads
    });

    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
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