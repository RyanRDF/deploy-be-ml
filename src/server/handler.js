const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const crypto = require('crypto');
const getData = require('../services/getData')
 
async function postPredictHandler(request, h) {
	const { image } = request.payload;
	const { model } = request.server.app;

	const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
	const id = crypto.randomUUID();
	const createdAt = new Date().toISOString();

	const data = {
		id: id,
		result: label,
		explanation: explanation,
		suggestion: suggestion,
		confidenceScore: confidenceScore,
		createdAt: createdAt,
	};


	const response = h.response({
		status: "success",
		message: confidenceScore > 99 ? "Model is predicted successfully." : "Model is predicted successfully but under threshold. Please use the correct picture",
		data,
	});
	response.code(201);
	return response;
}

const getPredictHistoriesHandler = async (request, h) => {
  const allData = await getData();

  return h.response({
    status: 'success',
    data: allData,
  }).code(200);
}
 
module.exports = {postPredictHandler, getPredictHistoriesHandler};
