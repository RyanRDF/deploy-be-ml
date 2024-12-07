const { Firestore } = require('@google-cloud/firestore');

const db = new Firestore();

const getData = async () => {
  try {
    const snapshotData = await db.collection('predictions').get();

    // Map over the documents to extract the data
    const allData = snapshotData.docs.map((doc) => ({
      id: doc.id,
      history: doc.data(),
    }));

    return allData;
  } catch (error) {
    console.error('Error fetching data from Firestore:', error);
    throw error;
  }
};

module.exports = getData;