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


/** @format */

const tf = require("@tensorflow/tfjs-node");
const InputError = require("../exceptions/InputError");

async function predictClassification(model, image) {
	try {
		if (image.length > 1024 * 1024) throw new InputError("Ukuran gambar terlalu besar. Maksimum 1MB.");

		const tensor            = tf.node.decodeJpeg(image).resizeNearestNeighbor([224, 224]).expandDims().toFloat();
		const prediction        = model.predict(tensor);
		const score             = await prediction.data();
		const confidenceScore   = Math.max(...score) * 100;
        
        let result = { confidenceScore, label: "Cancer", suggestion: "Segera periksa ke dokter!" };
        if (confidenceScore < 1) {
            result.label        = "Non-cancer";
            result.suggestion   = "Penyakit kanker tidak terdeteksi."
        }
        
        return result;
    } catch (error) {
		throw new InputError("Terjadi kesalahan dalam melakukan prediksi");
	}
}

module.exports = predictClassification;