/** @format */

require("dotenv").config();
const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/modelService");
const InputError = require("../exceptions/InputError");

(async () => {
	const server = Hapi.server({
    port: process.env.PORT || 8080, // Use PORT instead of APP_PORT for Cloud Run compatibility
    host: "0.0.0.0", // Use 0.0.0.0 to allow external access
    routes: {
        cors: {
            origin: ["*"], // Allow all origins
        },
        payload: {
            maxBytes: 1 * 1024 * 1024, // Set payload size to 1 MB
        },
    },
});

	const model = await loadModel();
	server.app.model = model;

	server.route(routes);

	server.ext("onPreResponse", function (request, h) {
        const response = request.response;
        
		if (response.isBoom && response.output.statusCode === 413) {
			const newResponse = h.response({
				status: "fail",
				message: "Payload content length greater than maximum allowed: 1000000",
			});
			newResponse.code(413);
			return newResponse;
		}

		if (response instanceof InputError) {
			const newResponse = h.response({
				status: "fail",
				message: `${response.message}`,
			});
			newResponse.code(response.statusCode);
			return newResponse;
		}

		if (response.isBoom) {
			const newResponse = h.response({
				status: "fail",
				message: response.message,
			});
			newResponse.code(response.output.statusCode);
			return newResponse;
		}

		return h.continue;
	});

	await server.start();
	console.log(`Server start at: ${server.info.uri}`);
})();