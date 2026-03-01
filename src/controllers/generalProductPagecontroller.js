'use strict';

const GeneralProductPage = require('../models/general_product_page');
const cloudinary = require('../config/cloudinary');
const { withDB } = require('../config/database'); // ← ajusta la ruta si es diferente

exports.getAllGeneralProductPages = async (req, res) => {
  try {
    const pages = await withDB(() => GeneralProductPage.findAll());
    res.json(pages);
  } catch (error) {
    console.error('Error al obtener General Product Pages:', error.message);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.getGeneralProductPage = async (req, res) => {
  try {
    const categoryKey = decodeURIComponent(req.params.categoryKey);

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

    res.json(page);
  } catch (error) {
    console.error('Error al obtener General Product Page:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.updateGeneralProductPage = async (req, res) => {
  try {
    const categoryKey = decodeURIComponent(req.params.categoryKey);

    let { headerData, infoSection, products } = req.body;

    if (typeof headerData  === 'string') headerData  = JSON.parse(headerData);
    if (typeof infoSection === 'string') infoSection = JSON.parse(infoSection);
    if (typeof products    === 'string') products    = JSON.parse(products);

    // Subir imágenes base64 a Cloudinary (fuera del withDB — no usa DB)
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

    res.json(page);
  } catch (error) {
    console.error('Error al actualizar General Product Page:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.deleteGeneralProductPage = async (req, res) => {
  try {
    const categoryKey = decodeURIComponent(req.params.categoryKey);

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