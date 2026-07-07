const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI manquant dans .env');

  const dbName = process.env.NODE_ENV === 'test'
    ? `portfolio-test-${process.env.TEST_DB_SUFFIX || 'default'}`
    : 'portfolio';
  await mongoose.connect(uri, { dbName });
}

module.exports = { connectDB };
