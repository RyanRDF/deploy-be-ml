const { postPredictHandler, getPredictHistoriesHandler } = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1000000, // Limit 1 MB
        allow: 'multipart/form-data', // Allow file uploads
        multipart: true, // Enable multipart parsing
        output: 'stream', // Provide uploaded files as streams
        parse: true, // Automatically parse the payload
      },
    },
  },
  {
    path: '/predict/histories',
    method: 'GET',
    handler: getPredictHistoriesHandler,
  },
];

module.exports = routes;