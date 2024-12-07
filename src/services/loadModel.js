require('dotenv').config();  // Load .env file

const tf = require('@tensorflow/tfjs-node');

const loadModel = async () => {
  try {
    console.log('Attempting to load model from:', process.env.MODEL_URL);
    if (!process.env.MODEL_URL) {
      throw new Error('MODEL_URL is not defined in the .env file.');
    }

    const model = await tf.loadGraphModel(process.env.MODEL_URL);
    console.log('Model loaded successfully');
    return model;
  } catch (error) {
    console.error('Error loading model:', error.message);
    throw new Error('Gagal memuat model. Periksa URL model dan coba lagi.');
  }
};
 
module.exports = loadModel; 