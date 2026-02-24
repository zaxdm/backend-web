'use strict';

const Footer = require('../models/footer');

/**
 * Obtener Footer
 */
exports.getFooter = async (req, res) => {
  try {
    let footer = await Footer.findOne();

    if (!footer) {
      const content = {
        menuIzquierda: [
          { label: 'Acerca de este sitio web', ruta: '/about-this-website/' },
          { label: 'Cookies', ruta: '/cookies/' },
          { label: 'Aviso legal', ruta: '/legal-notice/' },
          { label: 'Privacidad de datos', ruta: '/data-privacy/' }
        ],
        noticias: [
          { fecha: '2022-02-25', titulo: 'Terelion es expositor en Minexchange 2022 SME Annual Conference & Expo', url: '#' },
          { fecha: '2020-10-19', titulo: 'Terelion estará en MINExpo 2021', url: '#' },
          { fecha: '2020-10-19', titulo: 'Síguenos en nuestras redes sociales', url: '#' }
        ],
        logoCentro: '/logo-blanco.png',
        contacto: { telefono: '+14692944196', email: 'frank.rupay@jftriconperu.com' },
        redes: [
          { icon: 'bi bi-facebook', url: 'https://www.facebook.com/share/1BzmQ64ZW3/', nombre: 'Facebook' },
          { icon: 'bi bi-linkedin', url: 'https://www.linkedin.com/company/jf-tricon-perú', nombre: 'LinkedIn' },
          { icon: 'bi bi-instagram', url: 'https://www.instagram.com/terelion.mining/', nombre: 'Instagram' }
        ],
        followText: 'SÍGUENOS EN —',
        copyright: `© ${new Date().getFullYear()} - JF Tricon Perú, LLC`
      };
      footer = await Footer.create({ content });
    }

    res.json(footer);
  } catch (error) {
    console.error('Error al obtener Footer:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};


/**
 * Crear Footer (solo si no existe)
 */
exports.createFooter = async (req, res) => {
  try {
    const existing = await Footer.findOne();

    if (existing) {
      return res.status(400).json({
        message: 'El Footer ya existe. Usa update.'
      });
    }

    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        message: 'content es requerido'
      });
    }

    const footer = await Footer.create({
      content
    });

    res.status(201).json(footer);
  } catch (error) {
    console.error('Error al crear Footer:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};


/**
 * Actualizar Footer
 */
exports.updateFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();

    if (!footer) {
      return res.status(404).json({
        message: 'No existe contenido para actualizar'
      });
    }

    const { content } = req.body;

    await footer.update({
      content
    });

    res.json(footer);
  } catch (error) {
    console.error('Error al actualizar Footer:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};


/**
 * Eliminar Footer
 */
exports.deleteFooter = async (req, res) => {
  try {
    const footer = await Footer.findOne();

    if (!footer) {
      return res.status(404).json({
        message: 'No existe contenido para eliminar'
      });
    }

    await footer.destroy();

    res.json({
      message: 'Footer eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar Footer:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
