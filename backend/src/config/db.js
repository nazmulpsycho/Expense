import { dirname } from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import config from "./index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const ensureIndexes = async () => {
  // Mongoose auto-indexes on first connect; nothing required here.
};

export default async function connectDB() {
  if (!config.mongoUri) {
    throw new Error("MONGO_URI environment variable is required");
  }
  const db = await mongoose.connect(config.mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  await ensureIndexes();
  console.log(`MongoDB connected: ${db.connection.host}/${db.connection.name}`);
}
