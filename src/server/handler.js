const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const crypto = require('crypto');
const getData = require('../services/getData')
 
async function postPredictHandler(request, h) {
	try {
	  const { image } = request.payload;
	  const { model } = request.server.app;
  
	  // Validasi awal untuk memeriksa apakah gambar ada
	  if (!image) {
		throw new ClientError('Gambar tidak ditemukan dalam payload', 400);
	  }
  
	  // Pastikan data gambar adalah buffer
	  if (!Buffer.isBuffer(image._data)) {
		throw new ClientError('Format gambar tidak valid. Harus berupa file gambar.', 400);
	  }
  
	  // Panggil fungsi prediksi
	  const { confidenceScore, label, suggestion } = await predictClassification(model, image._data);
  
	  // Simpan hasil prediksi
	  const id = crypto.randomUUID();
	  const createdAt = new Date().toISOString();
	  const data = { id, result: label, suggestion, confidenceScore, createdAt };
  
	  await storeData(id, data);
  
	  // Kirim respons sukses
	  return h.response({
		status: 'success',
		message: 'Model is predicted successfully',
		data,
	  }).code(201);
	} catch (error) {
	  console.error('Error in postPredictHandler:', error.message);
  
	  if (error instanceof ClientError) {
		// Jika kesalahan berasal dari ClientError, gunakan status 400 dan ubah pesan respons
		return h.response({
		  status: 'fail',
		  message: 'Terjadi kesalahan dalam melakukan prediksi',
		}).code(error.statusCode);
	  }
  
	  // Kesalahan lainnya dianggap sebagai server error
	  return h.response({
		status: 'error',
		message: 'Terjadi kesalahan pada server.',
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