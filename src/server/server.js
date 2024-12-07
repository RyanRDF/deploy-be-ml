// require('dotenv').config();
// const Hapi = require('@hapi/hapi');
// const routes = require('../server/routes');
// const loadModel = require('../services/loadModel');
// const ClientError = require('../exceptions/ClientError');
 
// (async () => {
//     const server = Hapi.server({
//         port: process.env.PORT || 8080,
//         host: '0.0.0.0',
//         debug: { request: ['error'] },
//         routes: {
//             cors: {
//               origin: ['*'],
//             },
//         },
//     });
 
//     const model = await loadModel();
//     server.app.model = model;
 
//     server.route(routes);
 
//     server.ext('onPreResponse', function (request, h) {
//         const response = request.response;
 
//         if (response instanceof ClientError) {
//             const newResponse = h.response({
//                 status: 'fail',
//                 message: `${response.message} Silakan gunakan foto lain.`
//             })
//             newResponse.code(response.statusCode)
//             return newResponse;
//         }
 
//         if (response.isBoom) {
//             const newResponse = h.response({
//                 status: 'fail',
//                 message: response.message
//             })
//             newResponse.code(response.output.statusCode)
//             return newResponse;
//         }
 
//         return h.continue;
//     });
 
//     await server.start();
//     console.log(`Server start at: ${server.info.uri}`);
// })();

require('dotenv').config();

const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel');
const InputError = require('../exceptions/ClientError');

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

    if (response instanceof InputError) {
      return h
        .response({
          status: 'fail',
          message: `${response.message}`,
        })
        .code(response.statusCode);
    }

    if (response.isBoom) {
      return h
        .response({
          status: 'fail',
          message: response.message,
        })
        .code(response.output.statusCode);
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();