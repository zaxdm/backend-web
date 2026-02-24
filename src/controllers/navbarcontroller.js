'use strict';

const db = require('../../models');
const Navbar = db.Navbar;

/**
 * Obtener Navbar
 */
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
            titulo: 'Brocas Tricónicas', ruta: '/productos/general',
            items: [
              { nombre: 'RIDGEBACK™ – Perforación en roca dura', ruta: '/productos' },
              { nombre: 'AVENGER™ – Perforación de alto rendimiento', ruta: '/productos' }
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
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};


/**
 * Crear Navbar (solo si no existe)
 */
exports.createNavbar = async (req, res) => {
  try {
    const existing = await Navbar.findOne();

    if (existing) {
      return res.status(400).json({
        message: 'El Navbar ya existe. Usa update.'
      });
    }

    const {
      productosLabel,
      aboutLabel,
      contactoLabel,
      contactoRuta,
     iguenos,
      buscarPlaceholder,
      aboutMenu,
      productosMenu,
      redes,
      logoActual
    } = req.body;

    // Validación mínima
    if (
      !productosLabel ||
      !aboutLabel ||
      !contactoLabel ||
      !contactoRuta ||
      !siguenos ||
      !buscarPlaceholder ||
      !aboutMenu ||
      !productosMenu ||
      !redes ||
      !logoActual
    ) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos'
      });
    }

    const navbar = await Navbar.create({
      productosLabel,
      aboutLabel,
      contactoLabel,
      contactoRuta,
     iguenos,
      buscarPlaceholder,
      aboutMenu,
      productosMenu,
      redes,
      logoActual
    });

    res.status(201).json(navbar);
  } catch (error) {
    console.error('Error al crear Navbar:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};


/**
 * Actualizar Navbar
 */
exports.updateNavbar = async (req, res) => {
  try {
    const navbar = await Navbar.findOne();

    if (!navbar) {
      return res.status(404).json({
        message: 'No existe contenido para actualizar'
      });
    }

    const {
      productosLabel,
      aboutLabel,
      contactoLabel,
      contactoRuta,
     iguenos,
      buscarPlaceholder,
      aboutMenu,
      productosMenu,
      redes,
      logoActual
    } = req.body;

    await navbar.update({
      productosLabel,
      aboutLabel,
      contactoLabel,
      contactoRuta,
     iguenos,
      buscarPlaceholder,
      aboutMenu,
      productosMenu,
      redes,
      logoActual
    });

    res.json(navbar);
  } catch (error) {
    console.error('Error al actualizar Navbar:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};


/**
 * Eliminar Navbar
 */
exports.deleteNavbar = async (req, res) => {
  try {
    const navbar = await Navbar.findOne();

    if (!navbar) {
      return res.status(404).json({
        message: 'No existe contenido para eliminar'
      });
    }

    await navbar.destroy();

    res.json({
      message: 'Navbar eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar Navbar:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
