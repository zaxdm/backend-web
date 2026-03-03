const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:3000', 'https://backend-web-bay.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', routes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
}

module.exports = app;