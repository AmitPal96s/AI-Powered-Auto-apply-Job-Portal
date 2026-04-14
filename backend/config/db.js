// config/db.js
const mongoose = require("mongoose");

let cachedConnection = null;
let cachedPromise = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI?.trim();

    if (!mongoUri) {
      throw new Error(
        "MONGO_URI is not set. Add it to your Vercel environment variables."
      );
    }

    if (cachedConnection || mongoose.connection.readyState === 1) {
      return cachedConnection || mongoose.connection;
    }

    if (!cachedPromise) {
      cachedPromise = mongoose.connect(mongoUri);
    }

    cachedConnection = await cachedPromise;
    console.log(`MongoDB Connected: ${cachedConnection.connection.host}`);
    return cachedConnection;
  } catch (error) {
    cachedPromise = null;
    console.error(`MongoDB Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
