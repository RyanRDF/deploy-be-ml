const postPredictHandler = require('../server/handler');

const routes = [
  {
    path: '/predict',
    method: 'POST',
    handler: postPredictHandler,
    options: {
      payload: {
        maxBytes: 1 * 1024 * 1024, // Limit to 1 MB
        allow: 'multipart/form-data', // Allow file uploads
        multipart: true, // Enable multipart parsing
        output: 'file', // Provide uploaded files as temporary files
        parse: true, // Automatically parse the payload
      },
    },
  },
];

module.exports = routes;