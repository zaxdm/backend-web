const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/api', routes);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Servidor corriendo en puerto ${port}`));
}

module.exports = app;