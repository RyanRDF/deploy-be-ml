
// const tf = require('@tensorflow/tfjs-node');
// const InputError = require('../exceptions/ClientError');

 
// async function predictClassification(model, image) {
//   try {
//     const tensor = tf.node
//     .decodeJpeg(image)
//     .resizeNearestNeighbor([224, 224])
//     .expandDims()
//     .toFloat()
 
//   const prediction = model.predict(tensor);
//   const score = await prediction.data();
//   const confidenceScore = Math.max(...score) * 100;
 
//   // const classes = ['Cancer', 'Non-cancer'];
 
//   // const classResult = tf.argMax(prediction, 1).dataSync()[0];
//   // const label = classes[classResult];
 
//   let result = { confidenceScore, label: "Cancer", suggestion: "Segera periksa ke dokter!" };
//   if (confidenceScore < 1) {
//       result.label        = "Non-cancer";
//       result.suggestion   = "Penyakit kanker tidak terdeteksi."
//   }
  
//   return result;
//   } catch (error) {
// throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
// }
// }
  
// //   if (label === 'Cancer') {
// //     suggestion = "Segera periksa ke dokter!"
// //   }
 
// //   if (label === 'Non-cancer') {
// //     suggestion = "Penyakit kanker tidak terdeteksi."
// //   }
// //   return { confidenceScore, label, suggestion };
// //   } catch (error) {
// //     throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
// //   }
// // }

// module.exports = predictClassification;


// const tf = require("@tensorflow/tfjs-node");
// const InputError = require("../exceptions/InputError");

// async function predictClassification(model, image) {
// 	try {
// 		if (image.length > 1024 * 1024) throw new InputError("Ukuran gambar terlalu besar. Maksimum 1MB.");

// 		const tensor            = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();
// 		const prediction        = model.predict(tensor);
// 		const score             = await prediction.data();
// 		const confidenceScore   = Math.max(...score) * 100;
        
//         let result = { confidenceScore, label: "Cancer", suggestion: "Segera periksa ke dokter!" };
//         if (confidenceScore < 1) {
//             result.label        = "Non-cancer";
//             result.suggestion   = "Penyakit kanker tidak terdeteksi."
//         }
        
//         return result;
//     } catch (error) {
// 		throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
// 	}
// }

// module.exports = predictClassification;

const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/ClientError');

const predictClassification = async (model, image) => {
  try {
    let imageBuffer;

    // Check if the image is a string and starts with base64 encoding prefix
    if (typeof image === 'string' && image.startsWith('data:image/jpeg;base64,')) {
      const base64Data = image.replace(/^data:image\/jpeg;base64,/, "");
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else if (Buffer.isBuffer(image)) {
      // If the image is already a buffer, use it directly
      imageBuffer = image;
    } else {
      // Log error if image format is not as expected
      console.error('Invalid image format detected');
      throw new InputError('Invalid image format');
    }

    // Ensure that imageBuffer is not empty
    if (!imageBuffer || imageBuffer.length === 0) {
      console.error('Image buffer is empty or invalid');
      throw new InputError('Image data is empty or invalid');
    }

    const tensor = tf.node
      .decodeJpeg(imageBuffer)  // Use imageBuffer which is a valid image data
      .resizeNearestNeighbor([224, 224])  // Resize the image
      .expandDims()  // Add batch dimension
      .toFloat();  // Convert to float32 tensor

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const resultScore = Math.max(...score) * 100;

    const label = resultScore >= 50 ? 'Cancer' : 'Non-cancer';

    const suggestion =
      label === 'Cancer'
        ? 'Segera periksa ke dokter!'
        : 'Penyakit kanker tidak terdeteksi.';

    return { label, suggestion };
  } catch (error) {
    console.error('Prediction error:', error);
    throw new InputError('Terjadi kesalahan dalam melakukan prediksi');
  }
};


module.exports = predictClassification;