'use strict';

const About = require('../models/about');

/**
 * Obtener contenido About
 */
exports.getAbout = async (req, res) => {
  try {
    
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    let about = await About.findOne();

    if (!about) {
      const aboutData = {
        heroTitle: 'SOBRE NOSOTROS',
        subtitle: 'Nuestra misión, valores y equipo',
        paragraphs: [
          'Somos orgullosos especialistas en el desarrollo y fabricación de brocas de cono de rodillos para las industrias de minería y construcción. Texas es nuestra patria, pero la industria minera a cielo abierto mundial es nuestro patio de recreo.',
          'En Terelion siempre nos hemos dedicado a ser los mejores en nuestro negocio. Exploramos constantemente nuevos diseños innovadores, nuevos materiales, nuevos métodos de fabricación y nuevas herramientas de ingeniería. Sólo para suministrar a nuestros clientes las brocas de cono de rodillos más resistentes, eficientes y rentables disponibles.'
        ],
        paragraphs2: [
          'Dondequiera que mires, el mundo está lleno de tareas desafiantes que la humanidad debe resolver. En Terelion nos especializamos en aquellos desafíos que plantea la perforación con voladuras en la minería a cielo abierto.',
          'Siempre nos hemos dedicado a ser los mejores en nuestro negocio. Exploramos constantemente nuevos diseños innovadores, nuevos materiales, nuevos métodos de fabricación y nuevas herramientas de ingeniería. Todo con el objetivo de fabricar las brocas de cono de rodillos más resistentes, eficientes y rentables disponibles.',
          'Algunas de nuestras innovaciones son menores. Otros conducen a avances que afectan a toda la industria. Estén atentos y estarán entre los primeros en saber cuándo Terelion lanzará la próxima innovación en perforación de rocas.'
        ]
      };
      about = await About.create({ aboutData });
    }

    res.json(about);
  } catch (error) {
    console.error('Error al obtener About:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Crear About (solo si no existe)
 */
exports.createAbout = async (req, res) => {
  try {
    const existing = await About.findOne();

    if (existing) {
      return res.status(400).json({
        message: 'El About ya existe. Usa update.'
      });
    }

    const { aboutData } = req.body;

    if (!aboutData) {
      return res.status(400).json({
        message: 'aboutData es requerido'
      });
    }

    const about = await About.create({
      aboutData
    });

    res.status(201).json(about);
  } catch (error) {
    console.error('Error al crear About:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Actualizar About
 */
exports.updateAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        message: 'No existe contenido para actualizar'
      });
    }

    const { aboutData } = req.body;

    await about.update({
      aboutData
    });

    res.json(about);
  } catch (error) {
    console.error('Error al actualizar About:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};


/**
 * Eliminar About
 */
exports.deleteAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        message: 'No existe contenido para eliminar'
      });
    }

    await about.destroy();

    res.json({
      message: 'About eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar About:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};
