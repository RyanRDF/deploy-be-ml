require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const ClientError = require('../exceptions/ClientError');

(async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const model = await loadModel();
  server.app.model = model;

  server.route(routes);

  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
  
    // Tangani ClientError
    if (response instanceof ClientError) {
      return h
        .response({
          status: 'fail',
          message: response.message,
        })
        .code(response.statusCode);
    }
  
    // Tangani error Boom (kesalahan framework)
    if (response.isBoom) {
      return h
        .response({
          status: 'fail',
          message: response.output.payload.message,
        })
        .code(response.output.statusCode);
    }
  
    // Lanjutkan jika tidak ada error
    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();