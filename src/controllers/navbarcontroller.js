'use strict';

const Navbar = require('../models/navbar');
const cloudinary = require('../config/cloudinary');
const { withDB } = require('../config/sequelize');

exports.getNavbar = async (req, res) => {
  try {
    const navbar = await withDB(async () => {
      let found = await Navbar.findOne();
      if (!found) {
        found = await Navbar.create({
          productosLabel: 'Productos',
          aboutLabel: 'Acerca de',
          contactoLabel: 'Contacto',
          contactoRuta: '/contactos',
          siguenos: 'Síguenos en',
          buscarPlaceholder: 'Buscar en terelion.com...',
          aboutMenu: [
            { nombre: 'Nosotros', ruta: '/acerca-de' },
            { nombre: 'Nuestra Historia', ruta: '/his' }
          ],
          productosMenu: [
            {
              titulo: 'Brocas Tricónicas',
              ruta: '/productos/general',
              items: [
                { nombre: 'RIDGEBACK™ – Perforación en roca dura', ruta: '/productos/ridgeback' },
                { nombre: 'AVENGER™ – Perforación de alto rendimiento', ruta: '/productos/avenger' }
              ]
            }
          ],
          redes: [
            { nombre: 'facebook', icon: 'bi bi-facebook', url: 'https://www.facebook.com/share/1BzmQ64ZW3/' },
            { nombre: 'linkedin', icon: 'bi bi-linkedin', url: 'https://www.linkedin.com/company/jf-tricon-per%C3%BA/' }
          ],
          logoActual: '/logo-blanco.png'
        });
      }
      return found;
    });
    res.json(navbar);
  } catch (error) {
    console.error('Error al obtener Navbar:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.createNavbar = async (req, res) => {
  try {
    const navbar = await withDB(async () => {
      const existing = await Navbar.findOne();
      if (existing) throw Object.assign(new Error('El Navbar ya existe. Usa update.'), { status: 400 });
      const { productosLabel, aboutLabel, contactoLabel, contactoRuta, siguenos, buscarPlaceholder, aboutMenu, productosMenu, redes, logoActual } = req.body;
      if (!productosLabel || !aboutLabel || !contactoLabel || !contactoRuta || !siguenos || !buscarPlaceholder || !aboutMenu || !productosMenu || !redes || !logoActual) {
        throw Object.assign(new Error('Todos los campos son requeridos'), { status: 400 });
      }
      return await Navbar.create({ productosLabel, aboutLabel, contactoLabel, contactoRuta, siguenos, buscarPlaceholder, aboutMenu, productosMenu, redes, logoActual });
    });
    res.status(201).json(navbar);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al crear Navbar:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.updateNavbar = async (req, res) => {
  try {
    let { productosLabel, aboutLabel, contactoLabel, contactoRuta, siguenos, buscarPlaceholder, aboutMenu, productosMenu, redes, logoActual } = req.body;

    // Cloudinary fuera del withDB
    if (logoActual && logoActual.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(logoActual, { folder: 'imagenes/navbar', public_id: `logo_${Date.now()}` });
      logoActual = result.secure_url;
    }

    const navbar = await withDB(async () => {
      const found = await Navbar.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para actualizar'), { status: 404 });
      await found.update({ productosLabel, aboutLabel, contactoLabel, contactoRuta, siguenos, buscarPlaceholder, aboutMenu, productosMenu, redes, logoActual });
      return found;
    });
    res.json(navbar);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar Navbar:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.deleteNavbar = async (req, res) => {
  try {
    await withDB(async () => {
      const found = await Navbar.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para eliminar'), { status: 404 });
      await found.destroy();
    });
    res.json({ message: 'Navbar eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar Navbar:', error.message);
    res.status(status).json({ message: error.message });
  }
};