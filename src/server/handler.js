const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const crypto = require('crypto');
const getData = require('../services/getData')
 
async function postPredictHandler(request, h) {
	try {
	  const { image } = request.payload;
	  const { model } = request.server.app;
  
	  if (!image) {
		throw new ClientError('Gambar tidak ditemukan dalam payload', 400);
	  }
  
	  const { confidenceScore, label, suggestion } = await predictClassification(model, image._data); // Use image._data if the file is received as multipart/form-data
	  const id = crypto.randomUUID();
	  const createdAt = new Date().toISOString();
  
	  const data = {
		id: id,
		result: label,
		suggestion: suggestion,
		confidenceScore: confidenceScore,
		createdAt: createdAt,
	  };
  
	  await storeData(id, data);
  
	  const response = h.response({
		status: 'success',
		message: "Model berhasil memprediksi",
		data,
	  });
	  response.code(201);
	  return response;
	} catch (error) {
	  console.error('Error in postPredictHandler:', error.message);
	  return h.response({
		status: 'fail',
		message: error.message,
	  }).code(500);
	}
  }

const getPredictHistoriesHandler = async (request, h) => {
  const allData = await getData();

  return h.response({
    status: 'success',
    data: allData,
  }).code(200);
}
 
module.exports = {postPredictHandler, getPredictHistoriesHandler};