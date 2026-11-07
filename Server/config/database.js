const mongoose = require('mongoose');

/**
 * Builds the connection string from the environment.
 *  - MONGO_URI          full connection string (preferred, e.g. mongodb://127.0.0.1:27017/ocial_media_data)
 *  - DB_USERNAME/DB_PASSWORD/DB_URL   legacy Atlas pieces, kept for existing deployments
 */
function getMongoUri() {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  const { DB_USERNAME, DB_PASSWORD, DB_URL } = process.env;
  if (DB_USERNAME && DB_PASSWORD && DB_URL) {
    return `mongodb+srv://${encodeURIComponent(DB_USERNAME)}:${encodeURIComponent(DB_PASSWORD)}@${DB_URL}/ocial_media_data?retryWrites=true&w=majority`;
  }

  throw new Error('Database is not configured. Set MONGO_URI (or DB_USERNAME, DB_PASSWORD and DB_URL) in .env');
}

async function connection() {
  mongoose.set('strictQuery', false);
  await mongoose.connect(getMongoUri());
  console.log('db connected');
}

module.exports = connection;
