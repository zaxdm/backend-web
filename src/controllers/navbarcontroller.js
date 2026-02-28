'use strict';

const Navbar = require('../models/navbar');
const cloudinary = require('../config/cloudinary');

exports.getNavbar = async (req, res) => {
  try {
    let navbar = await Navbar.findOne();

    if (!navbar) {
      navbar = await Navbar.create({
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

    res.json(navbar);
  } catch (error) {
    console.error('Error al obtener Navbar:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.createNavbar = async (req, res) => {
  try {
    const existing = await Navbar.findOne();
    if (existing) return res.status(400).json({ message: 'El Navbar ya existe. Usa update.' });

    const {
      productosLabel, aboutLabel, contactoLabel, contactoRuta,
      siguenos, buscarPlaceholder, aboutMenu, productosMenu, redes, logoActual
    } = req.body;

    if (!productosLabel || !aboutLabel || !contactoLabel || !contactoRuta ||
        !siguenos || !buscarPlaceholder || !aboutMenu || !productosMenu || !redes || !logoActual) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const navbar = await Navbar.create({
      productosLabel, aboutLabel, contactoLabel, contactoRuta,
      siguenos, buscarPlaceholder, aboutMenu, productosMenu, redes, logoActual
    });
    res.status(201).json(navbar);
  } catch (error) {
    console.error('Error al crear Navbar:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.updateNavbar = async (req, res) => {
  try {
    const navbar = await Navbar.findOne();
    if (!navbar) return res.status(404).json({ message: 'No existe contenido para actualizar' });

    let {
      productosLabel, aboutLabel, contactoLabel, contactoRuta,
      siguenos, buscarPlaceholder, aboutMenu, productosMenu, redes, logoActual
    } = req.body;

    // Si el logo es base64, subirlo a Cloudinary
    if (logoActual && logoActual.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(logoActual, {
        folder: 'imagenes/navbar',
        public_id: `logo_${Date.now()}`
      });
      logoActual = result.secure_url;
    }

    await navbar.update({
      productosLabel, aboutLabel, contactoLabel, contactoRuta,
      siguenos, buscarPlaceholder, aboutMenu, productosMenu, redes, logoActual
    });
    res.json(navbar);
  } catch (error) {
    console.error('Error al actualizar Navbar:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.deleteNavbar = async (req, res) => {
  try {
    const navbar = await Navbar.findOne();
    if (!navbar) return res.status(404).json({ message: 'No existe contenido para eliminar' });
    await navbar.destroy();
    res.json({ message: 'Navbar eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar Navbar:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};