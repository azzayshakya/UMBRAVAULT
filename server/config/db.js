const mongoose = require("mongoose");
const logger = require("../utils/logger");

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((mongooseInstance) => {
        logger.info("MongoDB connected successfully");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    logger.error(`MongoDB connection failed: ${err.message}`);

    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw err;
  }

  return cached.conn;
};

module.exports = connectDB;
