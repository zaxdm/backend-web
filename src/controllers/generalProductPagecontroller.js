'use strict';

const GeneralProductPage = require('../models/general_product_page');
const cloudinary = require('../config/cloudinary');

/**
 * GET /api/general-product-page
 * Retorna TODAS las páginas (una por categoría)
 */
exports.getAllGeneralProductPages = async (req, res) => {
  try {
    const pages = await GeneralProductPage.findAll();
    res.json(pages);
  } catch (error) {
    console.error('Error al obtener General Product Pages:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * GET /api/general-product-page/:categoryKey
 * Retorna la página de una categoría específica.
 * Si no existe, la crea con datos vacíos (upsert implícito).
 * El frontend usa esto al seleccionar una categoría.
 */
exports.getGeneralProductPage = async (req, res) => {
  try {
    const categoryKey = decodeURIComponent(req.params.categoryKey);

    let page = await GeneralProductPage.findOne({ where: { categoryKey } });

    if (!page) {
      // Crear con datos vacíos para que el frontend pueda editarla
      page = await GeneralProductPage.create({
        categoryKey,
        headerData: {
          titulo: '',
          descripcion: '',
          breadcrumbs: []
        },
        infoSection: {
          texto: '',
          boton: { label: '', link: '' }
        },
        products: []
      });
    }

    res.json(page);
  } catch (error) {
    console.error('Error al obtener General Product Page:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

/**
 * PUT /api/general-product-page/:categoryKey
 * Actualiza (o crea si no existe) la página de una categoría.
 * El frontend envía JSON con headerData, infoSection, products.
 * Las imágenes en products[i].image pueden venir como base64.
 */
exports.updateGeneralProductPage = async (req, res) => {
  try {
    const categoryKey = decodeURIComponent(req.params.categoryKey);

    let { headerData, infoSection, products } = req.body;

    // Parsear si vienen como string (FormData)
    if (typeof headerData === 'string') headerData = JSON.parse(headerData);
    if (typeof infoSection === 'string') infoSection = JSON.parse(infoSection);
    if (typeof products === 'string') products = JSON.parse(products);

    // Subir imágenes base64 a Cloudinary
    for (let i = 0; i < products.length; i++) {
      if (products[i].image && products[i].image.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(products[i].image, {
          folder: 'imagenes/general-products',
          public_id: `general_product_${Date.now()}_${i}`
        });
        products[i].image = result.secure_url;
      }
    }

    // Upsert: buscar y actualizar o crear
    let page = await GeneralProductPage.findOne({ where: { categoryKey } });

    if (page) {
      await page.update({ headerData, infoSection, products });
    } else {
      page = await GeneralProductPage.create({ categoryKey, headerData, infoSection, products });
    }

    res.json(page);
  } catch (error) {
    console.error('Error al actualizar General Product Page:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

/**
 * DELETE /api/general-product-page/:categoryKey
 * Elimina la página de una categoría específica.
 */
exports.deleteGeneralProductPage = async (req, res) => {
  try {
    const categoryKey = decodeURIComponent(req.params.categoryKey);

    const page = await GeneralProductPage.findOne({ where: { categoryKey } });

    if (!page) {
      return res.status(404).json({ message: 'No existe contenido para eliminar' });
    }

    await page.destroy();
    res.json({ message: `Página de categoría "${categoryKey}" eliminada correctamente` });
  } catch (error) {
    console.error('Error al eliminar General Product Page:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};