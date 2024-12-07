require('dotenv').config();  // Load .env file

const tf = require('@tensorflow/tfjs-node');

const loadModel = async () => {
  try {
    // Check if the MODEL_URL is correctly loaded from the .env file
    console.log('Model URL:', process.env.MODEL_URL);

    if (!process.env.MODEL_URL) {
      throw new Error('MODEL_URL is not defined in the .env file.');
    }

    const model = await tf.loadGraphModel(process.env.MODEL_URL);
    return model;
  } catch (error) {
    console.error('Error loading model:', error);
    throw new Error('Failed to load the model. Please check the model URL and try again.');
  }
};
 
module.exports = loadModel; 