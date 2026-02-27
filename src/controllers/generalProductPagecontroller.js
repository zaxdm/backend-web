'use strict';

const GeneralProductPage = require('../models/general_product_page');
const cloudinary = require('../config/cloudinary');

/**
 * Obtener General Product Page
 */
exports.getGeneralProductPage = async (req, res) => {
  try {
    let page = await GeneralProductPage.findOne();

    if (!page) {
      const headerData = {
        titulo: 'BROCAS TRICÓNICAS',
        descripcion: 'Soluciones diseñadas para rendimiento y durabilidad.',
        breadcrumbs: ['PRODUCTOS', 'BROCAS']
      };
      const infoSection = {
        texto: 'Conoce nuestra gama de productos y encuentra el ideal para tu operación.',
        boton: { label: 'CONTÁCTANOS', link: '/contactos' }
      };
      const products = [
        { title: 'Producto 1', image: 'assets/products/bit1.png', link: '#' },
        { title: 'Producto 2', image: 'assets/products/bit2.png', link: '#' }
      ];
      page = await GeneralProductPage.create({ headerData, infoSection, products });
    }

    res.json(page);
  } catch (error) {
    console.error('Error al obtener General Product Page:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Crear (solo si no existe)
 */
exports.createGeneralProductPage = async (req, res) => {
  try {
    const existing = await GeneralProductPage.findOne();

    if (existing) {
      return res.status(400).json({
        message: 'La página ya existe. Usa update.'
      });
    }

    const { headerData, infoSection, products } = req.body;

    if (!headerData || !infoSection || !products) {
      return res.status(400).json({
        message: 'headerData, infoSection y products son requeridos'
      });
    }

    const page = await GeneralProductPage.create({
      headerData,
      infoSection,
      products
    });

    res.status(201).json(page);
  } catch (error) {
    console.error('Error al crear General Product Page:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Actualizar
 */
exports.updateGeneralProductPage = async (req, res) => {
  try {
    const page = await GeneralProductPage.findOne();

    if (!page) {
      return res.status(404).json({ message: 'No existe contenido para actualizar' });
    }

    let { headerData, infoSection, products } = req.body;

    // ✅ Parsear si vienen como string (FormData)
    if (typeof headerData === 'string') headerData = JSON.parse(headerData);
    if (typeof infoSection === 'string') infoSection = JSON.parse(infoSection);
    if (typeof products === 'string') products = JSON.parse(products);

    // ✅ Subir imágenes base64 a Cloudinary
    for (let i = 0; i < products.length; i++) {
      if (products[i].image && products[i].image.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(products[i].image, {
          folder: 'imagenes/general-products',
          public_id: `general_product_${Date.now()}_${i}`
        });
        products[i].image = result.secure_url;
      }
    }

    await page.update({ headerData, infoSection, products });
    res.json(page);
  } catch (error) {
    console.error('Error al actualizar General Product Page:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};


/**
 * Eliminar
 */
exports.deleteGeneralProductPage = async (req, res) => {
  try {
    const page = await GeneralProductPage.findOne();

    if (!page) {
      return res.status(404).json({
        message: 'No existe contenido para eliminar'
      });
    }

    await page.destroy();

    res.json({
      message: 'General Product Page eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar General Product Page:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};
