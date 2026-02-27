'use strict';

const Home = require('../models/home');

// GET /api/home
exports.getHome = async (req, res) => {
  try {
    let home = await Home.findOne();

    if (!home) {
      home = await Home.create({
        hero: {
          titleLines: ['LO QUE SE NECESITA', 'PARA ROMPER', 'BARRERAS'],
          buttonText: 'aprende más',
          buttonLink: '/mas-info'
        },
        cards: [
          { image: '/tarjetas/historia.jpg', title: 'DESCUBRE LA HISTORIA DE TERELION', buttonText: 'NUESTRA HISTORIA', type: 'history' },
          { image: '/tarjetas/warrior.jpeg', title: 'BIENVENIDO A NUESTRO NUEVO MIEMBRO — WARRIOR', buttonText: 'EXPLORAR WARRIOR', type: 'history' },
          { image: '/tarjetas/ridegeback.jpeg', title: 'RIDGEBACK™ Perforación en roca dura', buttonText: 'EXPLORAR RIDGEBACK™', type: 'product' },
          { image: '/tarjetas/ridegeback.jpeg', title: 'AVENGER™ Perforación de alto rendimiento', buttonText: 'EXPLORAR AVENGER™', type: 'product' }
        ],
        about: {
          title: 'Somos Terelion',
          paragraphs: [
            'Somos especialistas orgullosos en el desarrollo y la fabricación de brocas triconicas para las industrias de la minería y la construcción. Texas es nuestro hogar, pero la industria mundial de la minería superficial es nuestro campo de juego.',
            'En Terelion siempre nos hemos esforzado por ser los mejores en nuestro negocio. Constantemente exploramos nuevos diseños innovadores, nuevos materiales, nuevos métodos de fabricación y nuevas herramientas de ingeniería. Solo para suministrar a nuestros clientes las brocas triconicas de rodamiento más resistentes, eficientes y económicas disponibles.'
          ],
          linkText: 'APRENDE MÁS ACERCA DE NOSOTROS',
          linkUrl: '#'
        }
      });
    }

    res.json(home);
  } catch (error) {
    console.error('Error al obtener Home:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// PUT /api/home
exports.updateHome = async (req, res) => {
  console.log('BODY:', JSON.stringify(req.body));
  console.log('FILES:', req.files);
  try {
    const home = await Home.findOne();
    if (!home) return res.status(404).json({ message: 'No existe contenido para actualizar' });

    const hero  = typeof req.body.hero  === 'string' ? JSON.parse(req.body.hero)  : req.body.hero;
    const about = typeof req.body.about === 'string' ? JSON.parse(req.body.about) : req.body.about;
    const cards = typeof req.body.cards === 'string' ? JSON.parse(req.body.cards) : req.body.cards;

    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const index = parseInt(file.fieldname.replace('cardImage_', ''));
        if (!isNaN(index) && cards[index]) {
          cards[index].image = file.path;
        }
      });
    }

    await home.update({ hero, cards, about });
    res.json(home);
  } catch (error) {
    console.error('Error al actualizar Home:', error.message, error.stack);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

// DELETE /api/home
exports.deleteHome = async (req, res) => {
  try {
    const home = await Home.findOne();
    if (!home) return res.status(404).json({ message: 'No existe contenido para eliminar' });

    await home.destroy();
    res.json({ message: 'Home eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar Home:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};