'use strict';

const GeneralProductPage = require('../models/general_product_page');
const cloudinary = require('../config/cloudinary');
const { withDB } = require('../config/sequelize');

function parseJSON(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return fallback; }
  }
  return value;
}

function serializePage(page) {
  const raw = page.toJSON();
  return {
    ...raw,
    headerData:  parseJSON(raw.headerData,  { titulo: '', descripcion: '', breadcrumbs: [] }),
    infoSection: parseJSON(raw.infoSection, { texto: '', boton: { label: '', link: '' } }),
    products:    parseJSON(raw.products,    []),
  };
}

exports.getAllGeneralProductPages = async (req, res) => {
  try {
    const pages = await withDB(() => GeneralProductPage.findAll());
    res.json(pages.map(serializePage));
  } catch (error) {
    console.error('Error al obtener General Product Pages:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getGeneralProductPage = async (req, res) => {
  try {
    const categoryKey = req.query.categoryKey;
    if (!categoryKey) {
      return res.status(400).json({ message: 'El parámetro "categoryKey" es requerido' });
    }

    const page = await withDB(async () => {
      let found = await GeneralProductPage.findOne({ where: { categoryKey } });
      if (!found) {
        found = await GeneralProductPage.create({
          categoryKey,
          headerData:  { titulo: '', descripcion: '', breadcrumbs: [] },
          infoSection: { texto: '', boton: { label: '', link: '' } },
          products:    []
        });
      }
      return found;
    });

    res.json(serializePage(page));
  } catch (error) {
    console.error('Error al obtener General Product Page:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.updateGeneralProductPage = async (req, res) => {
  try {
    const categoryKey = req.query.categoryKey;
    if (!categoryKey) {
      return res.status(400).json({ message: 'El parámetro "categoryKey" es requerido' });
    }

    let { headerData, infoSection, products } = req.body;

    headerData  = parseJSON(headerData,  {});
    infoSection = parseJSON(infoSection, {});
    products    = parseJSON(products,    []);

    // Subir imágenes base64 a Cloudinary (fuera del withDB)
    for (let i = 0; i < products.length; i++) {
      if (products[i].image && products[i].image.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(products[i].image, {
          folder: 'imagenes/general-products',
          public_id: `general_product_${Date.now()}_${i}`
        });
        products[i].image = result.secure_url;
      }
    }

    const page = await withDB(async () => {
      let found = await GeneralProductPage.findOne({ where: { categoryKey } });
      if (found) {
        await found.update({ headerData, infoSection, products });
        return found;
      } else {
        return await GeneralProductPage.create({ categoryKey, headerData, infoSection, products });
      }
    });

    res.json(serializePage(page));
  } catch (error) {
    console.error('Error al actualizar General Product Page:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.deleteGeneralProductPage = async (req, res) => {
  try {
    const categoryKey = req.query.categoryKey;
    if (!categoryKey) {
      return res.status(400).json({ message: 'El parámetro "categoryKey" es requerido' });
    }

    await withDB(async () => {
      const page = await GeneralProductPage.findOne({ where: { categoryKey } });
      if (!page) throw Object.assign(new Error('No existe contenido para eliminar'), { status: 404 });
      await page.destroy();
    });

    res.json({ message: `Página de categoría "${categoryKey}" eliminada correctamente` });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar General Product Page:', error.message);
    res.status(status).json({ message: error.message });
  }
};