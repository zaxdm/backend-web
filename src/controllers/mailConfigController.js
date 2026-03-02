const nodemailer = require('nodemailer');
const { MailConfig } = require('../../models'); // Ajusta según tu estructura

// Obtener configuración actual
exports.getMailConfig = async (req, res) => {
  try {
    const config = await MailConfig.findOne({ where: { id: 1 } });
    
    if (!config) {
      console.log('⚠️ Configuración no encontrada - devolviendo vacío');
      return res.status(200).json({
        mailUser: '',
        message: 'Sin configuración previa'
      });
    }

    console.log('✅ Configuración cargada:', config.mailUser);
    
    // No enviar la contraseña al frontend
    res.status(200).json({
      mailUser: config.mailUser,
      // mailPass no se devuelve por seguridad
      success: true
    });
  } catch (error) {
    console.error('❌ Error al obtener configuración:', error.message);
    res.status(500).json({ 
      message: 'Error al obtener configuración', 
      error: error.message,
      success: false
    });
  }
};

// Guardar configuración
exports.saveMailConfig = async (req, res) => {
  try {
    const { mailUser, mailPass } = req.body;

    // Validaciones básicas
    if (!mailUser || !mailPass) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    if (!mailUser.includes('@gmail.com')) {
      return res.status(400).json({ message: 'Solo se soportan cuentas @gmail.com' });
    }

    // Verificar que la contraseña tenga el formato de app password (16 caracteres sin espacios)
    const cleanPass = mailPass.replace(/\s/g, '');
    if (cleanPass.length !== 16) {
      return res.status(400).json({ 
        message: 'La contraseña de aplicación debe tener 16 caracteres. Obtén una nueva desde tu cuenta Google.' 
      });
    }

    // Buscar o crear configuración
    let config = await MailConfig.findOne({ where: { id: 1 } });
    
    if (config) {
      config.mailUser = mailUser;
      config.mailPass = mailPass;
      await config.save();
    } else {
      config = await MailConfig.create({
        id: 1,
        mailUser,
        mailPass
      });
    }

    res.json({ 
      message: 'Configuración de correo guardada',
      mailUser: config.mailUser 
    });
  } catch (error) {
    console.error('Error al guardar configuración:', error);
    res.status(500).json({ 
      message: 'Error al guardar configuración', 
      error: error.message 
    });
  }
};

// Probar envío de correo
exports.testMailConfig = async (req, res) => {
  try {
    // Obtener credenciales de la BD
    const config = await MailConfig.findOne({ where: { id: 1 } });
    
    if (!config || !config.mailUser || !config.mailPass) {
      return res.status(400).json({ 
        message: 'No hay configuración de correo guardada. Primero guarda las credenciales.' 
      });
    }

    // Crear transporte de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mailUser,
        pass: config.mailPass.replace(/\s/g, '') // Eliminar espacios de la contraseña
      }
    });

    // Verificar conexión
    await transporter.verify();

    // Enviar correo de prueba al mismo usuario
    const testEmail = {
      from: config.mailUser,
      to: config.mailUser,
      subject: '✅ Prueba de configuración SEMINCO',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Configuración de correo verificada</h2>
          <p>Este es un correo de prueba para verificar que tu configuración de Gmail es correcta.</p>
          <p><strong>Remitente:</strong> ${config.mailUser}</p>
          <p style="color: #27ae60; margin-top: 20px;">✅ Puedes enviar formularios de contacto ahora</p>
        </div>
      `
    };

    const result = await transporter.sendMail(testEmail);

    res.json({ 
      message: 'Correo de prueba enviado correctamente',
      messageId: result.messageId 
    });

  } catch (error) {
    console.error('Error al enviar correo de prueba:', error);

    // Mensajes de error específicos
    let errorMessage = 'Error al enviar correo de prueba';

    if (error.message.includes('Invalid login')) {
      errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña de aplicación.';
    } else if (error.message.includes('Bad credentials')) {
      errorMessage = 'Las credenciales de Gmail no son válidas. ¿Usaste una contraseña de aplicación?';
    } else if (error.message.includes('Account not found')) {
      errorMessage = 'La cuenta de Gmail no existe o no es un @gmail.com válido.';
    } else if (error.message.includes('Too many login attempts')) {
      errorMessage = 'Demasiados intentos fallidos. Intenta de nuevo más tarde.';
    }

    res.status(500).json({ 
      message: errorMessage,
      rawError: error.message 
    });
  }
};