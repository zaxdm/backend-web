'use strict';

const Home = require('../models/home');
const cloudinary = require('../config/cloudinary');
const { withDB } = require('../config/sequelize');

exports.getHome = async (req, res) => {
  try {
    const home = await withDB(async () => {
      let found = await Home.findOne();
      if (!found) {
        found = await Home.create({
          hero: {
            titleLines: ['LO QUE SE NECESITA', 'PARA ROMPER', 'BARRERAS'],
            buttonText: 'aprende más',
            buttonLink: '/mas-info'
          },
          cards: [
            { image: '/tarjetas/historia.jpg', title: 'DESCUBRE LA HISTORIA DE TERELION', buttonText: 'NUESTRA HISTORIA', type: 'history' },
            { image: '/tarjetas/warrior.jpeg', title: 'BIENVENIDO A NUESTRO NUEVO MIEMBRO – WARRIOR', buttonText: 'EXPLORAR WARRIOR', type: 'history' },
            { image: '/tarjetas/ridegeback.jpeg', title: 'RIDGEBACK™ Perforación en roca dura', buttonText: 'EXPLORAR RIDGEBACK™', type: 'product' },
            { image: '/tarjetas/ridegeback.jpeg', title: 'AVENGER™ Perforación de alto rendimiento', buttonText: 'EXPLORAR AVENGER™', type: 'product' }
          ],
          about: {
            title: 'Somos Terelion',
            paragraphs: [
              'Somos especialistas orgullosos en el desarrollo y la fabricación de brocas triconicas para las industrias de la minería y la construcción.',
              'En Terelion siempre nos hemos esforzado por ser los mejores en nuestro negocio.'
            ],
            linkText: 'APRENDE MÁS ACERCA DE NOSOTROS',
            linkUrl: '#'
          }
        });
      }
      return found;
    });
    res.json(home);
  } catch (error) {
    console.error('Error al obtener Home:', error.message);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

exports.updateHome = async (req, res) => {
  try {
    const hero  = typeof req.body.hero  === 'string' ? JSON.parse(req.body.hero)  : req.body.hero;
    const about = typeof req.body.about === 'string' ? JSON.parse(req.body.about) : req.body.about;
    const cards = typeof req.body.cards === 'string' ? JSON.parse(req.body.cards) : req.body.cards;

    // Cloudinary fuera del withDB
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].image && cards[i].image.startsWith('data:image')) {
        const result = await cloudinary.uploader.upload(cards[i].image, { folder: 'imagenes/cards', public_id: `card_${Date.now()}_${i}` });
        cards[i].image = result.secure_url;
      }
    }

    const home = await withDB(async () => {
      const found = await Home.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para actualizar'), { status: 404 });
      await found.update({ hero, cards, about });
      return found;
    });
    res.json(home);
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al actualizar Home:', error.message);
    res.status(status).json({ message: error.message });
  }
};

exports.deleteHome = async (req, res) => {
  try {
    await withDB(async () => {
      const found = await Home.findOne();
      if (!found) throw Object.assign(new Error('No existe contenido para eliminar'), { status: 404 });
      await found.destroy();
    });
    res.json({ message: 'Home eliminado correctamente' });
  } catch (error) {
    const status = error.status ?? 500;
    console.error('Error al eliminar Home:', error.message);
    res.status(status).json({ message: error.message });
  }
};