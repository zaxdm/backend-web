const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pdf',
    resource_type: 'raw', // <-- CAMBIAR de 'auto' a 'raw'
    format: 'pdf',
    public_id: (req, file) => {
      // Generar un ID más consistente
      return `doc_${Date.now()}`;
    }
  }
});


const uploadPdf = multer({ storage });

module.exports = uploadPdf;
