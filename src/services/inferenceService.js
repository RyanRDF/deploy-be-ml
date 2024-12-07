const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/ClientError');

 
async function predictClassification(model, image) {
	try {
	  console.log('Start prediction process');
  
	  let tensor = tf.node
		.decodeJpeg(image)
		.resizeNearestNeighbor([224, 224])
		.expandDims()
		.toFloat();
  
	  // Periksa apakah gambar grayscale dan ubah ke RGB
	  if (tensor.shape[3] === 1) {
		tensor = tensor.tile([1, 1, 1, 3]); // Konversi grayscale ke RGB
		console.log('Converted grayscale image to RGB');
	  } else if (tensor.shape[3] !== 3) {
		throw new ClientError(
		  'Format gambar tidak valid. Harus berupa RGB atau grayscale.',
		  400
		);
	  }
  
	  console.log('Image processed into tensor');
  
	  const prediction = model.predict(tensor);
	  const score = await prediction.data();
	  const confidenceScore = Math.max(...score) * 100;
  
	  const label = confidenceScore >= 50 ? 'Cancer' : 'Non-cancer';
  
	  let suggestion;
	  if (label === 'Cancer') {
		suggestion = "Segera periksa ke dokter!";
	  } else {
		suggestion = "Penyakit kanker tidak terdeteksi.";
	  }
  
	  console.log(`Prediction result: ${label}, Confidence: ${confidenceScore}`);
	  return { confidenceScore, label, suggestion };
	} catch (error) {
	  console.error('Error in prediction process:', error.message);
  
	  // Tangkap kesalahan ClientError
	  if (error instanceof ClientError) {
		throw error; // Pastikan status 400 tetap dipertahankan
	  }
  
	  // Jika kesalahan lain muncul, lempar error generik
	  throw new Error('Terjadi kesalahan dalam melakukan prediksi');
	}
  }

module.exports = predictClassification;