
const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/ClientError');

 
async function predictClassification(model, image) {
	try {
	  console.log('Start prediction process');
	  const tensor = tf.node
		.decodeJpeg(image)
		.resizeNearestNeighbor([224, 224])
		.expandDims()
		.toFloat();
  
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
	  throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
	}
  }

module.exports = predictClassification;
