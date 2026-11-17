const mongoose = require('mongoose');

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Falta la variable MONGODB_URI. Revisa el archivo .env.');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log('Base de datos MongoDB conectada correctamente.');
}

module.exports = connectDatabase;

